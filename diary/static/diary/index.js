document.addEventListener('DOMContentLoaded', function() {


	document.querySelector('#new_entry').addEventListener('click', newentry);
  document.querySelector('#reminder').addEventListener('click', newreminder);
	document.querySelector('#view_entry').addEventListener('click', () => viewentry('entries'));
  document.querySelector('#view_reminder').addEventListener('click', () => viewentry('reminders'));
  document.querySelector('#all_shared').addEventListener('click', () => shared_diary('view'));
  document.querySelector('#shared').addEventListener('click', () => shared_diary('new'));

  //view diary entries as default
	viewentry('entries');

});

function newreminder() {

  document.querySelector('#post-view').style.display = 'none';
  document.querySelector('#newpost').style.display = 'none';
  document.querySelector('#newreminder-view').style.display = 'block';
  document.querySelector('#newshare-view').style.display = 'none';
  document.querySelector('#sharedtitles-view').style.display = 'none';

    //Empty input boxes
    document.querySelector('#body').value = '';
    document.querySelector('#subjects').value = '';
    document.querySelector('#reminderdate').value = '';

    document.querySelector('#compose').onsubmit = () =>{

      //get csrf token
      const csrftoken = getCookie('csrftoken');
      const request = new Request(
        '/reminder',
        {headers: {'X-CSRFToken': csrftoken}}
      );

      //save and post submitted values
      const cbod = document.querySelector('#body').value;
      const csub = document.querySelector('#subjects').value;
      const ctim = document.querySelector('#reminderdate').value;

      fetch(request, {
        method: 'POST',
          body: JSON.stringify({
              subject: csub,
              body: cbod,
              remindtime: ctim,
              isreminder: true
          })
      })
      .then(response => response.json())
      .then(result => {
      // Print result
          console.log(result);
      //return to reminder list
          viewentry('reminders');
      });
      return false;
  }
}

function newentry() {

	document.querySelector('#post-view').style.display = 'none';
  document.querySelector('#newpost').style.display = 'block';
  document.querySelector('#newreminder-view').style.display = 'none';
  document.querySelector('#newshare-view').style.display = 'none';
  document.querySelector('#sharedtitles-view').style.display = 'none';

    //Empty input boxes
  	document.querySelector('#compose-body').value = '';
    document.querySelector('#subject').value = '';

  	document.querySelector('#compose-form').onsubmit = () =>{
      //get csrf token
      const csrftoken = getCookie('csrftoken');
      const request = new Request(
        '/entry',
        {headers: {'X-CSRFToken': csrftoken}}
      );

      //Save and post submitted values
  		const cbod = document.querySelector('#compose-body').value;
      const csub = document.querySelector('#subject').value;
  		fetch(request, {
     		method: 'POST',
        	body: JSON.stringify({
              subject:csub,
          		body: cbod,
              isreminder: false,
      		})
    	})
    	.then(response => response.json())
    	.then(result => {
    	// Print result
        	console.log(result);
      //return to entry list
          viewentry('entries');
    	});
    	return false;
	}
}

function edit_entry(id, isreminder, isshared){
  document.querySelector('#post-view').style.display = 'none';
  document.querySelector('#newpost').style.display = 'block';
  document.querySelector('#newreminder-view').style.display = 'none';
  document.querySelector('#newshare-view').style.display = 'none';
  document.querySelector('#sharedtitles-view').style.display = 'none';

  //check if entry is a shared entry
  if(isshared=="True"){
      fetch('entry/share')
    .then(response => response.json())
    .then(posts => {
       //get subject and body of entry to be editted
    for (i = 0; i < posts.length; i += 1){
      entry_id=JSON.stringify(posts[i].id);
      entry_id=parseInt(entry_id);
      if(entry_id==id){
      bod=JSON.stringify(posts[i].body);
      sub=JSON.stringify(posts[i].subject);
      sub = sub.replace('"','').replace('"','');
      bod = bod.replace('"','').replace('"','');
      bod = bod.replace(new RegExp("\\\\n", "g"), "<br/>");
    }
}
    //input values of subject and body tp be editted
    document.querySelector('#compose-body').value = bod;
    document.querySelector('#subject').value = sub;

    document.querySelector('#compose-form').onsubmit = () =>{

      //get csrf token
      const csrftoken = getCookie('csrftoken');
      const request = new Request(
        `/shared/${id}`,
        {headers: {'X-CSRFToken': csrftoken}}
      );

      //Save and put submitted values
      const cbod = document.querySelector('#compose-body').value;
      const csub = document.querySelector('#subject').value;
    fetch(`/entry/share`)
    .then(response => response.json())
    .then(posts => {

      fetch(request, {
      method: 'PUT',
      body: JSON.stringify({
      subject: csub,
      body:cbod
      })
    }).then(response => {
        for (i = 0; i < posts.length; i += 1){
          if(posts[i].id==id){
              title=JSON.stringify(posts[i].title);
              title = title.replace('"','').replace('"','');
              shared_entry(title);
          }
        }

    });
  });
    return false;
  }
  });
}else{
      fetch('entry/page')
    .then(response => response.json())
    .then(posts => {
    //get subject and body of entry to be editted
    for (i = 0; i < posts.length; i += 1){
      entry_id=JSON.stringify(posts[i].id);
      entry_id=parseInt(entry_id);
      if(entry_id==id){
      bod=JSON.stringify(posts[i].body);
      sub=JSON.stringify(posts[i].subject);
      rtim=JSON.stringify(posts[i].remindtime);
      rtim=rtim.replace('"','').replace('"','');
      sub = sub.replace('"','').replace('"','');
      bod = bod.replace('"','').replace('"','');
      bod = bod.replace(new RegExp("\\\\n", "g"), "<br/>");
    }
}
  //check if entry or reminder
if(isreminder=="True"){
  document.querySelector('#newpost').style.display = 'none';
  document.querySelector('#newreminder-view').style.display = 'block';
    //input values of subject and body tp be editted
  document.querySelector('#body').value = bod;
  document.querySelector('#subjects').value = sub;
  document.querySelector('#reminderdate').value = tim;

    document.querySelector('#compose').onsubmit = () =>{
      //get csrf token
      const csrftoken = getCookie('csrftoken');
      const request = new Request(
        `/entry/${id}`,
        {headers: {'X-CSRFToken': csrftoken}}
      );

    //Save and put submitted values
      const cbod = document.querySelector('#body').value;
      const csub = document.querySelector('#subjects').value;
      const ctim = document.querySelector('#reminderdate').value;

      fetch(request, {
      method: 'PUT',
      body: JSON.stringify({
      subject: csub,
      body:cbod,
      remindtime: ctim,
      })
    }).then(response => {
            //return to reminder list
            viewentry('reminders');
    });
    return false;
      }
}else{
    document.querySelector('#compose-body').value = bod;
    document.querySelector('#subject').value = sub;

    document.querySelector('#compose-form').onsubmit = () =>{

      //get csrf token
      const csrftoken = getCookie('csrftoken');
      const request = new Request(
        `/entry/${id}`,
        {headers: {'X-CSRFToken': csrftoken}}
      );

      //Save and put submitted values
      const cbod = document.querySelector('#compose-body').value;
      const csub = document.querySelector('#subject').value;

      fetch(request, {
      method: 'PUT',
      body: JSON.stringify({
      subject: csub,
      body:cbod
      })
    }).then(response => {
          //return to entry list
          viewentry('entries');
          
    });
    return false;
      }
    }
  });
}
}

function delete_entry(id, isreminder, isshared){

    //get csrf token
    const csrftoken = getCookie('csrftoken');

    //check if entry is shared
    if(isshared=="True"){
      const request = new Request(
      `/shared/${id}`,
      {headers: {'X-CSRFToken': csrftoken}}
      );

    //delete entry
    fetch(`/entry/share`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);

        fetch(request, {
        method: 'DELETE',
        }).then(response => {
        for (i = 0; i < posts.length; i += 1){
          if(posts[i].id==id){
              title=JSON.stringify(posts[i].title);
              title = title.replace('"','').replace('"','');
              shared_entry(title);
          }
        }
    });

    });
    }else{
      const request = new Request(
      `/entry/${id}`,
      {headers: {'X-CSRFToken': csrftoken}}
    );
    //delete entry
      fetch(request, {
      method: 'DELETE',
    }).then(response => {
          if(isreminder=="True"){
            viewentry('reminders');
          }
          else{
            viewentry('entries');
          }
    });
  }
}

function viewentry(page){

  document.querySelector('#post-view').style.display = 'block';
  document.querySelector('#newpost').style.display = 'none';
  document.querySelector('#newreminder-view').style.display = 'none';
  document.querySelector('#newshare-view').style.display = 'none';
  document.querySelector('#sharedtitles-view').style.display = 'none';

  	fetch(`/entry/page`)
  	.then(response => response.json())
  	.then(posts => {
        console.log(posts);

        m=[];
        //get vallues for current entry
        for (i = 0; i < posts.length; i += 1){
            entry_id=JSON.stringify(posts[i].id);
            entry_id=parseInt(entry_id);
            bod=JSON.stringify(posts[i].body);
            tim=JSON.stringify(posts[i].timestamp);
            sub=JSON.stringify(posts[i].subject);
            tim = tim.replace('"','').replace('"','');
            sub = sub.replace('"','').replace('"','');
            bod = bod.replace('"','').replace('"','').replace(new RegExp("\\\\n", "g"), "<br/>");
        //check if entry or reminder
        if(page=="entries"){ 
          //list entries
          if(JSON.stringify(posts[i].isreminder)=="false"){
          	m[i] = `<div class="column">
                    <h6>Date: ${tim}</h6>
                    <h6> Subject: ${sub}</h6>
                    <p>${bod}</p>
                    <button type="button" class="ed_button" id="edit" onclick="edit_entry(${entry_id}, 'False', 'False')">Edit Entry</button>
                    <button type="button" class="ed_button" id="delete" onclick="delete_entry(${entry_id}, 'False', 'False')">Delete Entry</button>
                  	</div>`;


          }
        }else if (page=="reminders"){
          //list reminders
          if(JSON.stringify(posts[i].isreminder)=="true"){
            date=JSON.stringify(posts[i].remindtime);
            date = date.replace('"','').replace('"','');
            rtim = moment(date);
            rtim =rtim.format('lll')
            m[i] = `<div class="column">
                    <h6>Reminder Date: ${rtim}</h6>
                    <h6> Subject: ${sub}</h6>
                    <p>${bod}</p>   
                    <button type="button" class="ed_button" id="edit" onclick="edit_entry(${entry_id}, 'True', 'False')">Edit Entry</button>
                    <button type="button" class="ed_button" id="delete" onclick="delete_entry(${entry_id}, 'True', 'False')">Delete Entry</button>
                    </div>
                    `;
        }
      }
      }
        document.querySelector('#post-view').innerHTML = `
        <h3>${page.charAt(0).toUpperCase() + page.slice(1)}</h3>
        `+m.join(' ');
  	});
}

function shared_diary(page){
  document.querySelector('#post-view').style.display = 'none';
  document.querySelector('#newpost').style.display = 'none';
  document.querySelector('#newreminder-view').style.display = 'none';
  document.querySelector('#newshare-view').style.display = 'block';
  document.querySelector('#sharedtitles-view').style.display = 'none';

  //check if new group or list of groups
  if(page=='new'){
    document.querySelector('#shared_compose').onsubmit = () =>{
      
    //get csrf token
      const csrftoken = getCookie('csrftoken');
      const request = new Request(
        '/share',
        {headers: {'X-CSRFToken': csrftoken}}
      );
      
      //Save and put submitted values
      const crec = document.querySelector('#recipients').value;
      const ctit = document.querySelector('#title').value;
      const cbod = document.querySelector('#nshared_body').value;
      const csub = document.querySelector('#nshared_subject').value;
      fetch(request, {
        method: 'POST',
          body: JSON.stringify({
              title:ctit,
              subject:csub,
              body: cbod,
              recipients:crec
          })
      })
      .then(response => response.json())
      .then(result => {
      // Print result
          console.log(result);
          shared_diary('view');
      });
      return false;
  }
  }
  if(page=='view'){
    document.querySelector('#newshare-view').style.display = 'none';
    document.querySelector('#sharedtitles-view').style.display = 'block';

    //list of shared entries
      fetch(`/entry/share`)
      .then(response => response.json())
      .then(entries => {
        console.log(entries);

          m = [];
          d = [];
          for (i = 0; i < entries.length; i += 1){
              title=JSON.stringify(entries[i].title);
              title = title.replace('"','').replace('"','')
              if(d.indexOf(title)<0){
              m[i] = `<div><button type='button' onclick = 'shared_entry("${title}")'>` + title + '</button></div>';
              d.push(title);
            }
          }

          document.querySelector('#sharedtitles-view').innerHTML = `
          <h3>Shared Diaries</h3>
          `+m.join(' ');
    });
  }
}

function shared_entry(titles){

  document.querySelector('#post-view').style.display = 'block';
  document.querySelector('#newpost').style.display = 'block';
  document.querySelector('#newreminder-view').style.display = 'none';
  document.querySelector('#newshare-view').style.display = 'none';
  document.querySelector('#sharedtitles-view').style.display = 'none';
        var r=[];

    // list ntries in a group 
    fetch(`/entry/share`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);

        m=[];

        for (i = 0; i < posts.length; i += 1){
          if(posts[i].title==titles){
            crec=JSON.stringify(posts[i].recipients);
            crec = crec.replace('["','').replace('"]','')
            r[i]=crec
            bod=JSON.stringify(posts[i].body);
            bod = bod.replace('"','').replace('"','')
            tim=JSON.stringify(posts[i].timestamp);
            tim = tim.replace('"','').replace('"','')
            writ=JSON.stringify(posts[i].writer);
            writ = writ.replace('"','').replace('"','')
            sub=JSON.stringify(posts[i].subject);
            sub = sub.replace('"','').replace('"','')
            entry_id=JSON.stringify(posts[i].id);
            entry_id=parseInt(entry_id);
            m[i] = `<div class="column">
                    <h6>By: ${writ} </h6>
                    <h6>Date: ${tim}</h6>
                    <h6>Subject: ${sub}</h6>
                    <p>${bod}</p>
                    <button type="button" class="ed_button" id="edit" onclick="edit_entry(${entry_id}, 'False', 'True')">Edit Entry</button>
                    <button type="button" class="ed_button" id="delete" onclick="delete_entry(${entry_id}, 'False', 'True')">Delete Entry</button>
                    </div>
                    `;
          }
        }
        document.querySelector('#post-view').innerHTML = `
        <h3>Entries</h3>
        `+m.join(' ');

    //empty input boxes
    document.querySelector('#compose-body').value = '';
    document.querySelector('#subject').value = '';

    document.querySelector('#compose-form').onsubmit = () =>{

      //get csrf token
      const csrftoken = getCookie('csrftoken');
      const request = new Request(
        '/share',
        {headers: {'X-CSRFToken': csrftoken}}
      );
      
      //save and post entry
      const cbod = document.querySelector('#compose-body').value;
      const csub = document.querySelector('#subject').value;

      fetch(request, {
        method: 'POST',
          body: JSON.stringify({
              title: titles,
              subject:csub,
              body: cbod,
              recipients: crec
          })
      })
      .then(response => response.json())
      .then(result => {
      // Print result
          console.log(result);
          //gio back to shared entries
          shared_entry(titles);
      });
      return false;
  }
    });

}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}