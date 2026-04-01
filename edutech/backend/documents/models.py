from django.db import models
from django.core.exceptions import ValidationError


class Post(models.Model):
    CONTENT_TYPES = (
        ('PDF', 'Documento PDF'),
        ('VID', 'Vídeo de YouTube'),
    )

    assignment = models.ForeignKey('courses.Course', on_delete=models.CASCADE)
    student = models.ForeignKey('users.Student', on_delete=models.SET_NULL, null=True, blank=True)

    title = models.CharField(max_length=200)
    description = models.TextField()

    post_type = models.CharField(max_length=3, choices=CONTENT_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'[{self.get_post_type_display()}] {self.title} - {self.student}'

    def clean(self):
        super().clean()
        if self.post_type in ['VID', 'PDF'] and not self.content_url:
            raise ValidationError("Los vídeos y documentos necesitan obligatoriamente una URL (content_url).")


class PDFAttachment(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE)
    file = models.FileField(upload_to="documents/")

    def clean(self):
        super().clean()
        # TODO: file size limit


class YoutubeVideo(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE)
    url = models.URLField()

    def clean(self):
        super().clean()
        # TODO: check that it matches with a valid youtube video URL


class Like(models.Model):
    user = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} {self.post}'

    class Meta:
        unique_together = (('user', 'post'),)
        indexes = [
            models.Index(fields=['user', 'post']),
        ]

class Dislike(models.Model):
    user = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} {self.post}'

    class Meta:
        unique_together = (('user', 'post'),)
        indexes = [
            models.Index(fields=['user', 'post']),
        ]


class Comment(models.Model):
    user = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.TextField()

    def __str__(self):
        return f'{self.user} {self.post}'