from django.contrib import admin

# Register your models here.
from .models import Course, Year, Subscription, University, Degree

admin.site.register(Course)
admin.site.register(Year)
admin.site.register(Subscription)
admin.site.register(University)
admin.site.register(Degree)