import django

from ..models import Playlist, PlaylistTrack, Track
from ..services import playlist

class PlaylistTestCase(django.test.TestCase):

    def setUp(self) -> None:
        self.playlilst = Playlist.objects.create(name='Test Playlist')
    
    def tearDown(self) -> None:
        self.playlilst.delete()
    
    def test_add_track(self):
        track = Track.objects.first()
        playlist.add_track_to_playlist(self.playlilst, track)

        self.assertEqual(PlaylistTrack.objects.count(), 1)
        self.assertEqual(PlaylistTrack.objects.first().track, track)
        self.assertEqual(PlaylistTrack.objects.first().playlist, self.playlilst)

    def test_remove_track(self):
        track = Track.objects.first()
        playlist.add_track_to_playlist(self.playlilst, track)

        self.assertEqual(PlaylistTrack.objects.count(), 1)

        playlist.remove_track_from_playlist(PlaylistTrack.objects.first())

        self.assertEqual(PlaylistTrack.objects.count(), 0)

    def test_tracks_are_in_order_and_linked(self):
        number_of_tracks = 3
        tracks = list(Track.objects.all()[:number_of_tracks])
        for track in tracks:
            playlist.add_track_to_playlist(self.playlilst, track)

        self.assertEqual(PlaylistTrack.objects.count(), number_of_tracks)

        playlist_tracks: list[PlaylistTrack] = list(playlist.get_playlist_tracks(self.playlilst, True))

        # check that all objects are linked together
        for index, obj in enumerate(playlist_tracks):
            if index == 0:
                self.assertIsNone(obj.previous)
            else:
                self.assertEqual(obj.previous, playlist_tracks[index - 1])

            self.assertEqual(obj.track, tracks[index])

            if index == number_of_tracks - 1:
                self.assertIsNone(obj.next)
            else:
                self.assertEqual(obj.next, playlist_tracks[index + 1])

    def test_add_same_track_multiple_times(self):
        number_of_tracks = 3
        track = Track.objects.first()
        for _ in range(number_of_tracks):
            playlist.add_track_to_playlist(self.playlilst, track)

        self.assertEqual(PlaylistTrack.objects.count(), number_of_tracks)

        # check that all objects are linked together
        objects = list(PlaylistTrack.objects.all())
        for obj in objects:
            self.assertEqual(obj.track, track)

    def test_move_track(self):
        number_of_tracks = 3
        tracks = list(Track.objects.all()[:number_of_tracks])
        for track in tracks:
            playlist.add_track_to_playlist(self.playlilst, track)

        self.assertEqual(PlaylistTrack.objects.count(), number_of_tracks)


        # move the first track to the end - 1, 2, 0
        playlist_tracks: list[PlaylistTrack] = list(playlist.get_playlist_tracks(self.playlilst, True))
        playlist.switch_tracks_in_playlist(playlist_tracks[0], playlist_tracks[-1], playlist.SwitchPosition.AFTER)

        playlist_tracks = list(playlist.get_playlist_tracks(self.playlilst, True))

        self.assertEqual(playlist_tracks[0].track, tracks[1])
        self.assertEqual(playlist_tracks[-1].track, tracks[0])

        # move the middle track to the beginning - 2, 1, 0
        playlist.switch_tracks_in_playlist(playlist_tracks[1], playlist_tracks[0], playlist.SwitchPosition.BEFORE)
        playlist_tracks = list(playlist.get_playlist_tracks(self.playlilst, True))

        self.assertEqual(playlist_tracks[0].track, tracks[2])

        # move the last track to the middle - 2, 0, 1
        playlist.switch_tracks_in_playlist(playlist_tracks[-1], playlist_tracks[1], playlist.SwitchPosition.BEFORE)
        playlist_tracks = list(playlist.get_playlist_tracks(self.playlilst, True))

        self.assertEqual(playlist_tracks[0].track, tracks[2])
        self.assertEqual(playlist_tracks[1].track, tracks[0])
        self.assertEqual(playlist_tracks[-1].track, tracks[1])
