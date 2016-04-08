function initConsumptionChart(divId, prosumption) {
 Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
 
   var chart = $('#'+divId+'').highcharts({
        chart: {
          //  backgroundColor: 'rgba(4,5,2,0.2)'
         },
         title: {
            text: 'Real Time '+prosumption+' (W) per Device for all VGWs'
            
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
            title:{
                    text: "Watts"
                }
        },
        credits: {
         enabled: false
        },
        
        series: []
    });     
 

}

function addToChart(divId, object) {
   // console.log(":::::::::::::createLiveChart:object ::::::::::::"+JSON.stringify(object) );
    
  //add serie to series
     var chart = $('#'+divId+'').highcharts();

//iterate to each item in object
  $.each(object, function(index, element) {

    //for consumption devices iterate to each line inside array
    if(index.search("Plug") != -1  &&index.search("power") != -1){
    var data = [];
     $.each(element, function (i, n) {
         
         //get key for date 
    // console.log("value:: i"+i+"::::" + moment(Object.keys(n)[0]));
    //get value for key date
    //console.log("value:: i"+i+"::::" + n[Object.keys(n)[0]]);
                         data.push({
                            x: moment(Object.keys(n)[0]),
                            y: parseInt(n[Object.keys(n)[0]])
                        });
     });
    // console.log("data:: "+JSON.stringify(data));
         chart.addSeries({
               id:index,
              // vgw: element.vgw,
               name:index,
               data: data
            });
    }
    
        

         //change tooltip
         chart.tooltip.options.formatter = function() {
          return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%e %b %Y - %I:%M %p',
                                          new Date(this.x))
                + ' ' + this.y + ' W';
            
         }

          //change legend  labels
         chart.legend.options.labelFormatter = function() {
          var xyArr=[];
          return  this.name + '<br/>(' + this.options.vgw + ')' ;
         }
    

      
    });

  //intervalFunction(object,parameterToCheck,divId);

}