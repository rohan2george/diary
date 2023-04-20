Diary Project

  A project in which a user can submit daily entries of whatever subject they choose as a diary or a place to keep important information. Diaries can also be made among another 
  user. It also comes with the functionality to make reminders with set dates and times

Distinctiveness and Complexity:

This project focuses on allowing users to create logs of daily events and allows users to create reminders for themselves and allows collaborative effort between multiple users to create entries in which information can be shared and edited together for specific topics.



My diary website is not similar to a social media because while a social media focuses on posting and getting likes, replies, etc. my project focuses on recording information and creating reminders. And although a user can post here, when collaborating with another user both users can create and edit all the entries made to update each other. My project is also not similar to an e-commerce site because there is nothing in relation to money and buying items online. The also  project does not include ways to create new bids either. My project is distinct because it allows users to have their own personal information be stored on their accounts, create reminders, and collaborate with other people when using shared diaries.

How to run your application:
  Run command prompt and access the file location of the application. Type in "python manage.py runserver".
  In the website the first thing it will ask the user is to log in or register. If registering an account 
  and the account is new the website will redirect to the users account. If logging in and the user exists
  the website redirects the user to their account. To create a new diary entry click on "New Diary Entry" 
  and fill out the subject and body. To view diary entries create by the user click on "Diary Entries". To 
  create a new reminder, click on "New Reminders" and fill in the subject, body, and date.  To view reminders 
  created by the user click on "Reminders". To start a shared diary with another user click on "New Shared 
  Diary" and fill in the title of the shared diary, the user that the diary is being shared with, and the 
  first subject and diary of the shared entry.  To view shared diary entries "Shared Diaries", and onn that 
  page click on which shared diary you want to find. There you can create more entries for the shared diary 
  by typing in the subject and body. Each entry and reminder can be edited and deleted with their corresponding 
  buttons. To log out click "Log out".

Any other additional information the staff should know about your project:
  This project uses cookies to add csrf tokens to javascript. It is also mobile-responsive.
  
Python:
  -views.py
    new_entry: used to create a new entry for the diary
    new_reminedr: used to create a new reminder
    new_shared: creates a shared diary for two users to add new entries to
    view_entry: used to access entires and reminders
    view_shared: used to access a list of shared diaries and the entries in seperate shared diaries
    change_entry: edits entries or reminders
    change_shared: edits shared entries
    login_view: allows user to login to theor account
    logout_view: logs out user
    register: creates an new account for a user
  -models.py
    User: basic user model
    Entry: this model has fields for the user(as a ForeignKey), subject (as a CharField), body (as a TextField), timestamp(as a DateTimeField), 
            a reminder time in case the entry is a reminder(as a DateTimeField), and a checker to see if the entry is a reminder(as a BooleanField)
    SharedEntry: this model has fields for the user(as a ForeignKey), subject (as a CharField), body (as a TextField), timestamp(as a DateTimeField), 
           the other user's email(as a ManyToManyField), and an indicator of who the current writer is(as a ForeignKey)
  -urls.py
    each url connects to a corresponding function

HTML:
  -index.html: If the user is not authenticated they are put into a login page that asks for the user information, if the user wants to create a new account they must click "Register". If the user is authenticated layout allows the user to create new entries, reminders or shared diaries and shows all diary entries.
  -layout.html: If the user is authenticated the use can choose to create or access entries, reminders and shared diaries, the body is adjusted by javascript.
  -register.html: creates a new user for the website
  
JavaScript: index.js function list
  -getCookie: used only to get csrf token for javascript
  -newreminder: creates new reminder by getting subject, body and inputted date(from input type "datetime-local")
  -newpost: creates new diary entry by getting the subject and body
  -shared_diary: if the function has page="new" it creates a new share diary with another user, the newpost function is used to create new entries within shared diaries. If the function has page="view" it shows a list of shared diary titles
  -edit_entry: checks to see if the entry to be edited is in a shared diary or is a reminder, and if it is neither the entry is treated like a regular diary entry and when the function finds what the entry is, the new information get PUT into the database
  -delete_entry: checks to see type of entry like edit_entry and deletes entry by id when found
  -viewentry: if page="entries" shows diary entries, and if page="reminders" shows reminders
  -shared_entry: by getting the title of the shared diary this shows all entries hat have the title of the diary
