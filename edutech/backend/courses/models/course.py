from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=80)
    year = models.ForeignKey("Year", on_delete=models.CASCADE)
    semester = models.IntegerField()

    class Meta:
        unique_together = (("name", "year", "semester"),)
        indexes = [
            models.Index(fields=["name"]),
        ]