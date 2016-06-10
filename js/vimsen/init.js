var MY = {};

//vlue to keep cookie for session
MY.cookie = "";

//value to keep role
MY.role = "";


MY.UTC = 0;// 2 * 60 * 60 * 1000;

MY.file = "";

MY.dateFrom;
MY.dateTo;
MY.selectedVGWs;

//users list. This must be changes with secure login from the DB (INTELEN)
MY.users = [{
    "username":"telint",
    "password":"123"
},{
    "username":"glimperop",
    "password":"123"
},{
    "username":"hedno",
    "password":"123"
},{
    "username":"sedini",
    "password":"123"
}];

var vgwFile = localStorage.getItem("vgwFile");

$(document).ready(function () {
   console.log("addAppliances:::: container:: vgw file::"+vgwFile);
   if(vgwFile.length=0){
        window.location = "login.html";
   }

   //$('#alertLogin').on('closed.bs.alert', function () {
   //$('#errorDiv').hide();
  //})

});

function authenticate() {
    console.log("authenticate");
    var un = document.getElementById("i-username").value;
    // console.log(un.value);
    var pw = document.getElementById("i-password").value;
    var currentObject = {
        "username":un,
        "password":pw 
         };

    var springuser;
    var errorMsg;

    //check credentials
    console.log($.inArray(currentObject, MY.users));
    //console.log(MY.users.some(function(item) { return item.username === un }) );

    for (var i=0, l=MY.users.length; i<l; i++) {
    if (typeof MY.users[i] == "object" && MY.users[i].username === un && MY.users[i].password === pw) {
       console.log(MY.users[i]);
        // Store
        localStorage.setItem("vgwFile", "js/vimsen/user/"+un+".json");
       // MY.file = "js/vimsen/"+un+".json";
       window.location = "dashboard.html";
    } else {
       $('#errorDiv').show();      
    }
  }

   
    /*$.ajax({

        // The 'type' property sets the HTTP method.
        // A value of 'PUT' or 'DELETE' will trigger a preflight request.
        type: 'GET',
        // The URL to make the request to.
       // url: 'http://79.129.116.32:8080/Dessin/oauth/token?grant_type=password&client_id=my-trusted-client-with-secret&client_secret=somesecret&username=' + un + '&password=' + pw + '',
        url: MY.protocol + '://' + MY.ip + ':' + MY.port + '/' + MY.path + '/rest/authenticate/' + un + '/' + pw + '',

        // The 'contentType' property sets the 'Content-Type' header.
        // The JQuery default for this property is
        // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
        // a preflight. If you set this value to anything other than
        // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
        // you will trigger a preflight request.
        //contentType: 'application/xml',
        xhrFields: {
            // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
            // This can be used to set the 'withCredentials' property.
            // Set the value to 'true' if you'd like to pass cookies to the server.
            // If this is enabled, your server must respond with the header
            // 'Access-Control-Allow-Credentials: true'.
            withCredentials: false
        },

        headers: {
            // Set any custom headers here.
            // If you set any non-simple headers, your server must include these
            // headers in the 'Access-Control-Allow-Headers' response header.
          //  'Access-Control-Allow-Origin': 'http://localhost:8080'
        },

        success: function (result) {
            //check if object
            
            console.log("success:" + result);
             window.location = "liveLocation.html";
             setCookie("username", un, 30);
            //set role to true or false
           //  getCookie("username") === 'admin' ? MY.role = 'admin' : $('.role').css({ display: 'none !important' });
             if (getCookie("username") === 'admin') {

             } else {
                
             }
            
            
        },
        error: function (result) {
            console.log("error:" + result.statusText);
            //https://github.com/stanlemon/jGrowl
            $.jGrowl(result.statusText + ', please try again',
                   { theme: 'growl-error', header: "ERROR", position: 'center', life: 1500 });

            // ajaxComplete(result, un);
        }
    });
*/
   


}


function logout() {
    console.log("logout::");
    //deleteCookie();
}