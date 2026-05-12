from django.contrib import admin

from .models import StudySession, StudySessionComment

admin.site.register(StudySession)
admin.site.register(StudySessionComment)
