from django.db import models

class University(models.Model):
    name = models.CharField(max_length=80)
    location = models.CharField(max_length=80)

    def __str__(self):
        return self.name