$(document).ready(function() {

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
    }

    showUserProfile(profile);

});