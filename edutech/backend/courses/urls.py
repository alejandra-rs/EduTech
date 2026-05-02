from django.urls import path
from . import views

urlpatterns = [
    path("<int:pk>/", views.CourseDetailView.as_view(), name="course_detail"),
    path("years/", views.UserYearListView.as_view(), name="list_years"),
    path("years/<int:pk>", views.YearDetailView.as_view(), name="list_years"),
    path("sub/", views.SubscriptionView.as_view(), name="subscription"),
    path("sub/<int:pk>", views.SubscriptionView.as_view(), name="sub_delete"),
    path(
        "sub/student/<int:student_id>",
        views.SubscriptionByStudentView.as_view(),
        name="subscription_by_student",
    ),
    path(
        "universities/", views.UniversityListCreate.as_view(), name="list_universities"
    ),
    path(
        "universities/<int:pk>/",
        views.UniversityDetail.as_view(),
        name="university_detail",
    ),
    path("degree/", views.DegreeListCreate.as_view(), name="list_degree"),
    path(
        "study-sessions/",
        views.StudySessionListCreateView.as_view(),
        name="study_sessions",
    ),
    path(
        "study-sessions/<int:pk>/",
        views.StudySessionDetailView.as_view(),
        name="study_session_detail",
    ),
    path(
        "study-sessions/<int:pk>/star/",
        views.StudySessionStarView.as_view(),
        name="study_session_star",
    ),
    path(
        "study-sessions/<int:pk>/comments/",
        views.StudySessionCommentView.as_view(),
        name="study_session_comments",
    ),
    path("", views.CourseListCreate.as_view(), name="list_courses"),
]
