from django.db import models


class CommentReport(models.Model):
    reason = models.ForeignKey(
        "ReportReason", on_delete=models.CASCADE, related_name="comment_reports"
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "users.Student", on_delete=models.CASCADE, related_name="comment_reports"
    )
    comment = models.ForeignKey(
        "documents.Comment", on_delete=models.CASCADE, related_name="reports"
    )


class Report(models.Model):
    reason = models.ForeignKey(
        "ReportReason", on_delete=models.CASCADE, related_name="reports"
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "users.Student", on_delete=models.CASCADE, related_name="reports"
    )
    post = models.ForeignKey(
        "documents.Post", on_delete=models.CASCADE, related_name="reports"
    )


class ReportReason(models.Model):
    reason = models.CharField(max_length=200)

    def __str__(self):
        return self.reason


class ReportResolution(models.Model):
    report = models.OneToOneField(
        Report, on_delete=models.CASCADE, related_name="resolution"
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_by = models.ForeignKey(
        "users.Student",
        on_delete=models.SET_NULL,
        null=True,
        related_name="resolved_reports",
    )
