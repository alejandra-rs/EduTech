from django.urls import path
from . import views

urlpatterns = [
    path('upload/pdf/', views.PDFUploadView.as_view(), name='upload_pdf'),
    path('upload/video/', views.VideoUploadView.as_view(), name='upload_video'),
    path('download/pdf/<int:post_id>', views.PDFDownloadView.as_view(), name='download_pdf'),
    path('comments/', views.CommentCreateView.as_view(), name='create_comment'),
    path('likes/', views.LikeView.as_view(), name='like'),
    path('likes/<int:pk>', views.LikeView.as_view(), name='like_delete'),
    path('dislikes/', views.DislikeView.as_view(), name='dislike'),
    path('dislikes/<int:pk>', views.DislikeView.as_view(), name='dislike_delete'),
    path('', views.PostListView.as_view(), name='list_posts'),
]
