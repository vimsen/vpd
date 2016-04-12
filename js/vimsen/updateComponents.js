function updateComponents(applianceName, applianceValue){
	 
   // console.log("applianceName: " + applianceName + " applianceValue:"+applianceValue);
    
    var reState = /.*state[/]+(.*)+[/]state.*/;
    var reCommand = /.*command[/]+(.*)+[/]command.*/;
    //var reMac = /([a-zA-Z][0-9])([^/]*)/;
    var reMac = /[\/](.*?)\//;
    
    //get the macadress
    var macAddress = applianceName.match(reMac)[1];
   // console.log("updateComponents nmacAddress: " + macAddress);




       if(applianceName.search("state") != -1){
       	var newtextApplianceName = applianceName.replace(reState, "$1");    
       }

       if(applianceName.search("command") != -1){
       	 newtextApplianceName = applianceName.replace(reCommand, "$1");    
        }
    // console.log("updateComponents new text: " + newtextApplianceName);

      //check if value from building item active inactive
      if(applianceValue.toUpperCase()=== 'ACTIVE') {
          applianceValue = 'ON';
      } 
      if(applianceValue.toUpperCase()=== 'INACTIVE') {
          applianceValue = 'OFF';
      } 

       //toggle swtich on or off depending the state
       var checked = applianceValue==='OFF'?true:false;
       //console.log("checked:"+checked);

      // console.log("updateComponents new text: " + newtextApplianceName);

       if(newtextApplianceName.search("production") !=-1) {
       	 //console.log("update production::"+newtextApplianceName);
       	// $("#"+newtextApplianceName+'_power').text(applianceValue);
         //we should update production percentage TODO
         //update battery chart
         if ( $( "#"+newtextApplianceName+macAddress).length>0 ) { 
           // console.log("update production::"+newtextApplianceName);
              
              //update battery pie chart!!
               if(newtextApplianceName.search("battery") !=-1) {
               // console.log("update battery::"+newtextApplianceName+macAddress+" value:"+applianceValue);
                 $("#"+newtextApplianceName+macAddress).text(parseFloat(applianceValue).toFixed(0));
                 $("#"+newtextApplianceName+"_pie"+macAddress).data('easyPieChart').update(applianceValue);
               } else {

                $("#"+newtextApplianceName+macAddress).text((parseFloat(applianceValue)*1000).toFixed(4));

                //UPDATE PEODUCTION PIE CHART
                //update pie charts inside appliance widget
                var percentage = 100*(parseFloat(applianceValue).toFixed(0) /parseFloat($("#totalPowerProduction").text()).toFixed(0));
          
                $("#"+newtextApplianceName+"_percent"+macAddress).text(parseInt(percentage).toFixed(0));
               if ( $( "#"+newtextApplianceName+"_percent"+macAddress).length>0 ) { 
                // console.log("percentage()::"+ percentage );
              //update pie chart!!
                 $("#"+newtextApplianceName+"_pie_percent"+macAddress).data('easyPieChart').update(percentage);
                }
              //END UPDATE PIE CHART



               }
          }

        //update production meterX totals
         var sum = 0;
         //get all values for class 
        $('.'+macAddress+'_powerValue').each(function()
        {
         // console.log("$(this) here:"+this.id);
           sum += parseFloat($(this).text());
        });
       // console.log("ID::"+newtextApplianceName+"sum:"+sum);
       //put new sum value
        $("#"+macAddress+"_totalPowerProduction").text((parseFloat(sum)/1000).toFixed(4));

        //update total production
         var totalProduction = 0;
      //get all values for class 
     // console.log("totalProduction:"+totalProduction);
      $('.productionPower').each(function()
        {
         // console.log("$(this) here:"+this.id);
           totalProduction += parseFloat($(this).text());

        });
       
      //  console.log("ID::"+newtextApplianceName+"sum:"+sum);
       //put new sum value
       // $("#totalPowerProduction").text((parseFloat(sum)/1000).toFixed(4));
       // console.log("totalProduction Final:"+totalProduction);
       $("#totalPowerProduction").text((totalProduction).toFixed(4));
          

       } else if(newtextApplianceName.search("_active_power_") !=-1) {
        // console.log("update production::"+newtextApplianceName+" value::"+applianceValue);
        // $("#"+newtextApplianceName+'_power').text(applianceValue);
         //we should update production percentage TODO
         //update battery chart
         //make value in KW ecept total power
         if(newtextApplianceName.search("GPXT") ===-1){
          applianceValue = 1000*applianceValue;
         }
         
         $("#"+newtextApplianceName).text(parseFloat(applianceValue).toFixed(4));
          //update pie charts inside appliance widget
          var percentage = 0.1*(parseFloat(applianceValue).toFixed(4) /parseFloat($("#totalPower").text()).toFixed(4));
          
         // console.log("UPDATED percentage new()::"+parseFloat(applianceValue).toFixed(4) );  
           // console.log("UPDATED percentage tp()::"+parseFloat($("#totalPower").text()).toFixed(4));          
          $("#"+newtextApplianceName+"_percent"+macAddress).text(parseInt(percentage).toFixed(0));
          if ( $( "#"+newtextApplianceName+"_percent"+macAddress).length>0 ) { 
              //console.log("percentage()::"+ element.name );
              //update pie chart!!
             $("#"+newtextApplianceName+"_pie_percent"+macAddress).data('easyPieChart').update(percentage);
          }

          //
          
         //update meterX totals
         var sum = 0;
         var phase = '';
         if(newtextApplianceName.search("phaseA") !=-1) {
            phase = 'meter1_power';
         } else if(newtextApplianceName.search("phaseB") !=-1) {
            phase = 'meter2_power';
         } else if(newtextApplianceName.search("phaseC") !=-1) {
            phase = 'meter3_power';
         }

         //get all values for class eg meter1_powerClass
        $('.'+phase+'Class').each(function()
        {
           sum += parseFloat($(this).text());
        });
        //put new sum value
        $("#"+phase).text(parseFloat(sum).toFixed(4));
        //
       } else {
      //  console.log("update fibaro::"+newtextApplianceName+macAddress+" value:"+applianceValue);

         //update attributes
         $("#"+newtextApplianceName+macAddress).text(applianceValue);
         $('#ts-'+newtextApplianceName+'').prop('checked', checked);
         $("#"+newtextApplianceName+'_state').text(applianceValue);

         //update pie charts inside appliance widget
          var percentage = 0.1*(parseFloat(applianceValue).toFixed(4) /parseFloat($("#totalPower").text()).toFixed(4));
          
         // console.log("UPDATED percentage new()::"+parseFloat(applianceValue).toFixed(4) );  
           // console.log("UPDATED percentage tp()::"+parseFloat($("#totalPower").text()).toFixed(4));          
          $("#"+newtextApplianceName+"_percent"+macAddress).text(parseInt(percentage).toFixed(0));
          if ( $( "#"+newtextApplianceName+"_percent"+macAddress).length>0 ) { 
              //console.log("percentage()::"+ element.name );
              //update pie chart!!
             $("#"+newtextApplianceName+"_pie_percent"+macAddress).data('easyPieChart').update(percentage);
          }
       }
       //add to chart
       //var chart = $('#containerHighcharts').highcharts();
       // series = chart.get(newtextApplianceName);
       // console.log("series::"+series);
    // Add point
       // if(series!=null){
     	// var time = (new Date()).getTime();
       // series.addPoint([time, parseFloat(applianceValue)]);
       // }

    //add power and energy
     if(newtextApplianceName.search("meter") !=-1) {
       	//console.log("meter::"+newtextApplianceName);
        //for power in KW
        if(newtextApplianceName.search("power") !=-1) {
          $("#"+macAddress+newtextApplianceName).text((parseFloat(applianceValue)/1000).toFixed(4));
        } else {
          //for energy kWh
           $("#"+macAddress+newtextApplianceName).text((parseFloat(applianceValue)).toFixed(4));
        }
       	
         //update totals for each appliance
         $("#"+macAddress+"_totalPower").text((parseFloat($("#"+macAddress+"meter1_power").text())+parseFloat($("#"+macAddress+"meter2_power").text())+parseFloat($("#"+macAddress+"meter3_power").text())).toFixed(4));
         $("#"+macAddress+"_totalEnergy").text((parseFloat($("#"+macAddress+"meter1_energy").text())+parseFloat($("#"+macAddress+"meter2_energy").text())+parseFloat($("#"+macAddress+"meter3_energy").text())).toFixed(4));
                 

         //update meterX totals
         var sum = 0;
         //get all values for class eg meter1_powerClass
        $('.'+newtextApplianceName+'Class').each(function()
        {
           sum += parseFloat($(this).text());
        });
       // console.log("ID::"+newtextApplianceName+"sum:"+sum);
       //put new sum value
        $("#"+newtextApplianceName).text(parseFloat(sum).toFixed(4));
     } 

      //update totals
      $("#totalPower").text((parseFloat($("#meter1_power").text())+parseFloat($("#meter2_power").text())+parseFloat($("#meter3_power").text())).toFixed(4));
      $("#totalEnergy").text((parseFloat($("#meter1_energy").text())+parseFloat($("#meter2_energy").text())+parseFloat($("#meter3_energy").text())).toFixed(4));
                 
      

}

//check event on toggle switch for ON OFF
$('body').on('change', '.toggle-switch input:checkbox', function () {
      var id = event.target.id;
      var dr = event.target.getAttribute("dr");
      var item = event.target.getAttribute("item");
      console.log("id:"+event.target.id);
      console.log("dr:"+event.target.getAttribute("dr"));
      console.log("item:"+event.target.getAttribute("item"));
      
      if(dr!=null & item !=null){
      //remove ts- to get the name of the appliance
      var applianceName = id.substring(3);
      var drUrl = dr;
      var itemType = item;
       var ip = event.target.getAttribute("ip");

        console.log("checked"+$(this).is(':checked')); 
        //if check is true turn OFF
      if ($(this).is(':checked')) {
        
      	var applianceValue='OFF';
       //console.log("checked:"+checked);
       $("#"+applianceName+'_state').text(applianceValue);
       //send request
       //THIS must be changes with broker path
       // $.get(drUrl+":8888/CMD?"+applianceName+"=OFF&__async=true");
       // $.get("http://192.168.1.16:8888/CMD?"+applianceName+"=OFF&__async=true");

       //publish command on off to broker
       //check if buildintitem switch
        if(itemType.toUpperCase()==='BUILDINGITEMSWITCH') {
            publish(ip+ ' '+applianceName+' active',drUrl,0);
          }
        else {
            publish(applianceName+' OFF',drUrl,0);
          }
       
             
        }
          else {
            	//turn on
          var applianceValue='ON';
       //console.log("checked:"+checked);
        //THIS must be changes with broker path
      // $.get(drUrl+":8888/CMD?"+applianceName+"=ON&__async=true");
       // $.get("http://192.168.1.16:8888/CMD?"+applianceName+"=ON&__async=true");

       //publish command on off to broker
       //check if buildintitem switch
        if(itemType.toUpperCase()==='BUILDINGITEMSWITCH') {
            publish(ip+ ' '+applianceName+' inactive',drUrl,0);
          }
        else {
            publish(applianceName+' ON',drUrl,0);
          }
       
       $("#"+applianceName+'_state').text(applianceValue);
      }
    }
});