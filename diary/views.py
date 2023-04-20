import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Entry, SharedEntry


def index(request):
    return render(request, "diary/index.html")

def new_share(request):
	
	#Check for POST request
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
	
	#Check for recipients
    data = json.loads(request.body)
    emails = [email.strip() for email in data.get("recipients").split(",")]
    if emails == [""]:
        return JsonResponse({
            "error": "At least one recipient required."
        }, status=400)

    recipients = []
    for email in emails:
        try:
            user = User.objects.get(email=email)
            recipients.append(user)
        except User.DoesNotExist:
            return JsonResponse({
                "error": f"User with email {email} does not exist."
            }, status=400)


    title = data.get("title", "")
    subject = data.get("subject", "")
    body = data.get("body", "")

    # Create shared diary entries
    users = set()
    users.add(request.user)
    users.update(recipients)
    for user in users:
        share = SharedEntry(
            user=user,
            title=title,
            subject=subject,
            body=body,
            writer=request.user,
        )
        share.save()
        for recipient in recipients:
            share.recipients.add(recipient)
        share.save()

    return JsonResponse({"message": "Post created successfully."}, status=201)


def new_entry(request):
	#Check for POST request
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
	
    data = json.loads(request.body)
    body = data.get("body", "")
    subject = data.get("subject", "")
    remindtime = data.get("remindtime", "")
    isreminder = data.get("isreminder", "")
	
	#Add new entry
    users = set()
    users.add(request.user)
    for user in users:
        entry = Entry(
            user=user,
            subject=subject,
            body=body,
            isreminder=isreminder,
        )
        entry.save()

    return JsonResponse({"message": "Posted successfully."}, status=201)


def new_reminder(request):
	#Check for POST request
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
	
    data = json.loads(request.body)
    body = data.get("body", "")
    subject = data.get("subject", "")
    remindtime = data.get("remindtime", "")
    isreminder = data.get("isreminder", "")
	
	#Add new reminder
    users = set()
    users.add(request.user)
    for user in users:
        entry = Entry(
            user=user,
            subject=subject,
            body=body,
            remindtime=remindtime,
            isreminder=isreminder,
        )
        entry.save()

    return JsonResponse({"message": "Posted successfully."}, status=201)

def view_shared(request):
	#Get shared entries
    entries = SharedEntry.objects.filter(
            user=request.user
    )
	#Order by most recent
    entries = entries.order_by("-timestamp").all()
    return JsonResponse([entry.serialize() for entry in entries], safe=False)

def view_entry(request):
	#Get the entries
    entries = Entry.objects.filter(
            user=request.user
    )
	#Order by most recent
    entries = entries.order_by("-timestamp").all()
    return JsonResponse([entry.serialize() for entry in entries], safe=False)

def change_entry(request, entry_id):

    #Check if entry exists
    try:
        entry = Entry.objects.get(user=request.user, pk=entry_id)
    except Entry.DoesNotExist:
        return JsonResponse({"error": "Entry not found."}, status=404)

    # Update data
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("subject") is not None:
            entry.subject = data["subject"]
        if data.get("body") is not None:
            entry.body = data["body"]
        if data.get("remindtime") is not None:
            entry.remindtime = data["remindtime"]
        entry.save()
        return HttpResponse(status=204)

    elif request.method == "DELETE":
        entry.delete()
        return HttpResponse(status=204)

    # Request must be PUT or DELETE
    else:
        return JsonResponse({
            "error": "PUT or DELETE request required."
        }, status=400)

def change_shared(request, shared_id):
	#Check if entry exists
    try:
        shared = SharedEntry.objects.get(user=request.user, pk=shared_id)
    except SharedEntry.DoesNotExist:
        return JsonResponse({"error": "Entry not found."}, status=404)

    # Update data
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("subject") is not None:
            shared.subject = data["subject"]
        if data.get("body") is not None:
            shared.body = data["body"]
        shared.save()
        return HttpResponse(status=204)
    elif request.method == "DELETE":
        shared.delete()
        return HttpResponse(status=204)

    # Request must be PUT or DELETE
    else:
        return JsonResponse({
            "error": "PUT or DELETE request required."
        }, status=400)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "diary/index.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "diary/index.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "diary/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "diary/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "diary/register.html")
