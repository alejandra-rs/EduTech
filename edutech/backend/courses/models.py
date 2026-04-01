from django.db import models



class Course(models.Model):
    name = models.CharField(max_length=80)
    year = models.ForeignKey('Year', on_delete=models.CASCADE)
    class Meta:
        verbose_name_plural = 'Subjects'
        unique_together = (('name', 'year'),)
        indexes = [
            models.Index(fields=['name']),
        ]


class Year(models.Model) :
    year = models.IntegerField()
    def __str__(self):
        return f'{self.year}'

class Subscriptions(models.Model):
    user = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    assignment = models.ForeignKey(Course, on_delete=models.CASCADE)

