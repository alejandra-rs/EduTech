from django.db import models
from courses.models import University, Degree


class Student(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    password = models.CharField(max_length=50)
    picture = models.ImageField(
        blank=True, null=True, upload_to="images/", max_length=255
    )

    universities = models.ManyToManyField(University, blank=True)

    degree = models.ManyToManyField(Degree, blank=True)

    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ["last_name", "first_name"]
        indexes = [
            models.Index(fields=["first_name", "last_name"]),
        ]
