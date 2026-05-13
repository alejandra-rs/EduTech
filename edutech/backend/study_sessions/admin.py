from django.contrib import admin

from .models import StudySession, StudySessionComment, TwitchCredential

admin.site.register(StudySession)
admin.site.register(StudySessionComment)
admin.site.register(TwitchCredential)
