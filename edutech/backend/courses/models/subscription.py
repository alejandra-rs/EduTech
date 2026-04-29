from django.db import models
from .course import Course

class Subscription(models.Model):
    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)