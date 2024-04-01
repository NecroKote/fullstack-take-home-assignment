"""
Playlist service module.

If it were any other framework than Django, it would be a service class with
methods and an injected dependency on db registries.
"""

from typing import Optional, Union, cast

from django.db.transaction import atomic

from .. import models

TrackOrId = Union[models.PlaylistTrack, int | str]
PlaylistOrId = Union[models.Playlist, int | str]


def _playlist_id(playlist: PlaylistOrId):
    if isinstance(playlist, (int, str)):
        return playlist
    elif isinstance(playlist, models.Playlist):
        return cast(int, playlist.pk)
    else:
        raise ValueError("`playlist` should be either a `int`, `str` or a `Playlist`.")


def _track_id(track: TrackOrId):
    if isinstance(track, (int, str)):
        return track
    elif isinstance(track, models.PlaylistTrack):
        return cast(int, track.pk)
    else:
        raise ValueError(
            "`track` should be either a `int`, `str` or a `PlaylistTrack`."
        )


def _track_id_and_track(track: TrackOrId):
    if isinstance(track, int):
        return track, models.PlaylistTrack.objects.get(track_id=track)
    elif isinstance(track, models.PlaylistTrack):
        return cast(int, track.pk), track
    else:
        raise ValueError("`track` should be either a `int` or a `PlaylistTrack`.")


def _last_track(playlist: models.Playlist):
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
    last_track = _last_track(playlist)

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


def remove_track_from_playlist(
    track_or_id: models.PlaylistTrack | str,
):
    """
    Remove a track from the playlist.
    """

    _, track = _track_id_and_track(track_or_id)

    # use atomic transaction to ensure consistency
    with atomic():
        previous_track = cast(Optional[models.PlaylistTrack], track.previous)
        next_track = cast(Optional[models.PlaylistTrack], track.next)

        if previous_track:
            previous_track.next = next_track
            previous_track.save()

        if next_track:
            next_track.previous = previous_track
            next_track.save()

        track.delete()
