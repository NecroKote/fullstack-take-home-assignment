"""
Playlist service module.

If it were any other framework than Django, it would be a service class with
methods and an injected dependency on db registries.
"""

from enum import Enum
from typing import cast

from django.db.transaction import atomic

from .. import models

PkTypeTuple = (int, str)
PkType = int | str
TrackOrId = models.Track | PkType
PlaylistTrackOrId = models.PlaylistTrack | PkType
PlaylistOrId = models.Playlist | PkType

class SwitchPosition(Enum):
    BEFORE = 0
    AFTER = 1


def _playlist_id(playlist: PlaylistOrId) -> PkType:
    if isinstance(playlist, PkTypeTuple):
        return playlist
    elif isinstance(playlist, models.Playlist):
        return playlist.pk
    else:
        raise ValueError("`playlist` should be either a `int`, `str` or a `Playlist`.")


def _track_id(track: TrackOrId) -> PkType:
    if isinstance(track, PkTypeTuple):
        return track
    elif isinstance(track, models.Track):
        return track.pk
    else:
        raise ValueError(
            "`track` should be either a `int`, `str` or a `Track`."
        )

def _playlist_track_id(track: PlaylistTrackOrId) -> PkType:
    if isinstance(track, PkTypeTuple):
        return track
    elif isinstance(track, models.PlaylistTrack):
        return track.pk
    else:
        raise ValueError(
            "`track` should be either a `int`, `str` or a `PlaylistTrack`."
        )

def _playlist_track_id_and_track(track: PlaylistTrackOrId) -> tuple[PkType, models.PlaylistTrack]:
    if isinstance(track, PkTypeTuple):
        return track, models.PlaylistTrack.objects.get(track_id=track)
    elif isinstance(track, models.PlaylistTrack):
        return track.pk, track
    else:
        raise ValueError("`track` should be either a `int` or a `PlaylistTrack`.")


def _last_track(playlist: PkType) -> models.PlaylistTrack | None:
    """Return the last track in the playlist."""
    return models.PlaylistTrack.objects.filter(playlist=playlist, next=None).first()


def get_playlist_tracks(playlist: PlaylistOrId, prefetch_tracks=True):
    """
    Retrieve `RawQuerySet` of `models.PlaylistTrack` in the playlist order.
    `prefetch_tracks` controls whether to prefetch related tracks.
    """

    playlist_id = _playlist_id(playlist)

    PlaylistTrackTable = models.PlaylistTrack._meta.db_table
    TrackTable = models.Track._meta.db_table

    # use recursive CTE to retrieve playlist tracks in the right order
    # NOTE: f-string expansion here is safe because it's not user input
    tracks = models.PlaylistTrack.objects.raw(
        f"""
        WITH
            RECURSIVE playlist_tracks AS (
                SELECT id as pk, * FROM "{PlaylistTrackTable}"
                    WHERE playlist_id = %s AND previous_id IS NULL
                UNION
                SELECT plt.id as pk, plt.*
                    FROM "{PlaylistTrackTable}" plt
                JOIN playlist_tracks ON plt.previous_id = playlist_tracks.id
            )
        SELECT * FROM playlist_tracks
        --- SELECT * FROM "{TrackTable}"
        --- RIGHT JOIN playlist_tracks ON api_track.id = playlist_tracks.track_id
        """,
        [playlist_id],
    )

    # TODO: find a better place for those prefetches
    if prefetch_tracks:
        tracks = tracks.prefetch_related(
            "track",
            "track__genres",
            "track__moods",
            "track__main_artists",
            "track__featured_artists",
        )

    return tracks


def add_track_to_playlist(playlist: PlaylistOrId, track_or_id: TrackOrId):
    """
    Add a track to the playlist at the end.
    """

    playlist_id = _playlist_id(playlist)
    track_id = _track_id(track_or_id)
    last_track = _last_track(playlist_id)

    # use atomic transaction to ensure consistency
    with atomic():
        new_track = models.PlaylistTrack.objects.create(
            playlist_id=playlist_id,
            track_id=track_id,
            previous=last_track,
        )

        if last_track:
            last_track.next = new_track
            last_track.save()
    
    return new_track


def remove_track_from_playlist(track_or_id: PlaylistTrackOrId):
    """
    Remove a track from the playlist.
    """

    _, track = _playlist_track_id_and_track(track_or_id)

    # use atomic transaction to ensure consistency
    with atomic():
        previous_track = cast(models.PlaylistTrack | None, track.previous)
        next_track = cast(models.PlaylistTrack | None, track.next)

        if previous_track:
            previous_track.next = next_track
            previous_track.save()

        if next_track:
            next_track.previous = previous_track
            next_track.save()

        track.delete()


def switch_tracks_in_playlist(
    source: PlaylistTrackOrId,
    destination: PlaylistTrackOrId,
    position: SwitchPosition
):
    """
    Switch the position of two tracks in the playlist.
    """

    def _pl_track(track_or_id: PlaylistTrackOrId):
        return models.PlaylistTrack.objects.prefetch_related("next", "previous").get(pk=_playlist_track_id(track_or_id))

    def _opt_track(obj):
        return cast(models.PlaylistTrack | None, obj)

    # TODO: store all the models that we are goind to change in 
    # TODO: ... a lookup table, so that we minimise the number of update queries

    with atomic():
        # "extract" source track
        source = _pl_track(source)
        sp, sn = _opt_track(source.previous), _opt_track(source.next)
        source.next = source.previous = None  # just in case
        if sp:
            sp.next = sn
            sp.save()
        if sn:
            sn.previous = sp
            sn.save()

        # insert `source` into relative relative `position` from `destination`
        destination = _pl_track(destination)
        if position == SwitchPosition.BEFORE:
            source.previous = destination.previous
            source.next = destination
            if dp := destination.previous:
                dp.next = source
                dp.save()

            destination.previous = source

        else:
            source.previous = destination
            source.next = destination.next
            if dn := destination.next:
                dn.previous = source
                dn.save()

            destination.next = source

        source.save()
        destination.save()
