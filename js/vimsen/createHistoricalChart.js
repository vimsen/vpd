function initProsumptionChart(divId, prosumption) {
    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        series: {
            turboThreshold: 2000 //larger threshold or set to 0 to disable
        }
    });

    var chart = $('#' + divId + '').highcharts({
        chart: {
            zoomType: 'x',
            events: {
                redraw: function() {
                    this.hideLoading();
                }
            }
            //  backgroundColor: 'rgba(4,5,2,0.2)'
        },
        title: {
            text: 'Historical ' + prosumption + ' (W) for all VGWs'

        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            minorTickInterval: 'auto',
            minorTickLength: 0
        },
        yAxis: {
            minorTickInterval: 'auto',
            minorTickLength: 0,
            title: {
                text: "Watts"
            }
        },
        credits: {
            enabled: false
        },
        series: [],
        lang: {
            noData: "No data to display"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#fff'
            }
        },
        plotsOptions: {
            series: {
                turboThreshold: 2000 //larger threshold or set to 0 to disable
            },
            line: {
                turboThreshold: 2000 //larger threshold or set to 0 to disable
            }

        }
    });

    //add chart for ON/OFF for consumption
    if (prosumption.toLowerCase() == "consumption") {
        //$('#' + divId + '').append("<div id='" + divId + "STATE' class='stateChart'></div>");
        var chart2 = $('#' + divId + 'STATE').highcharts({
            chart2: {
                zoomType: 'x',
                events: {
                    redraw: function() {
                        this.hideLoading();
                    }
                }
                //  backgroundColor: 'rgba(4,5,2,0.2)'
            },
            title: {
                text: 'Historical ' + prosumption + ' STATE per Device for all VGWs'

            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                minorTickInterval: 1,
                minorTickLength: 0
            },
            yAxis: {
                max: 1,
                tickInterval: 1,
                title: {
                    text: "STATE"
                }
            },
            credits: {
                enabled: false
            },
            series: [],
            lang: {
                noData: "No data to display"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#fff'
                }

            }
        });

    }

}

function initPieChart(divId, prosumption) {
    // Make monochrome colors and set them as default for all pies
    Highcharts.getOptions().plotOptions.pie.colors = (function() {
        var colors = [],
            base = Highcharts.getOptions().colors[0],
            i;

        for (i = 0; i < 10; i += 1) {
            // Start out with a darkened base color (negative brighten), and end
            // up with a much brighter color
            colors.push(Highcharts.Color(base).brighten((i - 2) / 9).get());
        }
        return colors;
    }());

    var chart = $('#' + divId + '').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Historical PIE ' + prosumption + ' '
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y:.1f} Watts</b>'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                size: '80%',
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    distance: -30,
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: " ",
            y: 0
        }]
    });

}

function addToChart(divId, pieDivId, object, prosumptionType, dateFrom, dateTo, titleText) {
    // console.log(":::::::::::::createLiveChart:object ::::::::::::"+JSON.stringify(object) );

    //add serie to series
    var chart = $('#' + divId + '').highcharts();

    //remove all series
    // var seriesLength = chart.series.length;
    //  for(var i = seriesLength -1; i > -1; i--) {
    //     chart.series[i].remove();
    //  }
    chart.showLoading();
    //change title
    chart.setTitle({
        text: 'Historical ' + titleText + ' (W) for all VGWs from ' + moment(dateFrom).format('DD/MM/YYYY') + ' to ' + moment(dateTo).format('DD/MM/YYYY')
    });

    //add pie serie to series
    var pieChart = $('#' + pieDivId + '').highcharts();
    var pieData = [];

    //iterate to each item in object
    $.each(object, function(index, element) {
        var yPie = 0;
        console.log("ela" + prosumptionType + index + element)
            //for consumption devices iterate to each line inside array
        if (index.toLowerCase().search(prosumptionType) != -1 && index.toLowerCase().search("power") != -1 && index.toLowerCase().search("phase") == -1) {
            var data = [];
            console.log("ela@");
            $.each(element, function(i, n) {
                //  console.log("value:: i"+i+"::::" + n.User);
                //get key for date 
                // console.log("value:: i"+i+"::::" + moment(Object.keys(n)[0]));
                //get value for key date
                //console.log("value:: i"+i+"::::" + n[Object.keys(n)[0]]);
                data.push({
                    x: moment(Object.keys(n)[0]),
                    y: parseInt(n[Object.keys(n)[0]])
                });

                //sum values for pie chart
                yPie += parseInt(n[Object.keys(n)[0]]);

            });
            //console.log("data:: "+JSON.stringify(element[0].Prosumers));
            chart.addSeries({
                id: index,
                vgw: element[0].Prosumers,
                name: index + "@" + element[0].Prosumers,
                data: data,
                turboThreshold: 0
            });

            //change tooltip
            chart.tooltip.options.formatter = function() {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%e %b %Y - %I:%M %p',
                        new Date(this.x)) +
                    ' ' + this.y + ' W';

            };

            //change legend  labels
            chart.legend.options.labelFormatter = function() {
                var xyArr = [];
                //replace _power for plugs only
                var nameR = (this.name.toLowerCase().search("plug") != -1) ? this.name.replace('_power', '') : this.name;
                return nameR + '<br/>(' + this.options.vgw + ')';
            };

            // console.log("index::::"+index+"ypie:::"+yPie);
            //pieObj.push(index+"@"+element[0].Prosumers,yPie);  
            var pieObj = {
                name: index + "@" + element[0].Prosumers,
                y: yPie
            };
            //console.log("pieObj::::"+JSON.stringify(pieObj)); 

            /*pieChart.addSeries({
               id:index,
               vgw: element[0].Prosumers,
               name:index,
               data: pieObj
            });
*/
            //pieData.push(pieObj);
            //pieChart.series[0].addPoint(pieObj);

            pieChart.series[0].addPoint(pieObj);

        };

        //chaet for Consumption DEVICES to show ON/OFF states
        if (index.toLowerCase().search(prosumptionType) != -1 && index.toLowerCase().search("power") == -1 && index.toLowerCase().search("production") == -1) {
            //add serie to series
            console.log("prosumptionType" + index);
            console.log("prosumptionType" + index.toLowerCase().search("plug"));
            console.log("prosumptionType" + index.toLowerCase().search("power"));
            var chart2 = $('#' + divId + 'STATE').highcharts();
            // chart2.showLoading();
            //change title
            chart2.setTitle({
                text: 'Historical ' + titleText + ' STATE for all VGWs from ' + moment(dateFrom).format('DD/MM/YYYY') + ' to ' + moment(dateTo).format('DD/MM/YYYY')
            });

            var data = [];
            $.each(element, function(i, n) {
                //  console.log("value:: i"+i+"::::" + n.User);
                //get key for date 
                // console.log("value:: i"+i+"::::" + moment(Object.keys(n)[0]));
                //get value for key date
                // console.log("value:: i"+i+"::::" + n[Object.keys(n)[0]]);
                var y = n[Object.keys(n)[0]] == "ON" ? 1 : 0;
                //console.log("value:: y" + y);

                data.push({
                    x: moment(Object.keys(n)[0]),
                    y: parseInt(y)
                });
            });
            //console.log("data:: "+JSON.stringify(element[0].Prosumers));
            chart2.addSeries({
                id: index,
                vgw: element[0].Prosumers,
                name: index,
                data: data,
                turboThreshold: 0
            });

            //change tooltip
            chart2.tooltip.options.formatter = function() {
                //replace 1 with ON
                var yR = (this.y === 1) ? 'ON' : 'OFF';

                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%e %b %Y - %I:%M %p',
                        new Date(this.x)) +
                    ' STATE: ' + yR + '';

            };

            //change legend  labels
            chart2.legend.options.labelFormatter = function() {
                var xyArr = [];
                return this.name + '<br/>(' + this.options.vgw + ')';
            };

        };

    });

    //intervalFunction(object,parameterToCheck,divId);
    //console.log("pie data::"+JSON.stringify(pieData));

}