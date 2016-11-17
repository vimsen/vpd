$(document).ready(function() {
    var auth0 = null;
    auth0 = new Auth0({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        callbackOnLocationHash: true,
        callbackURL: 'http://127.0.0.1:8080/dashboard.html',
    });

    $('#btn-login').on('click', function(ev) {
        ev.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        ar = username.split("@");
        localStorage.setItem('vpName', ar[0]);
        auth0.login({
            connection: 'Username-Password-Authentication',
            responseType: 'token',
            email: username,
            password: password,
        }, function(err) {
            if (err) {
                alert("Something went wrong: " + err.message);
            } else {
                show_logged_in(username);
            }
        });
    });

    var show_logged_in = function(username) {
        //window.location = "dashboard.html";
    };

    var show_sign_in = function() {};

});