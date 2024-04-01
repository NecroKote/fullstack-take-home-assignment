from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"tracks", views.TrackViewSet)
router.register(r"playlists", views.PlaylistViewSet)
router.register(
    rf"playlists/(?P<{views.PLAYLIST_ID}>[^/.]+)/tracks",
    views.PlaylistTrackViewSet,
    basename="playlist-tracks",
)

urlpatterns = [
    path("", include(router.urls)),
]
