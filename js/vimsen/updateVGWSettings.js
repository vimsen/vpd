function updateVGWSettings(applianceName, applianceValue) {

	var substrings = applianceName.split("/")

	macaddress = substrings[1];
	if(substrings[2].indexOf("sla_type") > -1 ){
		$("select[name=sla_type_" + macaddress + "]").val(applianceValue).change(); 
	} 
	else if (substrings[2].indexOf("duration_start") > -1) {
		$("#duration_start_"+ macaddress + "").timepicker('setTime', new Date("Thu, 01 Jan 1970 " + applianceValue));
	}
	else if (substrings[2].indexOf("duration_stop") > -1) {
		$("#duration_stop_"+ macaddress + "").timepicker('setTime', new Date("Thu, 01 Jan 1970 " + applianceValue));
	}
	else if(substrings[2].indexOf("max_reduction") > -1 ){
		$("select[name=max_reduction_" + macaddress + "]").val(applianceValue).change(); 
	} 
	else if(substrings[2].indexOf("min_reliability") > -1 ){
		$("select[name=min_reliability_" + macaddress + "]").val(applianceValue).change(); 
	} 
	else if (substrings[2].indexOf("penalty") > -1) {
		$("#penalty_"+ macaddress + "").val(applianceValue).change();
	}
	else if (substrings[2].indexOf("min_price") > -1) {
		$("#min_price_"+ macaddress + "").val(applianceValue).change();
	}
	else if (substrings[2].indexOf("plugs") > -1) {
		var passive_plugs = applianceValue.split(',');
		$("#plugs_" + macaddress).selectpicker('val', passive_plugs); 
	}

	$('.selectpicker').selectpicker('refresh');
	$('.timepicker').timepicker('refresh');


}