from django.db import models
from .university import University


class Degree(models.Model):
    name = models.CharField(max_length=80)
    university = models.ForeignKey(University, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["university", "name"], name="unique_university_degree"
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.university})"
