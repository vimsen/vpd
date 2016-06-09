$(document).ready(function () {
    console.log("edmsAppliances:::::");
     
    //daterangepicker
    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM DD, YYYY') + ' - ' + end.format('MMMM DD, YYYY'));
    }
    cb(moment().subtract(1, 'days'), moment());

    $('#reportrange').daterangepicker({
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
           'minDate': moment().subtract(1, 'years'),
           'maxDate': moment()
    }, cb);
    //on change dates call edms
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
      //add values to date from datet
      MY.dateFrom = picker.startDate.format('YYYY-MM-DDT00:00:00.000');
      MY.dateTo = picker.endDate.format('YYYY-MM-DDT23:59:59.000');

      console.log(MY.dateFrom);
      console.log(MY.dateTo);


     // getAllItemsEDMS(MY.dateFrom,MY.dateTo);
    });
    //end of daterangepicker

    /* jQuery(document).on('change','#controllerSelection',function() {
                    console.log("marker:"+$("#controllerSelection").val());                    
                   
      });   */  
              
    //initProsumptionChart("containerTotalVGWConsumptionHighcharts", "Total Consumption per VGW");
    //initProsumptionChart("containerConsumptionHighcharts", "Consumption");
   // initProsumptionChart("containerProductionHighcharts", "Production");

    var vgwFile = localStorage.getItem("vgwFile");
    console.log("edmsAppliances:::: container:: vgw file::"+vgwFile);
     //get appliances for each controller
     var jqxhr = $.getJSON(vgwFile, function(data) {
     // console.log( "success:"+JSON.stringify(data));
    })
    .success(function(data) {
       
       // console.log( "second success Length"+JSON.stringify(data.item.length));
       $.each(data, function(index, element) {
              console.log( "index:"+index);
              console.log( "element:"+JSON.stringify(element.name));
              

         //add option to selection of controllers dropdown
          $('#controllerSelectionHistorical').append($('<option>', {
            value: element.mac,
            text: element.name
          }));
         //$('#controllerSelectionHistorical').selectpicker('refresh');
        });  
      /* $('#controllerSelectionHistorical').append($('<option>', {
            value: "all",
            text: "All VGWs"
          }));*/
       $('#controllerSelectionHistorical').selectpicker('refresh');


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

    
   MY.dateFrom = moment().subtract(1, 'days').format('YYYY-MM-DDT00:00:00.000');
   MY.dateTo = moment().format('YYYY-MM-DDT23:59:59.000');
    //getAllItemsEDMS(moment().subtract(1, 'days').format('YYYY-MM-DDT00:00:00.000'), moment().format('YYYY-MM-DDT23:59:59.000'));
   

      
});


function getAllItemsEDMS(vgw, dateFrom,dateTo, interval) {

      /* --------------------------------------------------------
     Page Loader
     -----------------------------------------------------------*/
    if(!$('html').hasClass('ismobile')) {
        if($('.page-loader')[0]) {
            setTimeout (function () {
                $('.page-loader').fadeIn();
            }, 500);

        }
    }
    console.log("dateTo:::"+dateTo);
/*    var AvailabilityRequest = JSON.stringify({
                 'prosumers' : 'b827eb4c14af', 
                 'startdate' : '2016-04-03T06:30:00.000+02:00', 
                 'enddate' : '2016-04-13T06:30:00.000+02:00',
                 'interval': 900
    });

     $.ajax({
              url: 'https://beta.intelen.com/vimsenapi/EDMS_DSS/index.php/intelen/dataVGWHistorical?',
              type: 'POST',
              beforeSend: function(xhr) {
                            //   xhr.setRequestHeader('Authorization', 'bearer ' + _token);
                           },
              data: AvailabilityRequest ,
              dataType: "json",
              contentType: "application/json",
              processData: false,
              success: function(data) {
                               console.log(data[0]);
                           },
              error: function(data) {
               console.log(data.status);
                }
             });
*/
 /* var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "https://beta.intelen.com/vimsenapi/EDMS_DSS/index.php/intelen/dataVGWHistorical?prosumers=b827eb4c14af&startdate=2016-04-03T06:30:00.000+02:00&enddate=2016-04-22T07:15:00.000+02:00&interval=900", true);
xmlhttp.send();
      */
       $.ajax({
              url: 'https://beta.intelen.com/vimsenapi/EDMS_DSS/index.php/intelen/dataVGWHistorical?prosumers='+vgw+'&startdate='+dateFrom+'&enddate='+dateTo+'&interval='+interval+'',
              type: 'GET',
              dataType: "json",
              success: function(result) {
                              // console.log(JSON.stringify(result[0].HistoricalData));
                               if (result[0].HistoricalData.length > 0) {
                                    $.each(result[0].HistoricalData, function (i, n) {
                                        // graphSeries = new Array();
                                        //get key for date 
                                       // console.log("n:"+JSON.stringify(n));
                                        //console.log("value:: i"+i+"::::" + Object.keys(n)[0]);
                                        //get value for key date
                                       //console.log("value:: i"+i+"::::" + n[Object.keys(n)[0]]);
                                      

                                    });
                                } 

                                //underscore group by topic name
                               var groupByTopicName = _.groupBy(result[0].HistoricalData, 'TopicName');
                               console.log(groupByTopicName);

                              /* //sum all values of same topic
                               var out = _(groupByTopicName).map(function(g, key) {
                                  return { 
                                     type: key, 
                                     val: _(g).reduce(function(m,x) { 
                                       return m + x.val;
                                     }, 0) 
                                  };
                                });
                                console.log("SUM PIE:"+JSON.stringify(out));
                                //*/
                               //create Series for power total consumption per VGW
                                addToChart("containerTotalVGWConsumptionHighcharts","pieTotalVGWConsumptionHighchart", groupByTopicName,"total_power", dateFrom, dateTo, "Total Consumption");
                                
                               //create Series for power consumption
                                addToChart("containerConsumptionHighcharts", "pieConsumptionHighchart", groupByTopicName,"plug", dateFrom, dateTo, "Consumption");
                               //create Series for power production
                                addToChart("containerProductionHighcharts", "pieProductionHighchart", groupByTopicName,"production", dateFrom, dateTo,"Production");
           
              },
              error: function(data) {
               console.log(data.status);
              },
              complete: function() {
                /* --------------------------------------------------------
                Page Loader
                 -----------------------------------------------------------*/
                if(!$('html').hasClass('ismobile')) {
                 if($('.page-loader')[0]) {
                   setTimeout (function () {
                   $('.page-loader').fadeOut();
                    }, 500);
                 }
                }
              }
             });

}

$(window).load(function () {
   console.log("LOADED");
});