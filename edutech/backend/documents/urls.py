from django.urls import path
from . import views

urlpatterns = [
    path("<int:pk>", views.PostDetailView.as_view(), name="view_post"),
    path(
        "delete/<int:pk>/<int:student_id>",
        views.PostDeleteView.as_view(),
        name="delete_post",
    ),
    path("upload-draft/", views.UploadPDFDraftView.as_view(), name="upload_pdf_draft"),
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
    path("drafts/", views.DraftListView.as_view(), name="draft_list"),
    path("drafts/<int:pk>/", views.DraftDetailView.as_view(), name="draft_detail"),
    path("revision/", views.RevisionListView.as_view(), name="revision_list"),
    path("revision/publish/<int:pk>/", views.RevisionPublishView.as_view(), name="revision_publish"),
    path("revision/<int:pk>/", views.RevisionDeleteView.as_view(), name="revision_delete"),
    path("", views.PostListView.as_view(), name="list_posts"),
    path(
        "reports/reasons/", views.ReportReasonListView.as_view(), name="report_reasons"
    ),
    path("reports/", views.ReportListView.as_view(), name="list_reports"),
    path(
        "reports/resolve/<int:post_pk>/",
        views.ReportResolveView.as_view(),
        name="resolve_report",
    ),
    path("reports/<int:pk>/", views.ReportDeleteView.as_view(), name="delete_report"),
    path(
        "reports/post/<int:post_pk>/",
        views.ReportDeleteView.as_view(),
        name="delete_post_reports",
    ),
    path(
        "reports/<int:report_pk>/resolution/",
        views.ReportResolutionView.as_view(),
        name="report_resolution",
    ),
    path(
        "reports/comments/",
        views.CommentReportCreateView.as_view(),
        name="create_comment_report",
    ),
    path("reports/check/", views.ReportCheckView.as_view(), name="check_report"),
]
