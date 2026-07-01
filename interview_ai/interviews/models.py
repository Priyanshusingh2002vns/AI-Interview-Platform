from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class InterviewResult(models.Model):
    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )




    technology=models.CharField(max_length=20)
    question=models.TextField()
    answer=models.TextField()

    score=models.IntegerField(default=0)

    feedback=models.TextField(default="",blank=True)
    correct_answer=models.TextField(default="",blank=True)

    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.technology}"
    
    
