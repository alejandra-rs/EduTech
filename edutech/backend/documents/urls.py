from django.urls import path
from . import views

urlpatterns = [
    path('upload/pdf/', views.PDFUploadView.as_view(), name='upload_pdf'),
    path('upload/video/', views.VideoUploadView.as_view(), name='upload_video'),
    path("download/pdf/<int:post_id>", views.PDFDownloadView.as_view(), name='download_pdf'),
    path('', views.PostListView.as_view(), name='list_posts'),
]
