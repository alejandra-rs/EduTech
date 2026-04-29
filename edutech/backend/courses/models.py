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

class University(models.Model):
    name = models.CharField(max_length=80)
    location = models.CharField(max_length=80)

    def __str__(self):
        return self.name

class Degree(models.Model):
    name = models.CharField(max_length=80)
    university = models.ForeignKey(University, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("name", "university")

    def __str__(self):
        return f"{self.name} ({self.university})"

class Year(models.Model):
    year = models.IntegerField()
    degree = models.ForeignKey(Degree, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.year}"


class Subscription(models.Model):
    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
