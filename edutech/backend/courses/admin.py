from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Course, Year, Subscription

admin.site.register(Course)
admin.site.register(Year)
admin.site.register(Subscription)