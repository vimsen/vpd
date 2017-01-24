function updateVGWComponents(applianceName, applianceValue) {

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
    if (applianceName.search("CPUload") != -1) {
        // console.log("CPUload: " + applianceName + " applianceValue:"+applianceValue);
        // want to change the icon? no problem:
        // convert value to percentage
        var percentageValue = (parseFloat(applianceValue) ).toFixed(2);
        // console.log("applian################::"+applianceName+"::%"+percentageValue);
        $("[topicid='" + applianceName + "']").each(function() {
            $(this).text(percentageValue + '%');
        });

    } else if (applianceName.search("CPUtemp") != -1) {
        // console.log("CPUload: " + applianceName + " applianceValue:"+applianceValue);
        // want to change the icon? no problem:
        // convert value to percentage
        var percentageValue = parseFloat(applianceValue).toFixed(0);
        // console.log("applian################::"+applianceName+"::%"+percentageValue);
        $("[topicid='" + applianceName + "']").each(function() {
            $(this).text(percentageValue);
        });

    } else if (applianceName.search("RAM") != -1) {
        //  console.log("RAM: " + applianceName + " applianceValue:"+applianceValue);
        //get the ram ids by macadrres
        // var freeRAM = parseFloat($("#"+macAddress+'_RAMfree').text());
        // var totalRAM = parseFloat($("#"+macAddress+'_RAMtotal').text());

        //console.log("freeRAM: " + freeRAM);
        // want to change the icon? no problem:
        // convert value to percentage

        // console.log("applian################::"+applianceName+"::%"+percentageValue);
        $("[topicid='" + applianceName + "']").each(function() {
            $(this).text(applianceValue);
        });

        var freeRAM = ((parseFloat($("#" + macAddress + '_RAMfree').text()) / parseFloat($("#" + macAddress + '_RAMtotal').text())) * 100).toFixed(0);
        var usedRAM = ((parseFloat($("#" + macAddress + '_RAMused').text()) / parseFloat($("#" + macAddress + '_RAMtotal').text())) * 100).toFixed(0);
        // console.log("freeRAM: " + freeRAM);

        $("#" + macAddress + '_RAMfreeBar').width(freeRAM + '%');
        $("#" + macAddress + '_RAMusedBar').width(usedRAM + '%');

    } else {
        $("[topicid='" + applianceName + "']").each(function() {
            $(this).text(applianceValue);
        });
    };

}