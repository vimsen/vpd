var MY = {};
MY.dateFrom;
MY.dateTo;
MY.selectedVGWs;

var AUTH0_CLIENT_ID = 'ExUNBNX4IdOaPftyZV2CfomwjlFFcrKf';
var AUTH0_DOMAIN = 'vimsen.eu.auth0.com';
var AUTH0_CALLBACK_URL = location.href;

var auth0 = null;
auth0 = new Auth0({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
});

var parseHash = function() {

    var token = localStorage.getItem('id_token');
    if (null == token) {
        var result = auth0.parseHash(window.location.hash);
        if (result && result.idToken) {
            localStorage.setItem('id_token', result.idToken);
            auth0.getProfile(result.idToken, function(err, profile) {
                if (err) {
                    localStorage.removeItem('id_token');
                    localStorage.removeItem('profile');
                    localStorage.removeItem('vpName');
                } else {
                    localStorage.setItem('id_token', result.idToken);
                    localStorage.setItem('profile', JSON.stringify(profile));
                    localStorage.setItem('vpName', profile.nickname);
                }
            });

        } else if (result && result.error) {
            window.location = "login.html";
        } else {
            window.location = "login.html";
        }
    } else if (window.location.pathname == "/index.html" ||
        window.location.pathname == "/login.html" ||
        window.location.pathname == "/") {
        window.location = "dashboard.html";
    }

};

parseHash();

var logoutRemoveItem = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('vpName');
    vgwFile = "";
    window.location = "login.html";
}