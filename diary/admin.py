from django.contrib import admin
from .models import User, Entry

# Register your models here.

admin.site.register(Entry)
admin.site.register(User)