from django.db import models
from treebeard.mp_tree import MP_Node


class Folder(MP_Node):
    student = models.ForeignKey(
        "users.Student",
        on_delete=models.CASCADE,
        related_name="folders",
    )
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    node_order_by = ["name"]

    def __str__(self):
        return f"{self.student} / {self.name}"
