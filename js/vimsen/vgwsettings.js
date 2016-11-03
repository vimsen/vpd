$(document).ready(function () {

    // Container <div> where dynamic content will be placed
    var appliancesContainer = document.getElementById('appliancesWidget');

    var macAddresses = [];
    var macAddressesPendingData = [];
    var connected = 0;
    var clientTriedConnection = false;

    // Clear previous contents of the container
    while (appliancesContainer.hasChildNodes()) {
       appliancesContainer.removeChild(appliancesContainer.lastChild);
    }

    // Get appliances for each controller
    var jqxhr = $.getJSON(vgwFile, function(data) {
    })
    .success(function(data) {
         $.each(data, function(index, element) {
           getAppliances(element);
        });           

     })
    .then(function() {
     })
    .fail(function(message) {
      console.log( "error:::" +message);
     })
     .always(function(data) {
    });


  // Get all appliances from the each VGW 
  function getAppliances(vgwObject) {

    //object list to keep appliances
    var objItem = [];
    var objAttributes = [];
    var jsonURL ='';

    // Read VGW appliances either from local file or by asking the respective json from the VGW    
    if(vgwObject.type==='building'){    
      jsonURL = vgwObject.url;
    } else {
      jsonURL = '' + vgwObject.url +':'+ vgwObject.port +'/rest/items?type=json';
    }

    var jqxhr = $.getJSON( jsonURL, function(data) {
    })
    .success(function(data) {
      $.each(data.item, function(index, element) {
          addBuildingItemToList("BuildingItem",vgwObject.powerNaming,element, "ActivePower",objItem, vgwObject.mac, vgwObject.url+':'+vgwObject.port, vgwObject.ip, vgwObject.group);
          addItemToList("SwitchItem",vgwObject.consumptionNaming, element,"Consumption",objItem, vgwObject.mac, vgwObject.url+':'+vgwObject.port, vgwObject.ip, vgwObject.group);
      });

      macAddresses.push(vgwObject.mac);

      // Create VGW div
      createVGWDiv(vgwObject.name, vgwObject.mqtt+'/'+vgwObject.mac+'/LDRcommand', vgwObject.mac, vgwObject.ip,vgwObject.group, objItem, objAttributes, vgwObject.city);

    })
    .fail(function(message) {
      console.log( "error" +JSON.stringify(message));
     })
     .always(function(data) {
    });
 
    // Perform other work here ...
 
    // Set another completion function for the request above
    jqxhr.always(function(data) {
    });
  }


  function addItemToList(parameterTocheck, typeOfControl, element, prosumption, objItem, vgwMac, drUrl, ipaddress, group) {
    
    if(element.type.search(parameterTocheck) != -1 && element.name.search(typeOfControl) != -1){
        //contains
        //create appliances items
        //for porduction items check again with george
        //remove _power for the name
        if(typeOfControl==='production_power'){
          // console.log("addItemToList::"+JSON.stringify(element));
          var applianceItems = {
            name: element.name.replace("_power", ""),
            type: element.type,
            item: parameterTocheck,            
            state:"ON",
            prosumption: prosumption,
            powerNaming: typeOfControl,
            vgw: vgwMac,
            dr: drUrl,
            ip: ipaddress,
            group: group     
          }
        } else  {
        
          var applianceItems = {
            name: element.name,
            type: element.type,
            item: parameterTocheck,
            state:element.state,
            prosumption: prosumption,
            powerNaming: typeOfControl,
            vgw: vgwMac,
            dr: drUrl,
            ip: ipaddress,
            group: group           
          }
        }

        //add object to objectlists
        objItem.push(applianceItems);
        
    }

  }

         
  function addBuildingItemToList(parameterTocheck, powerNaming, element, prosumption, objItem, vgwMac, drUrl, ipaddress, group) {

    if(element.type.search(parameterTocheck) != -1){        
      var applianceItems = {
        name: element.name,
        type: element.type,
        item: parameterTocheck,
        state:"ON",
        prosumption: prosumption,
        powerNaming: powerNaming,
        vgw: vgwMac,
        dr: drUrl,
        ip: ipaddress,
        group: group    
      }

     objItem.push(applianceItems);
    }
  }


  function createVGWDiv(vgwname, drUrl, macaddress, ipaddress, group, applianceObject, objAttributes, city){

    var ali = document.createElement('div');
    ali.innerHTML = '<div class="row"><div class="col-md-12 col-sm-6 m-b-5 m-t-5">'
    +'<u><font color="white" size="3">'+vgwname +' - ' + city +' </font></u></div></div>' 
    + '<div class="row">'
    + '<div class="col-md-3 col-sm-6 m-b-5 m-t-5"><font color="white">VP SLA</font></div>'
    + '<div class="col-md-9 col-sm-6 m-b-5 m-t-5">'
    + '<select data-style="btn-primary" name="sla_type_'+ macaddress + '" class="selectpicker" data-width="180px" required>'
    +'<option value="1">Manual DR</option>'   
    +'<option value="2">Semi-automatic DR</option>'   
    +'<option value="3">Automatic DR</option>'   
    +'</select>'
    + '</div></div>'
    + '<div class="row">'
    + '<div class="col-md-3 col-sm-6 m-b-5 m-t-5"><font color="white">Duration of availability (start/stop time)</font></div>'
    + '<div class="col-md-4 col-sm-6 m-b-5 m-t-5">'
    + '<input type="text" id="duration_start_'+ macaddress + '">&nbsp&nbsp'
    + '<input type="text" id="duration_stop_'+ macaddress + '">'
    + '</div></div>'
    + '<div class="row">'
    + '<div class="col-md-3 col-sm-6 m-b-5 m-t-5"><font color="white">Maximum consumption reduction (%)</font></div>'
    + '<div class="col-md-9 col-sm-6 m-b-5 m-t-5">'
    + '<select data-style="btn-primary" name="max_reduction_'+ macaddress + '" class="selectpicker" data-width="180px" required>'
    +'<option value=1>10</option>'   
    +'<option value=2>20</option>'   
    +'<option value=3>30</option>'   
    +'<option value=4>40</option>'   
    +'<option value=5>50</option>'   
    +'<option value=6>60</option>'   
    +'</select>'
    + '</div></div>'
    + '<div class="row">'
    + '<div class="col-md-3 col-sm-6 m-b-5 m-t-5"><font color="white">Minimum reliability factor (%)</font></div>'
    + '<div class="col-md-9 col-sm-6 m-b-5 m-t-5">'
    + '<select data-style="btn-primary" name="min_reliability_'+ macaddress + '" class="selectpicker" data-width="180px" required>'
    +'<option value=1>10</option>'   
    +'<option value=2>20</option>'   
    +'<option value=3>30</option>'   
    +'<option value=4>40</option>'   
    +'<option value=5>50</option>'   
    +'<option value=6>60</option>'
    +'</select>'
    + '</div></div>'
    + '<div class="row">'
    + '<div class="col-md-3 col-sm-6 m-b-5 m-t-5"><font color="white">Penalty of misconduct (cost units)</font></div>'
    + '<div class="col-md-9 col-sm-6 m-b-5 m-t-5">'
    + '<input id="penalty_'+ macaddress + '" type="text">'
    + '</div></div>'
    + '<div class="row">'
    + '<div class="col-md-3 col-sm-6 m-b-5 m-t-5"><font color="white">Minimum price of involvement (cost units)</font></div>'
    + '<div class="col-md-9 col-sm-6">'
    + '<input id="min_price_'+ macaddress + '" type="text">'
    + '</div></div>'
    + '<div class="row">'
    + '<div class="col-md-3 col-sm-6 m-b-5 m-t-5"><font color="white">Passive Plugs</font></div>'
    + '<div class="col-md-9 col-sm-6">'
    + '<select data-style="btn-primary" id="plugs_'+macaddress+'" class="selectpicker" data-width="180px" title="" multiple required>'
    +'</select>'
    + '</div></div>'
    + '<br><br>';

    var measureContainer = document.createElement('div');
         measureContainer.id=0;
         measureContainer.className=macaddress;
         measureContainer.appendChild(ali);

    appliancesContainer.appendChild(measureContainer);
    $('.selectpicker').selectpicker();
    //$('#duration_start_'+ macaddress + '').timepicker();
    // $('#duration_stop_'+ macaddress + '').timepicker();
    $('#duration_start_'+ macaddress + '').timepicker({ 'timeFormat': 'H:i' });
    $('#duration_stop_'+ macaddress + '').timepicker({ 'timeFormat': 'H:i' });

    // Update element with found plugs
    $.each(applianceObject, function(index, element) {
      $('#plugs_'+macaddress).append('<option>'+element.name+'</option>');
    });
    $('#plugs_'+macaddress).selectpicker('refresh');

    // Subscribe to broker in order to get settings values
    var optionsDashboard = {
     timeout: 3,
    //Gets Called if the connection has sucessfully been established
       onSuccess: function () {
         clientConnected = true;
         for (var i=0; i<macAddressesPendingData.length; i++) {
           client.subscribe("telint/"+macAddressesPendingData[i]+"/sla_type/", {qos: 0});
           client.subscribe("telint/"+macAddressesPendingData[i]+"/duration_start/", {qos: 0});
           client.subscribe("telint/"+macAddressesPendingData[i]+"/duration_stop/", {qos: 0});
           client.subscribe("telint/"+macAddressesPendingData[i]+"/max_reduction/", {qos: 0});
           client.subscribe("telint/"+macAddressesPendingData[i]+"/min_reliability/", {qos: 0});
           client.subscribe("telint/"+macAddressesPendingData[i]+"/penalty/", {qos: 0});
           client.subscribe("telint/"+macAddressesPendingData[i]+"/min_price/", {qos: 0});
           client.subscribe("telint/"+macAddressesPendingData[i]+"/plugs/", {qos: 0});
        }
      },
       //Gets Called if the connection could not be established
       onFailure: function (message) {
         alert("Connection failed: " + message.errorMessage);                  
       }
    };

    // Connect if not connected and subscribe one way or the other
    // also extra code to handle the various sychronization issues till connection is achieved.
    if(!clientConnected && !clientTriedConnection) {     
      macAddressesPendingData.push(macaddress);
      clientTriedConnection = true;
      client.connect(optionsDashboard);
    } else if (clientTriedConnection) {
      macAddressesPendingData.push(macaddress);
    } else {
      client.subscribe("telint/"+macaddress+"/sla_type/", {qos: 0});
      client.subscribe("telint/"+macaddress+"/duration_start/", {qos: 0});
      client.subscribe("telint/"+macaddress+"/duration_stop/", {qos: 0});
      client.subscribe("telint/"+macaddress+"/max_reduction/", {qos: 0});
      client.subscribe("telint/"+macaddress+"/min_reliability/", {qos: 0});
      client.subscribe("telint/"+macaddress+"/penalty/", {qos: 0});
      client.subscribe("telint/"+macaddress+"/min_price/", {qos: 0});
      client.subscribe("telint/"+macaddress+"/plugs/", {qos: 0});
    }
  }

  // On submit button clicked, send data to broker
  $("#submitVGWSettings").click(function () {
    for (var i = 0; i < macAddresses.length; i++) {
      mac = macAddresses[i];
      publish($("select[name=sla_type_"+mac +"]").val(), "telint/"+mac+"/sla_type/", 0, true);
      publish($("#duration_start_"+ mac + "").val(), "telint/"+mac+"/duration_start/", 0, true);
      publish($("#duration_stop_"+ mac + "").val(), "telint/"+mac+"/duration_stop/", 0, true);
      publish($("select[name=max_reduction_"+mac +"]").val(), "telint/"+mac+"/max_reduction/", 0, true);
      publish($("select[name=min_reliability_"+mac +"]").val(), "telint/"+mac+"/min_reliability/", 0, true);
      if($("#penalty_"+ mac + "").val() != null) {
        publish($("#penalty_"+ mac + "").val(), "telint/"+mac+"/penalty/", 0, true);
      }  
      if($("#min_price_"+ mac + "").val() != null) {
        publish($("#min_price_"+ mac + "").val(), "telint/"+mac+"/min_price/", 0, true);
      }
      if($("#plugs_"+mac).val()!= null) {
        publish($("#plugs_"+mac).val().toString(), "telint/"+mac+"/plugs/", 0, true);
      }
    }
  });


});
