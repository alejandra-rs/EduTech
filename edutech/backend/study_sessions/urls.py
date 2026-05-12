from django.urls import path

from . import views

urlpatterns = [
    path("",             views.StudySessionListCreateView.as_view(), name="study_sessions"),
    path("<int:pk>/",    views.StudySessionDetailView.as_view(),     name="study_session_detail"),
    path("<int:pk>/star/",     views.StudySessionStarView.as_view(),    name="study_session_star"),
    path("<int:pk>/comments/", views.StudySessionCommentView.as_view(), name="study_session_comments"),
    path("<int:pk>/stream/", views.StreamView.as_view(), name="study_session_stream"),
    path("twitch/auth/",     views.TwitchAuthView.as_view(),     name="twitch_auth"),
    path("twitch/callback/", views.TwitchCallbackView.as_view(), name="twitch_callback"),
    path("twitch/status/",   views.TwitchStatusView.as_view(),   name="twitch_status"),
    path("<int:pk>/chat/", views.TwitchSendMessageView.as_view(), name="study_session_chat"),
]
