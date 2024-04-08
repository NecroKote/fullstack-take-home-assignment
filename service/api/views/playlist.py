from typing import cast
from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets, status
from rest_framework.settings import api_settings
from rest_framework.decorators import action
from rest_framework.response import Response

from .. import models, serializers
from ..services import playlist as playlist_service

PLAYLIST_ID = "playlist_id"


class PlaylistViewSet(viewsets.ModelViewSet):
    """ViewSet for playlists."""

    queryset = models.Playlist.objects.all()
    serializer_class = serializers.PlaylistSerializer
    permission_classes = [permissions.AllowAny]
    lookup_url_kwarg = PLAYLIST_ID


class PlaylistTrackViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.CreateModelMixin,
    viewsets.mixins.DestroyModelMixin,
):
    """
    ViewSet for playlit's tracks.

    list - Retrieve all tracks in the playlist in the correct order
    create - Add a track to the playlist.
    destroy - Remove a track from the playlist.
    """

    permission_classes = [permissions.AllowAny]

    @property
    def playlist_id(self) -> int:
        return self.kwargs[PLAYLIST_ID]

    @property
    def playlist(self):
        obj = get_object_or_404(models.Playlist, id=self.playlist_id)
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.PlaylistTrackCreateSerializer
        elif self.action == "switch_places":
            return serializers.PlaylistTrackOrderSerializer

        return serializers.PlaylistTrackSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"playlist_id": self.playlist_id})
        return context

    def get_queryset(self):
        prefetch_tracks = self.action == "list"
        if self.action == "list":
            return playlist_service.get_playlist_tracks(
                self.playlist_id, prefetch_tracks
            )

        return models.PlaylistTrack.objects.filter(playlist_id=self.playlist_id)

    def perform_create(self, serializer: serializers.PlaylistTrackCreateSerializer):
        track_id = serializer["track"]
        playlist_service.add_track_to_playlist(self.playlist_id, track_id.value)

        #HACK: clanky wap to add the Location header to the response
        serializer._data[api_settings.URL_FIELD_NAME] = self.reverse_action(
            "list", [self.playlist_id]
        )

    def perform_destroy(self, instance: models.PlaylistTrack):
        playlist_service.remove_track_from_playlist(instance)
    
    @action(methods=["POST"], detail=False)
    def switch_places(self, request, *args, **kwargs):
        serializer = cast(serializers.PlaylistTrackOrderSerializer, self.get_serializer(data=request.data))
        serializer.is_valid(raise_exception=True)

        from_ = serializer["source"].value
        to_ = serializer["destination"].value
        pos = serializer["position"].value

        playlist_service.switch_tracks_in_playlist(from_, to_, pos)

        return Response(status=status.HTTP_204_NO_CONTENT)
