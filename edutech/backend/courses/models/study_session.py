from django.db import models


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
    )
    creator = models.ForeignKey(
        "users.Student", on_delete=models.CASCADE, related_name="study_sessions"
    )
    participants = models.ManyToManyField(
        "users.Student", related_name="participating_sessions", blank=True
    )

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.title} — {self.course.name if self.course else 'Divulgativa'} ({self.scheduled_at:%Y-%m-%d %H:%M})"


class StudySessionComment(models.Model):
    session = models.ForeignKey(
        StudySession, on_delete=models.CASCADE, related_name="session_comments"
    )
    student = models.ForeignKey(
        "users.Student", on_delete=models.CASCADE, related_name="study_session_comments"
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.student} on {self.session}"
