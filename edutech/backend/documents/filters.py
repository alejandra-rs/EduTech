import django_filters
from .models import Post


class PostFilter(django_filters.FilterSet):
    post_type = django_filters.MultipleChoiceFilter(choices=Post.CONTENT_TYPES)
    search_title = django_filters.CharFilter(
        field_name="title", lookup_expr="icontains"
    )
    course = django_filters.NumberFilter(field_name="course")

    class Meta:
        model = Post
        fields = ["post_type", "search_title", "course"]
