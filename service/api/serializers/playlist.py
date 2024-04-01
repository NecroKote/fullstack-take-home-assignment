from rest_framework import serializers

from .. import models
from .track import TrackSerializer


class PlaylistSerializer(serializers.ModelSerializer):
    tracks = serializers.HyperlinkedIdentityField(
        view_name="playlist-tracks-list", lookup_url_kwarg="playlist_id"
    )

    class Meta:
        model = models.Playlist
        fields = ["id", "name", "tracks"]


class PlaylistTrackCreateSerializer(serializers.ModelSerializer):
    track = serializers.SlugRelatedField(
        slug_field="id", queryset=models.Track.objects.all()
    )

    class Meta:
        model = models.PlaylistTrack
        fields = [
            "track",
        ]


class PlaylistTrackSerializer(serializers.ModelSerializer):
    track = TrackSerializer()

    class Meta:
        model = models.PlaylistTrack
        fields = [
            "id",
            "track",
        ]
