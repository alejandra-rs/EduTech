from django.db import models
from .degree import Degree


class Year(models.Model):
    year = models.PositiveSmallIntegerField()
    degree = models.ForeignKey(Degree, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["year", "degree"], name="unique_year_degree"
            )
        ]

    def __str__(self):
        return f"{self.year} {self.degree}"
