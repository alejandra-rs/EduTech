from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=80)
    year = models.ForeignKey("Year", on_delete=models.CASCADE)
    semester = models.PositiveSmallIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "year", "semester"], name="unique_course"
            )
        ]
