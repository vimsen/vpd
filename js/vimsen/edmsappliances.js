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
      console.log(picker.startDate.format('YYYY-MM-DD'));
      console.log(picker.endDate.format('YYYY-MM-DD'));
      getAllItemsEDMS(picker.startDate.format('YYYY-MM-DDT23:59:59.000'),picker.endDate.format('YYYY-MM-DDT23:59:59.000'));
    });
    //end of daterangepicker

    initConsumptionChart("containerConsumptionHighcharts", "Consumption");

    
  getAllItemsEDMS(moment().subtract(1, 'days').format('YYYY-MM-DDT23:59:59.000'), moment().format('YYYY-MM-DDT23:59:59.000'));
   

      
});


function getAllItemsEDMS(dateFrom,dateTo) {
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
              url: 'https://beta.intelen.com/vimsenapi/EDMS_DSS/index.php/intelen/dataVGWHistorical?prosumers=b827ebb47c1b&startdate='+dateFrom+'&enddate='+dateTo+'&interval=900',
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
                                addToChart("containerConsumptionHighcharts",groupByTopicName, dateFrom, dateTo);
           
                           },
              error: function(data) {
               console.log(data.status);
                }
             });

}