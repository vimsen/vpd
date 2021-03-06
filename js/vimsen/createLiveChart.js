function initLiveChart(divId, prosumption) {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    var chart = $('#' + divId + '').highcharts({
        chart: {
            //  backgroundColor: 'rgba(4,5,2,0.2)'
        },
        title: {
            text: 'Real Time ' + prosumption + ' (W) per Device for all VGWs'

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
        }
    });

    intervalLive(divId);
}

function createLiveChart(divId, object, parameterToCheck, prosumption, dateFrom, dateTo) {
    //console.log(":::::::::::::createLiveChart:object ::::::::::::"+JSON.stringify(object) );

    //create series
    $.each(object, function(index, element) {

        var data = [],
            time = (new Date()).getTime(),
            i;
        //parse only parametertocheck

        //add serie to series
        var chart = $('#' + divId + '').highcharts();
        //console.log(element.name, element.itemType, element.state);
        //console.log("parcheck: " + parameterToCheck + " - prosumption:" + prosumption);
        if ((element.itemType.search("BuildingItem") != -1 && element.name.search(prosumption) != -1 && $.isNumeric(element.state) != false) ||
            (element.name.search(parameterToCheck) != -1 && element.name.search(prosumption) != -1) ||
            (element.name.search(prosumption) != -1 && element.name.search("energy") == -1 && element.name.search("Period") == -1)) {

            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: parseFloat(element.state)
                });
            }
            console.log(element.name);
            chart.addSeries({
                id: element.name,
                vgw: element.vgw,
                name: element.name,
                vgwname: element.vgwname,
                data: data
            });

            //change tooltip
            chart.tooltip.options.formatter = function() {
                var xyArr = [];

                return this.series.name + '</b> (<br/>' + this.series.options.vgwname + ') value: ' + this.y + '(W)';
            }

            //change legend  labels
            chart.legend.options.labelFormatter = function() {
                var xyArr = [];
                return this.name + '<br/>(' + this.options.vgwname + ')';
            }
        }
    });

    //intervalFunction(object,parameterToCheck,divId);

}

function intervalLive(chartContainer) {
    setInterval(function() {
        var chart = $('#' + chartContainer + '').highcharts();
        var time = (new Date()).getTime();

        $(chart.series).each(function(i, serie) {
            // console.log(serie.options.id);
            //get value for power
            var floatI = parseFloat($("#" + serie.options.id + serie.options.vgw).text());
            if (serie.options.id.search("Period") == -1) {
                serie.addPoint([time, floatI]);
            }
        })

    }, 1000);
}

function intervalFunction(objItem, parameterToCheck, chartContainer) {
    setInterval(function() {
        // console.log(":::::::::::::intervalFunction:objItem ::::::::::::"+objItem+" parameterToCheck::"+parameterToCheck );
        //create series
        $.each(objItem, function(index, element) {

            var time = (new Date()).getTime();

            // console.log(':isnumeric:::::::::::'+$.isNumeric($("#"+element.name).text()));
            //parse only parametertocheck
            if (element.name.search(parameterToCheck) != -1 && ($.isNumeric($("#" + element.name).text()) != false || element.itemType.search("BuildingItem") != -1)) {

                // console.log(":::::::::::::update:index ::::::::::::"+element.name+" element::"+element.state );
                //add initiail points for real time
                var chart = $('#' + chartContainer + '').highcharts();

                series = chart.get(element.name);
                var floatI = parseFloat($("#" + element.name).text());
                // console.log("series::"+series+":::floatI]:"+floatI);

                // Add point
                series.addPoint([time, floatI]);

            }

        });
    }, 1000);
}