from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Post
from .notifications import notify_subscribers_of_new_post


@receiver(post_save, sender=Post)
def post_created(sender, instance, created, **kwargs):
    if created and not instance.is_draft:
        notify_subscribers_of_new_post(instance)
