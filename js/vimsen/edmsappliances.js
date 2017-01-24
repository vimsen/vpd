$(document).ready(function() {

    // set profile name
    document.getElementById("profile-name").innerHTML = localStorage.getItem('vpName');
    document.getElementById("profile-name2").innerHTML = localStorage.getItem('vpName');

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

        // console.log(MY.dateFrom);
        // console.log(MY.dateTo);

        // getAllItemsEDMS(MY.dateFrom,MY.dateTo);
    });
    //end of daterangepicker

    /* jQuery(document).on('change','#controllerSelection',function() {
                    console.log("marker:"+$("#controllerSelection").val());                    
                   
      });   */

    //initProsumptionChart("containerTotalVGWConsumptionHighcharts", "Total Consumption per VGW");
    //initProsumptionChart("containerConsumptionHighcharts", "Consumption");
    // initProsumptionChart("containerProductionHighcharts", "Production");

    //var vgwFile = localStorage.getItem("vgwFile");
    // console.log("edmsAppliances:::: container:: vgw file::"+vgwFile);
    //get appliances for each controller
    vgwFile = "js/vimsen/user/" + localStorage.getItem('vpName') + ".json";
    var jqxhr = $.getJSON(vgwFile, function(data) {
            // console.log( "success:"+JSON.stringify(data));
        })
        .success(function(data) {

            // console.log( "second success Length"+JSON.stringify(data.item.length));
            $.each(data, function(index, element) {
                // console.log("index:" + index);
                // console.log("element:" + JSON.stringify(element.name));

                //add option to selection of controllers dropdown
                $('#controllerSelectionHistorical').append($('<option>', {
                    value: element.mac,
                    name: element.name,
                    text: element.name + " (" + element.mac + ")"
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
            console.log("error:::" + message);
        })
        .always(function(data) {
            // console.log( "finished"+JSON.stringify(data));
        });

    MY.dateFrom = moment().subtract(1, 'days').format('YYYY-MM-DDT00:00:00.000');
    MY.dateTo = moment().format('YYYY-MM-DDT23:59:59.000');
    //getAllItemsEDMS(moment().subtract(1, 'days').format('YYYY-MM-DDT00:00:00.000'), moment().format('YYYY-MM-DDT23:59:59.000'));

});

function getAllItemsEDMS(vgw, dateFrom, dateTo, interval) {

    /* --------------------------------------------------------
     Page Loader
     -----------------------------------------------------------*/
    if (!$('html').hasClass('ismobile')) {
        if ($('.page-loader')[0]) {
            setTimeout(function() {
                $('.page-loader').fadeIn();
            }, 500);

        }
    }
    // console.log("dateTo:::" + dateTo);
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
    console.log('https://beta.intelen.com/vimsenapi/EDMS_DSS/index.php/intelen/dataVGWHistorical?prosumers=' + vgw + '&startdate=' + dateFrom + '&enddate=' + dateTo + '&interval=' + interval + '');
    if ($('#getOfflineData').is(':checked')) {
        urlData = vgw + '.json'
    } else {
        urlData = 'https://beta.intelen.com/vimsenapi/EDMS_DSS/index.php/intelen/dataVGWHistorical?prosumers=' + vgw + '&startdate=' + dateFrom + '&enddate=' + dateTo + '&interval=' + interval + '';
    }

    $.ajax({
        url: urlData,
        type: 'GET',
        dataType: "json",
        success: function(result) {

            // If offline data are stored then present only those based on the requested start and end date
            RequestedMin = Date.parse(dateFrom);
            RequestedMax = Date.parse(dateTo);
            historyResults = [];
            if (result[0].HistoricalData.length > 0 && $('#getOfflineData').is(':checked')) {
                $.each(result[0].HistoricalData, function(i, n) {

                    // Re
                    if (!(Date.parse(Object.keys(n)[0]) < RequestedMin || Date.parse(Object.keys(n)[0]) > RequestedMax)) {
                        historyResults.push(n)
                    }
                    // get key for date 
                    // console.log("n:"+JSON.stringify(n));
                    //console.log("value:: i"+i+"::::" + Date.parse(Object.keys(n)[0]));                    
                    //get value for key date
                    //console.log("value:: i"+i+"::::" + n[Object.keys(n)[0]]);
                });
            } else {
                historyResults = result[0].HistoricalData;
            }

            //underscore group by topic name
            var groupByTopicName = _.groupBy(historyResults, 'TopicName');

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

            // Check whether or not to present graphs
            var hasTotalPower = 0,
                hasDevicePower = 0,
                hasDeviceProduction = 0,
                hasDeviceState = 0;
            var arrayKeys = Object.keys(groupByTopicName)
            for (var i in arrayKeys) {
                if (arrayKeys[i].indexOf("total_power") > -1 || arrayKeys[i].indexOf("power_total") > -1) {
                    hasTotalPower = 1
                }
                if (arrayKeys[i].indexOf("_plug") > -1 && arrayKeys[i].indexOf("power") > -1) {
                    hasDevicePower = 1
                }
                // this is specially for hedno stuff that are not formatted as agreed
                if (arrayKeys[i].indexOf("active") > -1 && arrayKeys[i].indexOf("power") > -1 && arrayKeys[i].indexOf("phase") <= -1) {
                    hasDevicePower = 1
                }
                if (arrayKeys[i].indexOf("_plug") > -1 && arrayKeys[i].indexOf("power") <= -1) {
                    hasDeviceState = 1
                }
                if (arrayKeys[i].indexOf("production") > -1) {
                    hasDeviceProduction = 1
                }
            }

            // Present and fill in graphs if data exist
            if (hasTotalPower == 0 && ($('#containerTotalVGWConsumptionHighcharts').highcharts()).series.length <= 0) {;
            } else {
                $('#pieTotalVGWConsumptionHighchart').show();
                $('#containerTotalVGWConsumptionHighcharts').show();
                // there was an issue with hide show that was causing the overlapping of charts. the below code seems to handle the issue
                $('#pieTotalVGWConsumptionHighchart').highcharts().reflow();
                $('#containerTotalVGWConsumptionHighcharts').highcharts().reflow();
                addToChart("containerTotalVGWConsumptionHighcharts", "pieTotalVGWConsumptionHighchart", groupByTopicName, "total_power", dateFrom, dateTo, "Total Consumption");
            }

            if (hasDevicePower == 0 && ($('#containerConsumptionHighcharts').highcharts()).series.length <= 0) {;
            } else {
                $('#pieConsumptionHighchart').show();
                $('#containerConsumptionHighcharts').show();
                // there was an issue with hide show that was causing the overlapping of charts. the below code seems to handle the issue
                $('#pieConsumptionHighchart').highcharts().reflow();
                $('#containerConsumptionHighcharts').highcharts().reflow();
                //create Series for power consumption
                addToChart("containerConsumptionHighcharts", "pieConsumptionHighchart", groupByTopicName, "plug", dateFrom, dateTo, "Consumption per Device");
                addToChart("containerConsumptionHighcharts", "pieConsumptionHighchart", groupByTopicName, "active", dateFrom, dateTo, "Consumption per Device");
            }
            if (hasDeviceState == 0) {;
            } else {
                $('#containerConsumptionHighchartsSTATE').show();
            }

            if (hasDeviceProduction == 0 && ($('#containerProductionHighcharts').highcharts()).series.length <= 0) {;
            } else {
                $('#pieProductionHighchart').show();
                $('#containerProductionHighcharts').show();
                // there was an issue with hide show that was causing the overlapping of charts. the below code seems to handle the issue
                $('#pieProductionHighchart').highcharts().reflow();
                $('#containerProductionHighcharts').highcharts().reflow();
                //create Series for power production
                addToChart("containerProductionHighcharts", "pieProductionHighchart", groupByTopicName, "production", dateFrom, dateTo, "Production per Device");
            }

            // If no data then show respective message
            if (hasTotalPower == 0 && hasDevicePower == 0 && hasDeviceProduction == 0 && hasDeviceState == 0) {
                $('#noDataText').show();
            } else {
                $('#noDataText').hide();
            }

        },
        error: function(data) {
            // console.log(data.status);
        },
        complete: function() {
            /* --------------------------------------------------------
            Page Loader
             -----------------------------------------------------------*/
            if (!$('html').hasClass('ismobile')) {
                if ($('.page-loader')[0]) {
                    setTimeout(function() {
                        $('.page-loader').fadeOut();
                    }, 500);
                }
            }
        }
    });

}