from django.db import models


class Student(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    password = models.CharField(max_length=50)
    picture = models.ImageField(
        blank=True, null=True, upload_to="images/", max_length=255
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ["last_name", "first_name"]
        indexes = [
            models.Index(fields=["first_name", "last_name"]),
        ]
