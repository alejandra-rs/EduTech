from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Post, Liked, Comments, DisLikes

admin.site.register(Post)
admin.site.register(Liked)
admin.site.register(Comments)
admin.site.register(DisLikes)