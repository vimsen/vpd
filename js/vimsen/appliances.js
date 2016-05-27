$(document).ready(function () {
  var vgwFile = localStorage.getItem("vgwFile");
    console.log("addAppliances:::: container:: vgw file::"+vgwFile);

    /* var zone = 'Europe/Athens';
   MY.UTC = (-moment.tz(moment(), zone).utcOffset()) * 60 * 1000;
    console.log("---------------------------------------timezoneOffset" + MY.UTC);*/

    //values to keep topics to subscribe
     var topicsMeasurements = [];
     var topicsON_OFF = [];


    initLiveChart("containerConsumptionHighcharts", "Consumption");
    initLiveChart("containerProductionHighcharts", "Production");
    initTotalPowerLiveChart("containerTotalPowerHighcharts");
           
    
   

    //add 3 phase meters
    var meter1_power=0;
    var meter2_power=0;
    var meter3_power=0;

    var meter1_energy=0;
    var meter2_energy=0;
    var meter3_energy=0;

    //for map
     var markers = [];
    //var totalPower=0;
    //var totalEnergy=0;

    //add value to keep
    //$( "#totalPowerEnergy" ).append($("#totalPower").text());
            

    // Container <div> where dynamic content will be placed
    var appliancesContainer = document.getElementById('appliancesWidget');


    // Clear previous contents of the container
    while (appliancesContainer.hasChildNodes()) {
       appliancesContainer.removeChild(appliancesContainer.lastChild);
    }

    // Container <div> where dynamic content will be placed
    var powerEnergyContainer = document.getElementById('powerEnergyWidget');


    // Clear previous contents of the container
    while (powerEnergyContainer.hasChildNodes()) {
       powerEnergyContainer.removeChild(powerEnergyContainer.lastChild);
    }

    //get appliances for each controller
     var jqxhr = $.getJSON(vgwFile, function(data) {
     // console.log( "success:"+JSON.stringify(data));
    })
    .success(function(data) {
       // var obj = jQuery.parseJSON( data.item );

       // console.log( "second success Length"+JSON.stringify(data.item.length));
         $.each(data, function(index, element) {
             // console.log( "index:"+index);
             //  console.log( "element:"+JSON.stringify(element));
              //  $.when( getAppliances(element) ).done(function() {
               //   console.log("objItem1::"+JSON.stringify(objItem));
              //  });

         //add option to selection of controllers dropdown
         /* $('#controllerSelection').append($('<option>', {
            value: element.mac,
            text: element.name
          }));*/

          var topicMeasurement = element.group+'/'+element.mac+'/state/+/state/#';
             topicsMeasurements.push(topicMeasurement);

          var topicON_OFF = element.group+'/'+element.mac+'/command/+/command/#';
             topicsON_OFF.push(topicON_OFF);


          $('#controllerSelectionMap').append($('<option>', {
            value: element.mac,
            text: element.name
          }));

          //insert map markers
           var marker = {
            "title":element.name,
            "lat": element.lat,
            "lng": element.lng,
            "description": element.name,
            "mac":element.mac
          }

          markers.push(marker);

          

          //create total power widget for each controller
           createControllerPowerEnergyDiv(element);

           getAppliances(element);
        });

         //
          var mapOptions = {
            center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
            // zoom: 2, //Not required.
            mapTypeId: google.maps.MapTypeId.TERRAIN,
          };

          //
          var options = {
           mapTypeControlOptions: {
           mapTypeIds: ['Styled']
            },
           disableDefaultUI: true, 
          center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
           mapTypeId: 'Styled'
          };
          var div = document.getElementById('googleMap');
          var map = new google.maps.Map(div, options);
          var styledMapType = new google.maps.StyledMapType(mapstyles, { name: 'Styled' });
          map.mapTypes.set('Styled', styledMapType);
           // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.

           //add select options div
           var selectVGWControlDiv = document.createElement('div');
           var selectVGWControl = new SelectVGWControl(selectVGWControlDiv, map, 'controllerSelectionMap');
           selectVGWControlDiv.index = 1;
           map.controls[google.maps.ControlPosition.TOP_CENTER].push(selectVGWControlDiv);
            //add reset button
           var resetControlDiv = document.createElement('div');
           var resetControl = new ResetControl(resetControlDiv, map, hideDivs);
           resetControlDiv.index = 1;
           map.controls[google.maps.ControlPosition.TOP_RIGHT].push(resetControlDiv);
          //
          var infoWindow = new google.maps.InfoWindow();
          //var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
         
 
        //Create LatLngBounds object.
        //var latlngbounds = new google.maps.LatLngBounds();
         //Get the boundaries of the Map.
          var bounds = new google.maps.LatLngBounds();
 
          for (var i = 0; i < markers.length; i++) {
            var data = markers[i]
            var myLatlng = new google.maps.LatLng(data.lat, data.lng);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                icon: '../../img/vimsen/location.png',
                title: data.title,
                mac: data.mac
            });
            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.description +':'+data.mac+ "</div>");
                    infoWindow.open(map, marker);
                    $("#controllerSelectionMap").val(data.mac);
                    //hide other divs
                    hideDivs(data.mac);
                    map.setZoom(15);
                    map.setCenter(marker.getPosition());
                });
            })(marker, data);

           //Extend each marker's position in LatLngBounds object.
           // console.log("marker.position::"+marker.position);
            bounds.extend(marker.position);
         };

          jQuery(document).on('change','#controllerSelectionMap',function() {
                    console.log("marker:"+$("#controllerSelectionMap").val());
                    findByMac(markers, $("#controllerSelectionMap").val(),map);
                   
          });
 
               

        //Center map and adjust Zoom based on the position of all markers.
       
          map.fitBounds(bounds); 

          google.maps.event.addListener(map, 'idle', function (event) {
            var center = map.getCenter();
            map.setCenter(center);
          });

          //end of insert markers map

          //connect to client and subscribe to topics
            //Connect Options
             var optionsDashboard = {
               timeout: 3,
              //Gets Called if the connection has sucessfully been established
                 onSuccess: function () {
                    console.log("Connected");
                      $.each(topicsMeasurements, function( index, value ) {
                     console.log( "topic:"+value);
                      client.subscribe(value, {qos: 0})
                    });

                       $.each(topicsON_OFF, function( index, value ) {
                     console.log( "topic:"+value);
                      client.subscribe(value, {qos: 0})
                    });

                 },
                 //Gets Called if the connection could not be established
                 onFailure: function (message) {
                   alert("Connection failed: " + message.errorMessage);                  
                 }
             };     

             client.connect(optionsDashboard);

              

     })
    .then(function() {
      // console.log(" then objItem15555555555::"+JSON.stringify(objItem));
     })
    .fail(function(message) {
      console.log( "error:::" +message);
     })
     .always(function(data) {
     // console.log( "finished"+JSON.stringify(data));
    });

   // getAppliances();
    
     //  console.log("objItem2::"+JSON.stringify(objItem));
   
     /*
     * Easy Pie Charts - Used in widgets
     */
  function easyPieChart(id, macaddress, typeOfPie, trackColor, scaleColor, barColor, lineWidth, lineCap, size) {
       
         $('.'+id+macaddress).easyPieChart({
            trackColor: trackColor,
            //scaleColor: scaleColor,
             scaleColor: false,
             barColor:barColor,
            // barColor: function (percent) {
             //  console.log('easyPieChart percent:'+percent);
            // return (percent < 50 ? '#5cb85c' : percent < 75 ? '#f0ad4e' : '#cb3935');
            // },
            lineWidth: lineWidth,
            lineCap: lineCap,
            size: size
        });
       
  }
    
   
  function getAppliances(vgwObject) {
      //object list to keep appliances
    var objItem = [];
    var objAttributes = [];
    var jsonURL ='';

             

   // console.log( "getAppliances::::"+JSON.stringify(vgwObject));
    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    //this must be the ip of the VGW
   // var jqxhr = $.getJSON( "http://gmtls.mooo.com:8888/rest/items?type=json", function(data) {
    //check if is building HEDNO 
    //Check for FINAL implementation
     
    if(vgwObject.type==='building'){    
     // console.log( "vgwObject.type:"+vgwObject.type); 
      jsonURL = vgwObject.url;
    } else {
      jsonURL = '' + vgwObject.url +':'+ vgwObject.port +'/rest/items?type=json';
    }

     var jqxhr = $.getJSON( jsonURL, function(data) {
    // console.log( "success:"+JSON.stringify(data));
    })
     .success(function(data) {
       // var obj = jQuery.parseJSON( data.item );

       // console.log( "second success Length"+JSON.stringify(data.item.length));
         $.each(data.item, function(index, element) {
            //console.log("getAppliances Index::"+index+" element:"+element.type);
            //for each element check if it switchitem and contains fibaro(consumption) (or production item like itm_uber)
            //for test we ll put fibaro inestead of consumption
            //and itm_uber instead of production

              //production
            //for porduction items HEDNO Check!!
            addBuildingItemToList("BuildingItem",vgwObject.powerNaming,element, "ActivePower",objItem, vgwObject.mac, vgwObject.url+':'+vgwObject.port, vgwObject.ip, vgwObject.group);
           // addAttributesToList("BuildingItem",vgwObject.consumptionNaming,element,objAttributes, vgwObject.mac);

            addBuildingAttributesToList("BuildingItem",vgwObject.consumptionNaming,element,objAttributes, vgwObject.mac, vgwObject.group);
            //consumption
            addItemToList("SwitchItem",vgwObject.consumptionNaming,element,"Consumption",objItem, vgwObject.mac, vgwObject.url+':'+vgwObject.port, vgwObject.ip, vgwObject.group);
            addAttributesToList("NumberItem",vgwObject.consumptionNaming,element,objAttributes, vgwObject.mac, vgwObject.group);

            //production
            //for porduction items check again with george
            addItemToList("NumberItem",vgwObject.productionNaming,element, "Production",objItem, vgwObject.mac, vgwObject.url+':'+vgwObject.port, vgwObject.ip, vgwObject.group);
            addAttributesToList("NumberItem","production",element,objAttributes,vgwObject.mac, vgwObject.group);

           
            //get total power consumption
            addTotalProsumption("NumberItem",vgwObject.mac, vgwObject.meterNaming,vgwObject.powerNaming, element, vgwObject.group);
            
            //get total energy consumption
            addTotalProsumption("NumberItem",vgwObject.mac, vgwObject.meterNaming,vgwObject.energyNaming, element, vgwObject.group);

             
        });
        //  console.log("objItem::"+JSON.stringify(objItem));
         // console.log("objAttributes::"+JSON.stringify(objAttributes));

           //create Charts for measurements
           //create Series for power
           createLiveTotalPowerChart("containerTotalPowerHighcharts", vgwObject, moment().subtract(100 * 1000, 'ms'), moment());
           
           //create Series for power consumption
           createLiveChart("containerConsumptionHighcharts",objAttributes, "_"+vgwObject.powerNaming, vgwObject.consumptionNaming, moment().subtract(100 * 1000, 'ms'), moment());
           
           //create Series for power consumption
           createLiveChart("containerProductionHighcharts",objAttributes, "_"+vgwObject.powerNaming, vgwObject.productionNaming, moment().subtract(100 * 1000, 'ms'), moment());
           //create AppliancesDiv
           //createAppliancesDiv(vgwObject.name, vgwObject.url, vgwObject.mac, objItem, objAttributes);
           createAppliancesDiv(vgwObject.name, vgwObject.mqtt+'/'+vgwObject.mac+'/LDRcommand', vgwObject.mac, vgwObject.ip,vgwObject.group, objItem, objAttributes);

           
       

     })
    .fail(function(message) {
      console.log( "error" +JSON.stringify(message));
     })
     .always(function(data) {
     // console.log( "finished"+JSON.stringify(data));
    });
 
    // Perform other work here ...
 
    // Set another completion function for the request above
    jqxhr.always(function(data) {
    // console.log( "second finished"+JSON.stringify(data));
    });

   

  }

  function addItemToList(parameterTocheck,typeOfControl, element, prosumption,objItem, vgwMac, drUrl, ipaddress, group) {
   // console.log("addItemToList::"+JSON.stringify(element));
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

         
  function addBuildingItemToList(parameterTocheck,powerNaming, element, prosumption,objItem, vgwMac, drUrl, ipaddress, group) {
    // console.log("addBuildingItemToList element::"+JSON.stringify(element));
    if(element.type.search(parameterTocheck) != -1){
     // console.log("addBuildingItemToList element::"+JSON.stringify(element));
        //contains
        //create appliances items
        //for porduction items check again with george
        //remove _power for the name
        /*if(typeOfControl==='production_power'){
          // console.log("addItemToList::"+JSON.stringify(element));
          var applianceItems = {
            name: element.name.replace("_power", ""),
            type: element.type,
            state:"ON",
            prosumption: prosumption,
            vgw: vgwMac,
            dr: drUrl      
          }
        } else  {*/
        
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
       // }
       // console.log("addBuildingItemToList::"+JSON.stringify(applianceItems)); 

        //add object to objectlists
         objItem.push(applianceItems);
        // console.log("addBuildingItemToList objItem::"+JSON.stringify(objItem)); 
    }

  }

   function addAttributesToList(parameterTocheck,typeOfControl, element,objAttributes, vgwMac, group) {
     //console.log("addAttributesToList::"+JSON.stringify(objAttributes));
    if(element.type.search(parameterTocheck) != -1 && element.name.search(typeOfControl) != -1){
        //contains
      // console.log("addAttributesToList::"+element.name+"::"+element.state);

        //create apliances attributes (power, energy)
        //we should ask geroge to change tthe production item to be like consumption.
        //right now there is now switchitem, only number item
        //check of production item has battery
       /* if(typeOfControl==='production'){
          console.log("addAttributesToList::"+element.name+"::"+element.state);
           var applianceAttributes = {
            name: element.name+'_power',
            state: parseFloat(element.state).toFixed(4),
            vgw: vgwMac
         }*/
         if(element.name.search("production_battery_percentage") !=-1){
         // console.log("addAttributesToList::"+element.name+"::"+element.state);
           var applianceAttributes = {
            name: element.name,
            itemType: parameterTocheck,
            state: parseFloat(element.state).toFixed(4),
            vgw: vgwMac,
            group: group
           }
         } else  {
         var applianceAttributes = {
            name: element.name,
            itemType: parameterTocheck,
            state: parseFloat(element.state).toFixed(4),
            vgw: vgwMac,
            group: group   
         }
        }

        //add object to objectlists
         objAttributes.push(applianceAttributes);
    }

  }

  function addBuildingAttributesToList(parameterTocheck,typeOfControl, element,objAttributes, vgwMac, group) {
   // console.log("addItemToList::"+element);
    if(element.type.toUpperCase()==="BUILDINGITEM" && element.name.search('GPXT')=== -1){
      
        
         var applianceAttributes = {
            name: element.name+'_active_power_total',
            itemType: parameterTocheck,
            state: 0,
            vgw: vgwMac,
            group: group    
         }
       
        //add object to objectlists
         objAttributes.push(applianceAttributes);
    }

  }

   function addTotalProsumption(parameterTocheck, macadress, typeOfControl, searchString, element, group) {
    // console.log("addTotalProsumption macadress::"+macadress);
    if(element.type.search(parameterTocheck) != -1 && element.name.search(typeOfControl) != -1 && element.name.search(searchString) != -1){
        //contains
        //console.log("addTotalProsumption macadress::"+macadress);
        //console.log("addTotalProsumption::"+element.name+":::"+element.state);
      
       
     //add meters (power energy) for each controller
     // $( "#appliancesWidget" ).append('<input type="text" id="'+macadress+element.name+'" value="'+parseFloat(element.state/1000).toFixed(4)+'"/>');

       $("#"+macadress+element.name).text(parseFloat(element.state/1000).toFixed(4));
       // if(searchString==="energy")
       // totalEnergy +=parseFloat(element.state);

       //add power or energy to general total element
       // if(searchString==="power")
       var addSum = parseFloat($("#"+element.name).text())+parseFloat(element.state/1000);
       $("#"+element.name).text(parseFloat(addSum).toFixed(4));

       //add to total power and energy values per VGW
        $("#"+macadress+"_totalPower").text((parseFloat($("#"+macadress+"meter1_power").text())+parseFloat($("#"+macadress+"meter2_power").text())+parseFloat($("#"+macadress+"meter3_power").text())).toFixed(4));
            
        $("#"+macadress+"_totalEnergy").text((parseFloat($("#"+macadress+"meter1_energy").text())+parseFloat($("#"+macadress+"meter2_energy").text())+parseFloat($("#"+macadress+"meter3_energy").text())).toFixed(4));
          

       //add to total power and energy values
       $("#totalPower").text((parseFloat($("#meter1_power").text())+parseFloat($("#meter2_power").text())+parseFloat($("#meter3_power").text())).toFixed(4));
            
        $("#totalEnergy").text((parseFloat($("#meter1_energy").text())+parseFloat($("#meter2_energy").text())+parseFloat($("#meter3_energy").text())).toFixed(4));
            

    }

  }

  function createControllerPowerEnergyDiv(controllerObject){

   // console.log("createControllerPowerEnergyDiv controllerObject::"+JSON.stringify(controllerObject));
   var html;
   if(controllerObject.type.toUpperCase() === "BUILDING") {

          html =  '<div class="mini-charts-item m-b-15">';
         //
          html +='<div class="clearfix">';
          html +='<div class="count col-sm-6 col-xs-12 col-md-6 productionCurrent">';
          html +='<small class="overFlowText">Total Power Production(kW)</small>';
          html +='<h2 id="'+controllerObject.mac+'_totalPowerProduction" class="Ppower productionPower">0.0000</h2>';
          html +='</div>';
          html +='<div class="count col-sm-6 col-xs-12 col-md-6 productionCurrent">';
          html +='<small class="overFlowText">Total Energy Production(kWh)</small>';
          html +='<h2 id="'+controllerObject.mac+'_totalEnergyProduction" class="Ppower">0</h2>';
          html +='</div>';                                       
          html +='</div>';
          //
          html += '<div class="clearfix">';
          html += '<div class="count col-sm-3 col-xs-6 col-md-3 consumptionCurrent">';
          html += '<small class="overFlowText">'+controllerObject.name+' Total Power Consumption(kW)</small>';
          html += '<h2 id="GPXT_active_power_total" class="Tpower">0</h2>';
          html += '</div>';
          html += '<div class="count col-sm-3 col-md-3 consumptionCurrent">';
          html += '<small class="Tpower">Phase 1 (kW): <div id="GPXT_active_power_phaseA" class="Tpower_value meter1_powerClass">0.0000</div></small>';
          html += '<small class="Tpower">Phase 2 (kW): <div id="GPXT_active_power_phaseB" class="Tpower_value meter2_powerClass">0.0000</div></small>';
          html += '<small class="Tpower">Phase 3 (kW): <div id="GPXT_active_power_phaseC" class="Tpower_value meter3_powerClass">0.0000</div></small>';
          html += '</div>';
          html += '<div class="count col-sm-3 col-xs-6 col-md-3 consumptionCurrent">';
          html += '<small class="overFlowText">'+controllerObject.name+' Total Energy Consumption(kWh)</small>';
          html += '<h2 id="'+controllerObject.mac+'_totalEnergy" class="Tenergy">0</h2>';
          html += '</div>';
          html += '<div class="count col-sm-3 col-md-3 consumptionCurrent">';
          html += '<small class="Tenergy">Phase 1 (kWh): <div id="'+controllerObject.mac+'meter1_energy" class="Tenergy_value meter1_energyClass">0.0000</div></small>';
          html += '<small class="Tenergy">Phase 2 (kWh): <div id="'+controllerObject.mac+'meter2_energy" class="Tenergy_value meter2_energyClass">0.0000</div></small>';
          html += '<small class="Tenergy">Phase 3 (kWh): <div id="'+controllerObject.mac+'meter3_energy" class="Tenergy_value meter3_energyClass">0.0000</div></small>';
          html += '</div>';
          html += '</div>';
          html += '</div>';

   } else {

          html =  '<div class="mini-charts-item m-b-15">';
           //
          html +='<div class="clearfix">';
          html +='<div class="count col-sm-6 col-xs-12 col-md-6 productionCurrent">';
          html +='<small class="overFlowText">Total Power Production(kW)</small>';
          html +='<h2 id="'+controllerObject.mac+'_totalPowerProduction" class="Ppower productionPower">0.0000</h2>';
          html +='</div>';
          html +='<div class="count col-sm-6 col-xs-12 col-md-6 productionCurrent">';
          html +='<small class="overFlowText">Total Energy Production(kWh)</small>';
          html +='<h2 id="'+controllerObject.mac+'_totalEnergyProduction" class="Ppower">0.0000</h2>';
          html +='</div>';                                       
          html +='</div>';
          //
          html += '<div class="clearfix">';
          html += '<div class="count col-sm-3 col-xs-6 col-md-3 p-b-15 consumptionCurrent">';
          html += '<small class="overFlowText">'+controllerObject.name+' Total Power Consumption(kW)</small>';
          html += '<h2 id="'+controllerObject.mac+'_totalPower" class="Tpower">0.0000</h2>';
          html += '</div>';
          html += '<div class="count col-sm-3 col-md-3 consumptionCurrent">';
          html += '<small class="Tpower">Phase 1 (kW): <div id="'+controllerObject.mac+'meter1_power" class="Tpower_value meter1_powerClass">0.0000</div></small>';
          html += '<small class="Tpower">Phase 2 (kW): <div id="'+controllerObject.mac+'meter2_power" class="Tpower_value meter2_powerClass">0.0000</div></small>';
          html += '<small class="Tpower">Phase 3 (kW): <div id="'+controllerObject.mac+'meter3_power" class="Tpower_value meter3_powerClass">0.0000</div></small>';
          html += '</div>';
          html += '<div class="count col-sm-3 col-xs-6 col-md-3 p-b-15 consumptionCurrent">';
          html += '<small class="overFlowText">'+controllerObject.name+' Total Energy Consumption(kWh)</small>';
          html += '<h2 id="'+controllerObject.mac+'_totalEnergy" class="Tenergy">0.0000</h2>';
          html += '</div>';
          html += '<div class="count col-sm-3 col-md-3 consumptionCurrent">';
          html += '<small class="Tenergy">Phase 1 (kWh): <div id="'+controllerObject.mac+'meter1_energy" class="Tenergy_value meter1_energyClass">0.0000</div></small>';
          html += '<small class="Tenergy">Phase 2 (kWh): <div id="'+controllerObject.mac+'meter2_energy" class="Tenergy_value meter2_energyClass">0.0000</div></small>';
          html += '<small class="Tenergy">Phase 3 (kWh): <div id="'+controllerObject.mac+'meter3_energy" class="Tenergy_value meter3_energyClass">0.0000</div></small>';
          html += '</div>';
          html += '</div>';
          html += '</div>';
    }

         var totalPE = document.createElement('div');
         totalPE.id = controllerObject.mac+'powerEnergy';
         totalPE.innerHTML = html;
         
          powerEnergyContainer.appendChild(totalPE);

  }
  

  function createAppliancesDiv(vgwname, drUrl, macaddress, ipaddress,group, applianceObject,objAttributes){
      // console.log(" applianceObject:"+JSON.stringify(applianceObject)+" objAttributes:"+JSON.stringify(objAttributes));

    $.each(applianceObject, function(index, element) {
     //console.log(" element:"+element.name+" prosumption:"+element.prosumption+" group:"+group);
   

         //add new
        var applianceName = element.name;
        var healthpie = "health-pie-"+index;
        var batterypie = "battery-pie-"+applianceName;
    
        var ali = document.createElement('div');

        var barColor = '#04A5BA';

        
            //create different widgets for consumption and production items
    if(element.prosumption.toUpperCase() === "ACTIVEPOWER" ) {
    //production
    // console.log("ACTIVE applianceObject:"+JSON.stringify(applianceObject)+" objAttributes:"+JSON.stringify(objAttributes));
   if(element.name.toUpperCase() != "GPXT") {

     if(element.type.toUpperCase() === "BUILDINGITEMSWITCH") {

      var topicMeasurement = group+'/'+macaddress+'/state/'+applianceName+'/state';            
      var topicON_OFF = group+'/'+macaddress+'/state/'+applianceName+'/state';
    

      ali.innerHTML = '<div  class="dash-widget-item switchApplianceItem"> <div class="switchHeader"> '
    +'<div class="dash-widget-header"> <div class="dash-widget-title f-14 f-500"> '+applianceName+' <br/> <small>'+vgwname+'</small> </div>'
    +' <div class="pull-right m-t-15 m-r-5 m-b-15"> <div class="toggle-switch" data-ts-color="red"> '
    +'<input id="ts-'+applianceName+'" type="checkbox" hidden="hidden" class="switchON_OFF" item="'+element.type+'" dr="'+drUrl+'" ip="'+ipaddress+'"> <label for="ts-'+applianceName+'" class="ts-helper"></label> </div> </div> </div>'
    +' <div class="clearfix"></div> </div> <div class="bgm-lime p-20 text-right"> <div class="row"> '
    +'<div class="appliancesSwitchDetails col-xs-6 m-t-10">'
    +' <small class="f-12">STATE</small> <h3 id= "'+applianceName+'_state" class="p-5 m-0 f-400 c-white state_value" topicid="'+topicON_OFF+'">'+element.state+'</h3> </div> <div class="col-xs-6"> '
    +'</div> </div> </div> </div>';
   

     } else {
      //console.log(" element:"+element.name+" prosumption:"+element.prosumption+" group:"+group);
   
      var topicMeasurement = group+'/'+macaddress+'/state/'+applianceName+'_active_power_total/state';            
      var topicON_OFF = group+'/'+macaddress+'/state/'+applianceName+'/state';
    
    ali.innerHTML = '<div  class="dash-widget-item buildingApplianceItem"> <div class="buildingHeader p-b-20"> '
    +'<div class="dash-widget-header"> <div class="dash-widget-title  f-14 f-500"> '+applianceName+' <br/> <small>'+vgwname+'</small> </div>'
    +' <div class="pull-right m-t-15 m-r-5 m-b-15"> '
    +' </div> </div>'
    +' <div class="clearfix"></div> </div> <div class="bgm-lime p-20 text-right"> <div class="row"> '
    +'<div class="appliancesBuildingDetails col-xs-6 m-t-30"> <small class="f-12">'+element.prosumption+' (W)</small> '
    +'<h3 id= "'+applianceName+element.powerNaming+'total" class="p-5 m-0 f-400 c-white power_valueB" topicid="'+topicMeasurement+'">0.0000</h3> <br/> <small class="f-12">'+element.prosumption+' (Wh)</small>'
    +' <h3 id= "'+applianceName+'_energy"class="m-0 f-400 c-white energy_valueB">0.0000</h3> <br/>'
    +'<small class="f-12">STATE</small> <h3 id= "'+applianceName+'_state" class="p-5 m-0 f-400 c-white state_valueB">'+element.state+'</h3> </div> <div class="col-xs-6"> '
    +'<div class="p-t-20 p-b-20 text-center c-white"> <div id= "'+applianceName+'_active_power_total_pie_percent'+macaddress+'" class="easy-pie '+applianceName+macaddress+' m-b-10" data-percent="0">'
    +' <div class="percent" id= "'+applianceName+'_active_power_total_percent'+macaddress+'">0</div> <div class="pie-title">'+element.prosumption+' %</div> </div> '
    +'<br/><small>Phase A (W)</small> <h5 id= "'+applianceName+element.powerNaming+'phaseA" class="p-5 m-0 f-400 c-white power_valueB">0.0000</h5>'
    +'<small>Phase B (W)</small> <h5 id= "'+applianceName+element.powerNaming+'phaseB" class="p-5 m-0 f-400 c-white power_valueB">0.0000</h5>'
    +'<small>Phase C (W)</small> <h5 id= "'+applianceName+element.powerNaming+'phaseC" class="p-5 m-0 f-400 c-white power_valueB">0.0000</h5>'
    +'</div> </div> </div> </div> </div>';
     }
    } 
   

    } else if(element.prosumption.toUpperCase() === "PRODUCTION") {

      var topicMeasurementP = group+'/'+macaddress+'/state/'+applianceName+'_power/state';            
      var topicON_OFF = group+'/'+macaddress+'/state/'+applianceName+'/state';
    
    //production
    ali.innerHTML = '<div  class="dash-widget-item productionApplianceItem"> <div class="productionHeader p-b-20"> '
    +'<div class="dash-widget-header"> <div class="dash-widget-title  f-14 f-500"> '+applianceName+' <br/> <small>'+vgwname+'</small> </div>'
    +' <div class="pull-right m-t-15 m-r-5 m-b-15"> '
    +' </div> </div>'
    +' <div class="clearfix"></div> </div> <div class="bgm-cyan p-20 text-right"> <div class="row"> '
    +'<div class="appliancesProductionDetails col-xs-6 m-t-30"> <small class="f-12">'+element.prosumption+' (W)</small> '
    +'<h3 id= "'+applianceName+'_power'+macaddress+'" class="p-5 m-0 f-400 c-white power_valueP '+macaddress+'_powerValue" topicid="'+topicMeasurementP+'">0.0000</h3> <br/> <small class="f-12">'+element.prosumption+' (Wh)</small>'
    +' <h3 id= "'+applianceName+'_energy"class="p-5 m-0 f-400 c-white energy_valueP">0.0000</h3> <br/>'
    +' <small class="f-12">STATE</small> <h3 id= "'+applianceName+'_state" topicid="'+topicON_OFF+'" class="p-5 m-0 f-400 c-white state_valueP">'+element.state+'</h3> </div> <div class="col-xs-6"> '
    +'<div class="p-t-20 p-b-20 text-center c-white"> <div id= "'+applianceName+'_power_pie_percent'+macaddress+'" class="easy-pie '+applianceName+macaddress+' m-b-10" data-percent="0">'
    +' <div class="percent" id= "'+applianceName+'_power_percent'+macaddress+'">0.0000</div> <div class="pie-title">'+element.prosumption+' %</div> </div> '
    +'<div  id= "'+applianceName+'_battery_percentage_pie'+macaddress+'" class="easy-pie '+batterypie+macaddress+'" data-percent="0"> '
    +'<div id= "'+applianceName+'_battery_percentage'+macaddress+'" class="percent">0</div> <div class="pie-title">Battery %</div> </div> </div> </div> </div> </div> </div>';
   

    } else {
    //consumption
     //console.log(" applianceObject:"+JSON.stringify(element));
     //console.log(" applianceObject:"+JSON.stringify(element.name));
     //console.log(" objAttributes:"+JSON.stringify(objAttributes));

     //find objattributes that includes power in their names
    /* var arr = jQuery.grep(objAttributes, function( a ) {
       //console.log(" a:"+a.name+'_power');
        return a.name === element.name+'_power' && a.vgw === element.vgw;
     });*/
    //console.log(" array :"+JSON.stringify(arr[0].name));
    //find objattributes that includes power in their names
   var obj = {} ;
   var powerState = 0;
    if (objAttributes != null) {     
     obj = _.find(objAttributes, function(obj) { return obj.name === element.name+'_power' })
       if (typeof obj !== "undefined") {
        powerState = obj.state;
      }
    
    }
   


    var topicMeasurementP = group+'/'+macaddress+'/state/'+applianceName+'_power/state';   
    var topicMeasurementE = group+'/'+macaddress+'/state/'+applianceName+'_energy/state';            
    var topicON_OFF = group+'/'+macaddress+'/state/'+applianceName+'/state';

    ali.innerHTML = '<div  class="dash-widget-item consumptionApplianceItem"> <div class="consumptionHeader"> '
    +'<div class="dash-widget-header"> <div class="dash-widget-title  f-14 f-500"> '+applianceName+' <br/> <small>'+vgwname+'</small> </div>'
    +' <div class="pull-right m-t-15 m-r-5 m-b-15"> <div class="toggle-switch" data-ts-color="red"> '
    +'<input id="ts-'+applianceName+'" type="checkbox" hidden="hidden" class="switchON_OFF" item="'+element.type+'" dr="'+drUrl+'" ip="'+ipaddress+'" topicid="'+topicON_OFF+'"> <label for="ts-'+applianceName+'" class="ts-helper"></label> </div> </div> </div>'
    +' <div class="clearfix"></div> </div> <div class="bgm-lime p-20 text-right"> <div class="row"> '
    +'<div class="appliancesConsumptionDetails col-xs-6 m-t-30"> <small class="f-12">'+element.prosumption+' (W)</small> '
    +'<h3 id= "'+applianceName+'_power'+macaddress+'" topicid="'+topicMeasurementP+'" class="p-5 m-0 f-400 c-white power_value">'+powerState+'</h3> <br/> <small class="f-12">'+element.prosumption+' (Wh)</small>'
    +' <h3 id= "'+applianceName+'_energy" topicid="'+topicMeasurementE+'" class="p-5 m-0 f-400 c-white energy_value">0.0000</h3> <br/>'
    +' <small class="f-12">STATE</small> <h3 id= "'+applianceName+'_state" topicid="'+topicON_OFF+'" class="p-5 m-0 f-400 c-white state_value">'+element.state+'</h3> </div> <div class="col-xs-6"> '
    +'<div class="p-t-20 p-b-20 text-center c-white"> <div class="easy-pie '+applianceName+macaddress+' m-b-10" id= "'+applianceName+'_power_pie_percent'+macaddress+'" data-percent="0">'
    +' <div class="percent" id= "'+applianceName+'_power_percent'+macaddress+'">0</div> <div class="pie-title">'+element.prosumption+' %</div> </div> '
    +'<div class="easy-pie '+healthpie+macaddress+'"  data-percent="100"> '
    +'<div class="percent">100</div> <div class="pie-title">Health %</div> </div> </div> </div> </div> </div> </div>';
   
    barColor = 'rgb(0,203,146)';
    }

     
     
     var measureContainer = document.createElement('div');
         measureContainer.id=index;
         measureContainer.className=macaddress;
         measureContainer.appendChild(ali);
        //append to parent


    appliancesContainer.appendChild(measureContainer);
    easyPieChart(applianceName, macaddress, 'prosumption', '#eee', '#ccc', barColor, 7, 'butt', 95);
    easyPieChart(healthpie, macaddress, 'health', '#eee', '#ccc', barColor, 7, 'butt', 95);
    easyPieChart(batterypie, macaddress, 'battery', '#eee', '#ccc', barColor, 7, 'butt', 95);

    //toggle swtich on or off depending the state
    var checked = element.state==='OFF'?true:false;
    //console.log("checked:"+checked);

      $('#ts-'+applianceName+'').prop('checked', checked);

    //create Charts for measurements
   // createLiveChart("containerHighcharts", moment().subtract(100 * 1000, 'ms'), moment()));
       
      });

  // console.log("applianceObject number:" + applianceObject.length);

     addAttributes(objAttributes);


     /*for (i = 0; i < applianceObject.length; i++) {
      
        
        
        //add new
        var consumptionpie = element.name;
         var healthpie = "health-pie-"+i;
    var ali = document.createElement('div');
    ali.innerHTML = '<div  class="dash-widget-item consumptionApplianceItem"> <div class="consumptionHeader"> '
    +'<div class="dash-widget-header"> <div class="dash-widget-title"> '+consumptionpie+' <br/> <small>openHab VGW</small> </div>'
    +' <div class="pull-right m-t-15 m-r-5 m-b-15"> <div class="toggle-switch" data-ts-color="red"> '
    +'<input id="ts2" type="checkbox" hidden="hidden"> <label for="ts2" class="ts-helper"></label> </div> </div> </div>'
    +' <div class="clearfix"></div> </div> <div class="bgm-teal p-20"> <div class="row"> '
    +'<div class="appliancesConsumptionDetails col-xs-6 m-t-30"> <small>Consumption (W)</small> '
    +'<h3 class="m-0 f-400 c-white">47</h3> <br/> <small>Consumption (Wh)</small> <h3 class="m-0 f-400 c-white">249</h3> <br/>'
    +' <small>STATE</small> <h3 class="m-0 f-400 c-white">ON</h3> </div> <div class="col-xs-6"> '
    +'<div class="p-t-20 p-b-20 text-center c-white"> <div class="easy-pie '+consumptionpie+'" data-percent="6">'
    +' <div class="percent">6</div> <div class="pie-title">Consumption %</div> </div> '
    +'<div class="easy-pie '+healthpie+'" data-bar-color="rgba(66,197,36,0.9)" data-percent="100"> '
    +'<div class="percent">100</div> <div class="pie-title">Health %</div> </div> </div> </div> </div> </div> </div>';
     var measureContainer = document.createElement('div');
         measureContainer.id=i;
        measureContainer.appendChild(ali);
        //append to parent


    container.appendChild(measureContainer);
    easyPieChart(consumptionpie, '#eee', '#ccc', '#FFC107', 4, 'butt', 95);
    easyPieChart(healthpie, '#eee', '#ccc', '#FFC107', 4, 'butt', 95);

    //create Charts for measurements
   // createLiveChart("containerHighcharts", moment().subtract(100 * 1000, 'ms'), moment()));
      
    }*/

  }

   function addAttributes(applianceAttributes){

    $.each(applianceAttributes, function(index, element) {
        // console.log("applianceAttributes name::"+element.name+" element state:"+element.state);

         //update attributes
         $("#"+element.name).text(element.state);

         //update percentage
         // console.log("parseIntxt() name::"+element.name+":::"+element.state);
          var percentage = 0.1*(parseFloat(element.state).toFixed(4) /parseFloat($("#totalPower").text()).toFixed(4));
          //console.log("percentage()::"+percentage);
         
          $("#"+element.name+"_percent"+element.vgw).text(parseInt(percentage).toFixed(0));
          if ( $( "#"+element.name+"_percent"+element.vgw).length>0 ) { 
            //  console.log("percentage()::"+ element.name );
              //update pie chart!!
             $("#"+element.name+"_pie_percent"+element.vgw).data('easyPieChart').update(percentage);
          }

           //update battery /health chart!!
          if(element.name.search("production_battery_percentage") !=-1){
            //console.log("applianceAttributes name::"+element.name+" element state:"+element.state);
             //update attributes
           $("#"+element.name+element.vgw).text(parseFloat(element.state).toFixed(0));
            $("#"+element.name+"_pie"+element.vgw).data('easyPieChart').update(parseFloat(element.state).toFixed(4));
          }
          
       
      }); 
      

  }


});



 