from django.contrib import admin

# Register your models here.
from .models import (Post, Like, Comment, Dislike, PDFAttachment, YoutubeVideo, 
                     Quiz, Question, Answer, FlashCardDeck, FlashCard)

admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(Dislike)
admin.site.register(PDFAttachment)
admin.site.register(YoutubeVideo)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(FlashCardDeck)
admin.site.register(FlashCard)
