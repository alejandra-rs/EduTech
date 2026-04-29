from django.db import models
from .degree import Degree

class Year(models.Model):
    year = models.IntegerField()
    degree = models.ForeignKey(Degree, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.year} {self.degree}"