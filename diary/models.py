from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Entry(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="entry")
    subject = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    remindtime = models.DateTimeField(auto_now_add=False, auto_now=False, blank=True, null=True)
    isreminder = models.BooleanField(default=False)
	
    def serialize(self):
        return {
            "id": self.id,
            "subject": self.subject,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %#d, %Y %#I:%M %p"),
            "remindtime": self.remindtime,
            "isreminder": self.isreminder,
        }

class SharedEntry(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="sharedentry")
    title= models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    recipients = models.ManyToManyField("User", related_name="invite_received")
    writer =  models.ForeignKey("User", on_delete=models.CASCADE, related_name="writer")
	
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "subject": self.subject,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %#d %Y, %#I:%M %p"),
            "recipients": [user.email for user in self.recipients.all()],
            "writer": self.writer.username
        }