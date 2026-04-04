from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=80)
    year = models.ForeignKey('Year', on_delete=models.CASCADE)
    semester = models.IntegerField()
    class Meta:
        unique_together = (('name', 'year', 'semester'),)
        indexes = [
            models.Index(fields=['name']),
        ]


class Year(models.Model) :
    year = models.IntegerField()
    def __str__(self):
        return f'{self.year}'


class Subscription(models.Model):
    user = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
