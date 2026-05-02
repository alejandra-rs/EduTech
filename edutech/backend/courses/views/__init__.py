from .university import (
    UniversityListCreate as UniversityListCreate,
    UniversityDetail as UniversityDetail,
)
from .degree import DegreeListCreate as DegreeListCreate
from .year import UserYearListView as UserYearListView, YearDetailView as YearDetailView
from .courses import (
    CourseDetailView as CourseDetailView,
    CourseListCreate as CourseListCreate,
)
from .subscription import (
    SubscriptionView as SubscriptionView,
    SubscriptionByStudentView as SubscriptionByStudentView,
)
from .study_session import StudySessionListCreateView as StudySessionListCreateView
from .study_session import StudySessionDetailView as StudySessionDetailView
from .study_session import StudySessionStarView as StudySessionStarView
from .study_session import StudySessionCommentView as StudySessionCommentView
