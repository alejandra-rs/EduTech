from django.db import models

from .validators import validate_twitch_url


class StudySession(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    scheduled_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="study_sessions",
        null=True,
        blank=True,
    )
    creator = models.ForeignKey(
        "users.Student",
        on_delete=models.CASCADE,
        related_name="created_study_sessions",
    )
    participants = models.ManyToManyField(
        "users.Student",
        related_name="participating_study_sessions",
        blank=True,
    )

    twitch_link = models.URLField(blank=True, validators=[validate_twitch_url])
    
    stream_task_id = models.CharField(max_length=255, blank=True)
    
    broadcaster_twitch_id = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.title} — {self.course.name if self.course else 'Divulgativa'} ({self.scheduled_at:%Y-%m-%d %H:%M})"


class StudySessionComment(models.Model):
    session = models.ForeignKey(
        StudySession, on_delete=models.CASCADE, related_name="session_comments"
    )
    student = models.ForeignKey(
        "users.Student",
        on_delete=models.CASCADE,
        related_name="study_session_comments",
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.student} on {self.session}"


class TwitchCredential(models.Model):

    student = models.OneToOneField(
        "users.Student",
        on_delete=models.CASCADE,
        related_name="twitch_credential",
    )
    twitch_user_id = models.CharField(max_length=50)
    twitch_login = models.CharField(max_length=50)
    access_token = models.TextField()
    refresh_token = models.TextField()
    token_expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.student} → @{self.twitch_login}"
