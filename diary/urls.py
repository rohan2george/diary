from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
	
    path("entry", views.new_entry, name="new_entry"),
    path("entry/page", views.view_entry, name="view_entry"),
    path("reminder", views.new_reminder, name="new_reminder"),
    path("share", views.new_share, name="new_share"),
    path("entry/share", views.view_shared, name="view_shared"),
    path("entry/<int:entry_id>", views.change_entry, name="change_entry"),
	path("shared/<int:shared_id>", views.change_shared, name="change_shared")
]