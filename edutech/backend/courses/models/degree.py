from django.db import models
from .university import University


class Degree(models.Model):
    name = models.CharField(max_length=80)
    university = models.ForeignKey(University, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("name", "university")

    def __str__(self):
        return f"{self.name} ({self.university})"
