function updateWeatherComponents(applianceName, applianceValue) {

    // console.log("applianceName: " + applianceName + " applianceValue:"+applianceValue);

    var reState = /.*state[/]+(.*)+[/]state.*/;
    var reCommand = /.*command[/]+(.*)+[/]command.*/;
    //var reMac = /([a-zA-Z][0-9])([^/]*)/;
    var reMac = /[\/](.*?)\//;

    //get the macadress
    var macAddress = applianceName.match(reMac)[1];
    // console.log("updateComponents nmacAddress: " + macAddress);

    //update attributes by getting the topicid
    // $("#"+applianceName).text(applianceValue);
    //check if contains icon attribute
    if (applianceName.search("icon") != -1) {

        // want to change the icon? no problem:
        // console.log("applianceName: " + applianceName + " applianceValue:"+applianceValue);
        var skycons = new Skycons({
            "color": "white"
        });
        // start animation!
        skycons.play();
        skycons.set(applianceName, applianceValue);

    } else if (applianceName.search("temperature") != -1) {

        // want to change the icon? no problem:
        // convert value to percentage
        // start animation!
        var newValue = parseInt(applianceValue);
        // console.log("applian################::"+applianceName+"::%"+percentageValue);
        $("[topicid='" + applianceName + "']").each(function() {
            $(this).text(newValue);
        });

    } else if (applianceName.search("humidity") != -1 || applianceName.search("cloudCover") != -1 || applianceName.search("precipProbability") != -1) {

        // want to change the icon? no problem:
        // convert value to percentage
        // start animation!
        var percentageValue = (parseFloat(applianceValue) * 100).toFixed(2);
        // console.log("applian################::"+applianceName+"::%"+percentageValue);
        $("[topicid='" + applianceName + "']").each(function() {
            $(this).text(percentageValue);
        });

    } else {
        $("[topicid='" + applianceName + "']").each(function() {
            $(this).text(applianceValue);
        });
    };

}