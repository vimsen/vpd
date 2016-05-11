function initProsumptionChart(divId, prosumption) {
 Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
 
   var chart = $('#'+divId+'').highcharts({
        chart: {
            zoomType: 'x',
            events: {
                redraw: function () {
                  this.hideLoading();
                }
            }
          //  backgroundColor: 'rgba(4,5,2,0.2)'
         },
         title: {
            text: 'Historical '+prosumption+' (W) per Device for all VGWs'
            
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

function addToChart(divId, object,prosumptionType, dateFrom, dateTo,titleText) {
   // console.log(":::::::::::::createLiveChart:object ::::::::::::"+JSON.stringify(object) );
    
  //add serie to series
     var chart = $('#'+divId+'').highcharts();

     //remove all series
     // var seriesLength = chart.series.length;
      //  for(var i = seriesLength -1; i > -1; i--) {
       //     chart.series[i].remove();
      //  }
      chart.showLoading();
    //change title
    chart.setTitle({ text: 'Historical ' +titleText+' (W) per Device for all VGWs from '+moment(dateFrom).format('DD/MM/YYYY') +' to '+moment(dateTo).format('DD/MM/YYYY')});

//iterate to each item in object
  $.each(object, function(index, element) {

    //for consumption devices iterate to each line inside array
    if(index.toLowerCase().search(prosumptionType) != -1  &&index.toLowerCase().search("power") != -1){
    var data = [];
     $.each(element, function (i, n) {
       //  console.log("value:: i"+i+"::::" + n.User);
         //get key for date 
    // console.log("value:: i"+i+"::::" + moment(Object.keys(n)[0]));
    //get value for key date
    //console.log("value:: i"+i+"::::" + n[Object.keys(n)[0]]);
                         data.push({
                            x: moment(Object.keys(n)[0]),
                            y: parseInt(n[Object.keys(n)[0]])
                        });
     });
     console.log("data:: "+JSON.stringify(element[0].Prosumers));
         chart.addSeries({
               id:index,
               vgw: element[0].Prosumers,
               name:index,
               data: data
            });
    };
    
        

         //change tooltip
         chart.tooltip.options.formatter = function() {
          return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%e %b %Y - %I:%M %p',
                                          new Date(this.x))
                + ' ' + this.y + ' W';
            
         };

          //change legend  labels
         chart.legend.options.labelFormatter = function() {
          var xyArr=[];
          return  this.name + '<br/>(' + this.options.vgw + ')' ;
         };

         


    

      
    });

  //intervalFunction(object,parameterToCheck,divId);

}