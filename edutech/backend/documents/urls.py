from django.urls import path
from . import views
from django.urls import re_path
from . import consumers

urlpatterns = [
    path("<int:pk>", views.PostDetailView.as_view(), name="view_post"),
    path("upload/pdf/", views.PDFUploadView.as_view(), name="upload_pdf"),
    path("upload/vid/", views.VideoUploadView.as_view(), name="upload_video"),
    path("upload/quiz/", views.QuizUploadView.as_view(), name="upload_quiz"),
    path(
        "upload/flashcards/",
        views.FlashCardDeckUploadView.as_view(),
        name="upload_flashcards",
    ),
    path("<int:post_pk>/quiz/check/", views.QuizCheckView.as_view(), name="check_quiz"),
    path(
        "download/pdf/<int:post_id>",
        views.PDFDownloadView.as_view(),
        name="download_pdf",
    ),
    path("comments/", views.CommentView.as_view(), name="comments"),
    path("likes/", views.LikeView.as_view(), name="like"),
    path("likes/<int:pk>", views.LikeView.as_view(), name="like_delete"),
    path("dislikes/", views.DislikeView.as_view(), name="dislike"),
    path("dislikes/<int:pk>", views.DislikeView.as_view(), name="dislike_delete"),
    path("", views.PostListView.as_view(), name="list_posts"),
    path("drafts/", views.DraftListView.as_view(), name="draft_list"),
    path("drafts/<int:pk>/", views.DraftDetailView.as_view(), name="draft_detail"),
]


websocket_urlpatterns = [
    re_path(r'ws/documents/(?P<document_id>\w+)/$', consumers.DocumentStatusConsumer.as_asgi()),
]
