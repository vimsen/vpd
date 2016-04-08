$(document).ready(function () {
    console.log("addAppliances:::: container::");
    initLiveChart("containerHighcharts");
           
    var objItem = [];
    var objAttributes = [];

    var vgwObject = [];
   
     var appliancesObject = [];
    //add 3 phase meters
    var meter1_power=0;
    var meter2_power=0;
    var meter3_power=0;

    var meter1_energy=0;
    var meter2_energy=0;
    var meter3_energy=0;
    //var totalPower=0;
    //var totalEnergy=0;

    // Container <div> where dynamic content will be placed
    var container = document.getElementById('appliancesWidget');


    // Clear previous contents of the container
    while (container.hasChildNodes()) {
       container.removeChild(container.lastChild);
    }

    //get appliances for each controller
     var jqxhr = $.getJSON( "js/vimsen/vgw.json", function(data) {
     // console.log( "success:"+JSON.stringify(data));
    })
    .success(function(data) {
       // var obj = jQuery.parseJSON( data.item );
     vgwObject.push(data);
       // console.log( "second success Length"+JSON.stringify(data.item.length));
       //  $.each(data, function(index, element) {
             // console.log( "index:"+index);
              // console.log( "element:"+JSON.stringify(element));
              //  $.when( getAppliances(element) ).done(function() {
               //   console.log("objItem1::"+JSON.stringify(objItem));
              //  });
            //   getAppliances(element);
      //  });

                  

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

    $.each(vgwObject, function(index, element) {
             // console.log( "index:"+index);
              // console.log( "element:"+JSON.stringify(element));
              //  $.when( getAppliances(element) ).done(function() {
               //   console.log("objItem1::"+JSON.stringify(objItem));
              //  });
           appliancesObject.push(getAppliancesObj(element));
    }).done(function() {
   getAppliances(appliancesObject);
});

   
    
     //  console.log("objItem2::"+JSON.stringify(objItem));
   
     /*
     * Easy Pie Charts - Used in widgets
     */
  function easyPieChart(id, trackColor, scaleColor, barColor, lineWidth, lineCap, size) {
       // console.log('easyPieChart id:'+id);
        $('.'+id).easyPieChart({
            trackColor: trackColor,
            scaleColor: scaleColor,
             barColor: function (percent) {
       return (percent < 50 ? '#5cb85c' : percent < 75 ? '#f0ad4e' : '#cb3935');
    },
            lineWidth: lineWidth,
            lineCap: lineCap,
            size: size
        });
  }
    
  function getAppliancesObj(vgwObject) {
      //object list to keep appliances
    //var objItem = [];
   // var objAttributes = [];
    console.log( "getAppliancesObj::::"+JSON.stringify(vgwObject));
    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    //this must be the ip of the VGW
   // var jqxhr = $.getJSON( "http://gmtls.mooo.com:8888/rest/items?type=json", function(data) {
     var jqxhr = $.getJSON( '' + vgwObject.url +':'+ vgwObject.port +'/rest/items?type=json', function(data) {
     // console.log( "success:"+JSON.stringify(data));
    })
     .success(function(data) {
       // var obj = jQuery.parseJSON( data.item );

       return data;
        

     })
    .fail(function(message) {
      console.log( "error" +JSON.stringify(message));
     })
   

  }

   
  function getAppliances(appliancesObject) {
      //object list to keep appliances
    //var objItem = [];
   // var objAttributes = [];
    console.log( "getAppliances::::"+JSON.stringify(appliancesObject));
    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    //this must be the ip of the VGW
   // var jqxhr = $.getJSON( "http://gmtls.mooo.com:8888/rest/items?type=json", function(data) {
   
       // var obj = jQuery.parseJSON( data.item );

       // console.log( "second success Length"+JSON.stringify(data.item.length));
         $.each(appliancesObject.item, function(index, element) {
           // console.log("Index::"+index+" element:"+element.type);
            //for each element check if it switchitem and contains fibaro(consumption) (or production item like itm_uber)
            //for test we ll put fibaro inestead of consumption
            //and itm_uber instead of production

            //consumption
            addItemToList("SwitchItem",vgwObject.consumptionNaming,element,"Consumption",objItem);
            addAttributesToList("NumberItem",vgwObject.consumptionNaming,element,objAttributes);

            //production
            //for porduction items check again with george
            addItemToList("NumberItem",vgwObject.productionNaming,element, "Production",objItem);
            addAttributesToList("NumberItem",vgwObject.productionNaming,element,objAttributes);

            //get total power consumption
            addTotalProsumption("NumberItem",vgwObject.meterNaming,vgwObject.powerNaming, element);
            
            //get total energy consumption
            addTotalProsumption("NumberItem",vgwObject.meterNaming,vgwObject.energyNaming, element);

            $("#totalPower").text((parseFloat($("#meter1_power").text())+parseFloat($("#meter2_power").text())+parseFloat($("#meter3_power").text())/1000).toFixed(2));
            
            $("#totalEnergy").text((parseFloat($("#meter1_energy").text())+parseFloat($("#meter2_energy").text())+parseFloat($("#meter3_energy").text())).toFixed(2));
            
        });
        //  console.log("objItem::"+JSON.stringify(objItem));
         // console.log("objAttributes::"+JSON.stringify(objAttributes));

           //create Charts for measurements
           //create Series for power
           createLiveChart("containerHighcharts",objAttributes, "_"+vgwObject.powerNaming, moment().subtract(100 * 1000, 'ms'), moment());
           //create div
           createDiv(vgwObject.name, objItem,objAttributes);

     
   

  }

  function addItemToList(parameterTocheck,typeOfControl, element, prosumption,objItem) {
   // console.log("addItemToList::"+element);
    if(element.type.search(parameterTocheck) != -1 && element.name.search(typeOfControl) != -1){
        //contains
        //create appliances items
        //for porduction items check again with george
        if(typeOfControl==='production'){
          var applianceItems = {
            name: element.name,
            type: element.type,
            state:"ON",
            prosumption: prosumption       
          }
        } else  {
        
          var applianceItems = {
            name: element.name,
            type: element.type,
            state:element.state,
            prosumption: prosumption       
          }
        }


        //add object to objectlists
        objItem.push(applianceItems);
        
    }

  }

   function addAttributesToList(parameterTocheck,typeOfControl, element,objAttributes) {
   // console.log("addItemToList::"+element);
    if(element.type.search(parameterTocheck) != -1 && element.name.search(typeOfControl) != -1){
        //contains
       console.log("addAttributesToList::"+element.name+"::"+element.state);

        //create apliances attributes (power, energy)
        //we should ask geroge to change tthe production item to be like consumption.
        //right now there is now switchitem, only number item
        if(typeOfControl==='production'){
           var applianceAttributes = {
            name: element.name+'_power',
            state: parseFloat(element.state).toFixed(2)      
         }
        } else  {
         var applianceAttributes = {
            name: element.name,
            state: parseFloat(element.state).toFixed(2)     
         }
        }

        //add object to objectlists
         objAttributes.push(applianceAttributes);
    }

  }

   function addTotalProsumption(parameterTocheck,typeOfControl, searchString, element) {
   // console.log("addItemToList::"+element);
    if(element.type.search(parameterTocheck) != -1 && element.name.search(typeOfControl) != -1 && element.name.search(searchString) != -1){
        //contains
       // console.log("addTotalProsumption::"+element.name+":::"+element.state);
      
       // if(searchString==="power")
        $("#"+element.name).text(parseFloat(element.state/1000).toFixed(2));


    


       // if(searchString==="energy")
       // totalEnergy +=parseFloat(element.state);
    }

  }

  

  function createDiv(vgwname, applianceObject,objAttributes){

    $.each(applianceObject, function(index, element) {
           // console.log(" element:"+element.name+" state:"+element.state);

                //add new
        var applianceName = element.name;
         var healthpie = "health-pie-"+index;
    var ali = document.createElement('div');
    ali.innerHTML = '<div  class="dash-widget-item consumptionApplianceItem"> <div class="consumptionHeader"> '
    +'<div class="dash-widget-header"> <div class="dash-widget-title"> '+applianceName+' <br/> <small>'+vgwname+'</small> </div>'
    +' <div class="pull-right m-t-15 m-r-5 m-b-15"> <div class="toggle-switch" data-ts-color="red"> '
    +'<input id="ts-'+applianceName+'" type="checkbox" hidden="hidden" class="switchON_OFF"> <label for="ts-'+applianceName+'" class="ts-helper"></label> </div> </div> </div>'
    +' <div class="clearfix"></div> </div> <div class="bgm-teal p-20"> <div class="row"> '
    +'<div class="appliancesConsumptionDetails col-xs-6 m-t-30"> <small>'+element.prosumption+' (W)</small> '
    +'<h3 id= "'+applianceName+'_power" class="m-0 f-400 c-white power_value">0</h3> <br/> <small>'+element.prosumption+' (Wh)</small>'
    +' <h3 id= "'+applianceName+'_energy"class="m-0 f-400 c-white energy_value">0</h3> <br/>'
    +' <small>STATE</small> <h3 id= "'+applianceName+'_state" class="m-0 f-400 c-white state_value">'+element.state+'</h3> </div> <div class="col-xs-6"> '
    +'<div class="p-t-20 p-b-20 text-center c-white"> <div class="easy-pie '+applianceName+'" id= "'+applianceName+'_power_pie_percent" data-percent="0">'
    +' <div class="percent" id= "'+applianceName+'_power_percent">0</div> <div class="pie-title">'+element.prosumption+' %</div> </div> '
    +'<div class="easy-pie '+healthpie+'" data-bar-color="rgba(66,197,36,0.9)" data-percent="100"> '
    +'<div class="percent">100</div> <div class="pie-title">Health %</div> </div> </div> </div> </div> </div> </div>';
     
     var measureContainer = document.createElement('div');
         measureContainer.id=index;
        measureContainer.appendChild(ali);
        //append to parent


    container.appendChild(measureContainer);
    easyPieChart(applianceName, '#eee', '#ccc', '#FFC107', 4, 'butt', 95);
    easyPieChart(healthpie, '#eee', '#ccc', '#FFC107', 4, 'butt', 95);

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
          var percentage = 0.1*(parseFloat(element.state).toFixed(2) /parseFloat($("#totalPower").text()).toFixed(2));
          //console.log("percentage()::"+percentage);
         
          $("#"+element.name+"_percent").text(parseInt(percentage).toFixed(0));
          if ( $( "#"+element.name+"_percent").length>0 ) { 
              //console.log("percentage()::"+ element.name );
              //update pie chart!!
             $("#"+element.name+"_pie_percent").data('easyPieChart').update(percentage);
          }
          
       
      }); 
      

  }


});



 