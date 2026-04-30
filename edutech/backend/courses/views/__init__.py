from .university import (
    UniversityListCreate as UniversityListCreate,
    UniversityDetail as UniversityDetail,
)
from .degree import DegreeListCreate as DegreeListCreate
from .year import UserYearListView as UserYearListView
from .courses import (
    CourseDetailView as CourseDetailView,
    CourseListCreate as CourseListCreate,
)
from .subscription import (
    SubscriptionView as SubscriptionView,
    SubscriptionByStudentView as SubscriptionByStudentView,
)
