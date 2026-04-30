from django.db import models

class University(models.Model):
    name = models.CharField(max_length=80)
    location = models.CharField(max_length=80)
    logo = models.ImageField(
        blank=True, null=True, upload_to="logo_universities/", max_length=255
    )

    def __str__(self):
        return self.name