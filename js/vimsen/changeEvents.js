$("#controllerSelectionMap").change(function() {
    console.log("changeController:" + $("#controllerSelectionMap").val());

    //change total power to element
    // $( "#totalPowerInput" ).val($("#totalPower").text());

    //hide appliances if selected one controller      
    hideDivs($("#controllerSelectionMap").val());
});

function hideDivs(controllerId) {
    //get consumpion chart
    var chartC = $('#containerConsumptionHighcharts').highcharts();
    //get all series
    var allSeriesC = chartC.series;

    //get production chart
    var chartP = $('#containerProductionHighcharts').highcharts();
    //get all series
    var allSeriesP = chartP.series;

    //get power chart
    var chartTotalPower = $('#containerTotalPowerHighcharts').highcharts();
    //get all series
    var alltotalPowerSeries = chartTotalPower.series;

    if (controllerId === 'all') {
        //if all selected then show all
        $('#appliancesWidget > div').show();
        $('#powerEnergyWidget > div').show();
        $('#totalPowerEnergy').show();
        //$('#appliancesWidget > input').show();
        //$("#totalPower").text($("#totalPowerInput").val());
        //show all charts
        showLegends(chartC, allSeriesC);
        showLegends(chartP, allSeriesP);
        showLegends(chartTotalPower, alltotalPowerSeries);

        //change title of the chart
        chartC.setTitle({
            text: 'Real Time Consumption (W) per Device for all VGWs'
        });
        chartP.setTitle({
            text: 'Real Time Production (W) per Device for all VGWs'
        });
        chartTotalPower.setTitle({
            text: 'Real Time Power (KW) for all VGWs'
        });

    } else {
        //hide all except selected class
        //$('#appliancesWidget > input').not('.'+controllerId).hide();

        $('#appliancesWidget > div').not('.' + controllerId).hide();
        $('#powerEnergyWidget > div').not('#' + controllerId + 'powerEnergy').hide();
        $('.' + controllerId).show();
        $('#' + controllerId + 'powerEnergy').show();
        $('#totalPowerEnergy').hide();

        hideLegends(chartC, allSeriesC, controllerId, 'Real Time Consumption (W) per Device for ' + controllerId)
        hideLegends(chartP, allSeriesP, controllerId, 'Real Time Production (W) per Device for ' + controllerId)
        hideLegends(chartTotalPower, alltotalPowerSeries, controllerId, 'Real Time Power (KW) for ' + controllerId)
    }

    // Show/hide graphs based on whether or not have data inside them
    var c = $('#containerTotalPowerHighcharts').highcharts()
    if (!c.hasData()) {
        $('#containerTotalPowerHighcharts').hide()
    } else {
        $('#containerTotalPowerHighcharts').show()
    }
    var c = $('#containerConsumptionHighcharts').highcharts()
    if (!c.hasData()) {
        $('#containerConsumptionHighcharts').hide()
    } else {
        $('#containerConsumptionHighcharts').show()
    }
    var c = $('#containerProductionHighcharts').highcharts()
    if (!c.hasData()) {
        $('#containerProductionHighcharts').hide()
    } else {
        $('#containerProductionHighcharts').show()
    }
};

function showLegends(chartObject, series) {
    $.each(series, function(index, serie) {
        serie.show();
        //show in legend
        serie.options.showInLegend = true;
        chartObject.legend.renderItem(serie);
        chartObject.legend.render();
    });

};

function hideLegends(chartObject, series, vgw, titleText) {
    $.each(series, function(index, serie) {
        serie.hide();
        //hide from legend
        serie.options.showInLegend = false;
        serie.legendItem = null;
        chartObject.legend.destroyItem(serie);
        chartObject.legend.render();
        // console.log("vgw:"+serie.options.vgw);                       
        if (vgw == serie.options.vgw) {
            serie.show();
            //show in legend
            serie.options.showInLegend = true;
            chartObject.legend.renderItem(serie);
            chartObject.legend.render();
            //change title of the chart
            chartObject.setTitle({
                text: titleText
            });
        }

    });

};

$("#controllerSelectionMapWeather").change(function() {
    console.log("changeController:" + $("#controllerSelectionMapWeather").val());

    //change total power to element
    // $( "#totalPowerInput" ).val($("#totalPower").text());

    //hide appliances if selected one controller      
    hideWeatherDivs($("#controllerSelectionMapWeather").val());
});

function hideWeatherDivs(controllerId) {
    console.log("hideWeatherDivs");
    if (controllerId === 'all') {
        //if all selected then show all
        $('#weather-widget > div').show();

    } else {
        //hide all except selected class
        //$('#appliancesWidget > input').not('.'+controllerId).hide();

        $('#weather-widget > div').not('.' + controllerId).hide();
        $('#' + controllerId).show();

    }
}

$("#controllerSelectionMapVGW").change(function() {
    console.log("changeController:" + $("#controllerSelectionMapWeather").val());

    //change total power to element
    // $( "#totalPowerInput" ).val($("#totalPower").text());

    //hide appliances if selected one controller      
    hideVGWDivs($("#controllerSelectionMapVGW").val());
});

function hideVGWDivs(controllerId) {
    console.log("hideVGWDivs");
    if (controllerId === 'all') {
        //if all selected then show all
        $('#vgwinfo-widget > div').show();

    } else {
        //hide all except selected class
        //$('#appliancesWidget > input').not('.'+controllerId).hide();

        $('#vgwinfo-widget > div').not('.' + controllerId).hide();
        $('#' + controllerId).show();

    }
}

$("#controllerSelectionHistorical").change(function() {
    //console.log("controllerSelectionHistorical:"+$("#controllerSelectionHistorical").val());
    MY.selectedVGWs = $("#controllerSelectionHistorical").val();
    // console.log(MY.selectedVGWs);              
});

;

$("#submitHistoricalData").click(function() {

    //console.log("submitHistoricalData controllerSelectionHistorical:"+$("#controllerSelectionHistorical").val());
    $('#noDataText').hide();

    if ((MY.selectedVGWs != null && $("#intervalSelection").val() != null) || $('#getOfflineData').is(':checked')) {

        initProsumptionChart("containerTotalVGWConsumptionHighcharts", "Total Consumption per VGW");
        initProsumptionChart("containerConsumptionHighcharts", "Consumption");
        initProsumptionChart("containerProductionHighcharts", "Production");

        initPieChart("pieTotalVGWConsumptionHighchart", "Total Consumption per VGW");
        initPieChart("pieConsumptionHighchart", "Total Consumption per Appliance");
        initPieChart("pieProductionHighchart", "Total Production per Appliance");

        $('#containerTotalVGWConsumptionHighcharts').hide();
        $('#pieTotalVGWConsumptionHighchart').hide();
        $('#containerConsumptionHighcharts').hide();
        $('#pieConsumptionHighchart').hide();
        $('#containerConsumptionHighchartsSTATE').hide();
        $('#containerProductionHighcharts').hide();
        $('#pieProductionHighchart').hide();

        if ($('#getOfflineData').is(':checked') && MY.selectedVGWs == null) {
            var VGWS = [];
            $('#controllerSelectionHistorical').find('option').each(function() {
                VGWS.push($(this).val());
            })
        } else {
            VGWS = MY.selectedVGWs;
        }
        $.each(VGWS, function(index, value) {
            getAllItemsEDMS(value, MY.dateFrom, MY.dateTo, $("#intervalSelection").val());
        });

    }

    $(window).load(function() {
        console.log("LOADED");
    });
});