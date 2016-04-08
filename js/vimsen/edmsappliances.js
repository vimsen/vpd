$(document).ready(function () {
    console.log("edmsAppliances:::::");

    initConsumptionChart("containerConsumptionHighcharts", "Consumption");

    
  getAllItemsEDMS();

      
});


function getAllItemsEDMS() {
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
              url: 'https://beta.intelen.com/vimsenapi/EDMS_DSS/index.php/intelen/dataVGWHistorical?prosumers=b827ebb47c1b&startdate=2016-04-03T06:30:00.000+02:00&enddate=2016-04-22T07:15:00.000+02:00&interval=900',
              type: 'GET',
              dataType: "json",
              success: function(result) {
                              // console.log(JSON.stringify(result[0].HistoricalData));
                                   if (result[0].HistoricalData.length > 0) {
                                    $.each(result[0].HistoricalData, function (i, n) {
                                        // graphSeries = new Array();
                                        //get key for date 
                                       // console.log("value:: i"+i+"::::" + Object.keys(n)[0]);
                                        //get value for key date
                                      // console.log("value:: i"+i+"::::" + n[Object.keys(n)[0]]);
                                      

                                    });
                                } 

                                //underscore group by topic name
                               var groupByTopicName = _.groupBy(result[0].HistoricalData, 'TopicName');
                               console.log(groupByTopicName);

                               //create Series for power consumption
                                addToChart("containerConsumptionHighcharts",groupByTopicName);
           
                           },
              error: function(data) {
               console.log(data.status);
                }
             });

}