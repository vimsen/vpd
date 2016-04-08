 var client = new Messaging.Client("94.70.239.217", 8000, "myclientid_" + parseInt(Math.random() * 100, 10));

 //Gets  called if the websocket/mqtt connection gets disconnected for any reason
 client.onConnectionLost = function (responseObject) {
     //Depending on your scenario you could implement a reconnect logic here
     alert("connection lost: " + responseObject.errorMessage);
 };

 //Gets called whenever you receive a message for your subscriptions
 client.onMessageArrived = function (message) {
	  //console.log("onMessageArrived message destinationName::"+message.destinationName);
     //Do something with the push message you received
    // $('#messages').append('<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>');
    //call function to clear text and refresh components
    //console.log("current window:"+window.location.pathname);
    if(window.location.pathname==='/weather.html') {
        updateWeatherComponents(message.destinationName, message.payloadString);
    } else if(window.location.pathname==='/vgwinfo.html') {
        updateVGWComponents(message.destinationName, message.payloadString);
    } else {
        updateComponents(message.destinationName, message.payloadString);
    }
    
 };

 //Connect Options
 var options = {
     timeout: 3,
     //Gets Called if the connection has sucessfully been established
     onSuccess: function () {
         alert("Connected");
     },
     //Gets Called if the connection could not be established
     onFailure: function (message) {
         alert("Connection failed: " + message.errorMessage);
     }
 };

 //PUBLISH
 //Creates a new Messaging.Message Object and sends it to the HiveMQ MQTT Broker
 var publish = function (payload, topic, qos) {
     //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
     console.log("publish Topic payload::"+payload+" topic::"+topic);
     var message = new Messaging.Message(payload);
     message.destinationName = topic;
     message.qos = qos;
     client.send(message);
 }
