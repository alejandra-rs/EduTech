from django.urls import path
from . import views

urlpatterns = [
    path("folders/root/", views.FolderRootView.as_view(), name="folder_root"),
    path("folders/", views.FolderCreateView.as_view(), name="folder_create"),
    path("folders/<int:pk>/", views.FolderDetailView.as_view(), name="folder_detail"),
    path("folders/<int:pk>/move/", views.FolderMoveView.as_view(), name="folder_move"),
    path("posts/", views.SavedPostView.as_view(), name="saved_post_create"),
    path("posts/<int:pk>/", views.SavedPostView.as_view(), name="saved_post_detail"),
    path(
        "posts/<int:pk>/move/",
        views.SavedPostMoveView.as_view(),
        name="saved_post_move",
    ),
    path("posts/check/<int:post_id>/", views.CheckSavedPostView.as_view(), name="saved_post_check"),
    path("pinned/", views.PinnedPostView.as_view(), name="pinned_post_list"),
]
