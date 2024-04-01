from django.db import models


class Playlist(models.Model):
    name = models.CharField(max_length=255, null=False)

    def __str__(self):
        return f"{self.name}"


class PlaylistTrack(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)

    # TODO: maybe replace on_delete with SET_DEFAULT and a protected "Track" called "<Removed Track>"
    track = models.ForeignKey("Track", on_delete=models.CASCADE)

    previous = models.OneToOneField(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
        unique=False,
    )
    next = models.OneToOneField(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
        unique=False,
    )

    class Meta:
        unique_together = ["playlist", "previous", "next"]

    def __str__(self):
        return f"{self.playlist} - {self.track}"
