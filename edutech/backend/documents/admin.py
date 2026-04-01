from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Post, Like, Comment, Dislike

admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(Dislike)