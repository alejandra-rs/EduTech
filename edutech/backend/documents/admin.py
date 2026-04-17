from django.contrib import admin

# Register your models here.
from .models import Post, Like, Comment, Dislike, PDFAttachment, YoutubeVideo

admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(Dislike)
admin.site.register(PDFAttachment)
admin.site.register(YoutubeVideo)
