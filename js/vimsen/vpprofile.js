$(document).ready(function() {

    var user_id

    // set profile name
    document.getElementById("profile-name").innerHTML = localStorage.getItem('vpName');
    document.getElementById("profile-name2").innerHTML = localStorage.getItem('vpName');

    var profile = JSON.parse(localStorage.getItem('profile'));
    user_id = profile.user_id;

    var showUserProfile = function(profile) {
        document.getElementById('avatar').src = profile.picture;
        document.getElementById('name').textContent = profile.name;
        document.getElementById('email').textContent = profile.email;
        document.getElementById('nickname').textContent = profile.nickname;
        document.getElementById('created_at').textContent = profile.created_at;
        document.getElementById('updated_at').textContent = profile.updated_at;
        document.getElementById('contact').textContent = profile.user_metadata["contact"];
        document.getElementById('address').textContent = profile.user_metadata["address"];
    }

    showUserProfile(profile);

    document.getElementById('form-edit-profile').style.display = "none";
    document.getElementById('edit_Contact').value = profile.user_metadata["contact"];
    document.getElementById('edit_Address').value = profile.user_metadata["address"];

    document.getElementById('editProfile').addEventListener('click', function() {
        document.getElementById('form-profile').style.display = "none";
        document.getElementById('form-edit-profile').style.display = "block";
    });

    document.getElementById('saveProfile').addEventListener('click', function() {
        document.getElementById('form-profile').style.display = "block";
        document.getElementById('form-edit-profile').style.display = "none";

        var user_contact = document.getElementById('edit_Contact').value;
        var user_address = document.getElementById('edit_Address').value;

        var url = 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + user_id;
        var data = JSON.stringify({ user_metadata: {address: user_address, contact: user_contact} });
        var xhr = new XMLHttpRequest();
        xhr.open('PATCH', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Authorization',
                             'Bearer ' + localStorage.getItem('id_token'));
        xhr.onload = function() {
          if (xhr.status == 200) {
            localStorage.setItem('profile', xhr.responseText);
            showUserProfile(JSON.parse(xhr.responseText));
          } else {
            alert("Request failed: " + xhr.statusText);
          }
        };
        xhr.send(data);
    });

    document.getElementById('cancelProfile').addEventListener('click', function() {
        document.getElementById('form-profile').style.display = "block";
        document.getElementById('form-edit-profile').style.display = "none";
    });

});