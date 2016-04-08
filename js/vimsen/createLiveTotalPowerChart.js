function initTotalPowerLiveChart(divId) {



   var chart = $('#'+divId+'').highcharts({
        /*chart: {
          //  backgroundColor: 'rgba(4,5,2,0.2)'
            type: 'spline'
         },
         */
      title: {
            text: 'Real Time Power (KW) for all VGWs'
            
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
                    text: "KWatts"
                }
        },
        credits: {
         enabled: false
        },
         plotOptions: {
            spline: {
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 3
                    }
                },
                marker: {
                    enabled: false
                }
            }
        },
        series: []
    });
     
 intervalTotalPowerLive(divId);

}

function createLiveTotalPowerChart(divId, object, dateFrom,dateTo) {
  // console.log(":::::::::::::createLiveTotalPowerChart:object ::::::::::::"+JSON.stringify(object) );   

//create series
 
     var data = [], dataProduction = [],time = (new Date()).getTime(),i;
      //parse only parametertocheck
    
    
     //console.log(":::::::::::::createLiveChart:name ::::::::::::"+element.name+" element::"+element.vgw );
    //add initiail points for real time
    if(object.type.toUpperCase() === "BUILDING"){
      for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: parseFloat($("#GPXT_active_power_total").text())                           
                        });
      }     

    } else {
      for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: parseFloat($("#"+object.mac+"_totalPower").text())
                        });
                        //push total production power
                        dataProduction.push({
                            x: time + i * 1000,
                            y: parseFloat($("#"+object.mac+"_totalPowerProduction").text())
                        });
      }
    }


     //add serie to series
     var chart = $('#'+divId+'').highcharts();
        
            chart.addSeries({
               id:object.name,
               vgw: object.mac,
               VGWtype: object.type,
               name:object.name+'-Consumption',
               prosumption:'Consumption',
               data: data
            });

             chart.addSeries({
               id:object.name,
               vgw: object.mac,
               VGWtype: object.type,
               name:object.name+'-Production',
               prosumption:'Production',
               data: dataProduction
            });

         //change tooltip
         chart.tooltip.options.formatter = function() {
          var xyArr=[];
          return  this.series.name + '</b> (VGW:<br/>' + this.series.options.vgw + ') value: ' + this.y+'(KW)' ;
         }

          //change legend  labels
         chart.legend.options.labelFormatter = function() {
          var xyArr=[];
          return  this.name + '<br/>(' + this.options.vgw + ')' ;
         }

   


}

function intervalTotalPowerLive(chartContainer) {
    setInterval(function(){ 
         var chart = $('#'+chartContainer+'').highcharts();
          var time = (new Date()).getTime();
         
          $(chart.series).each(function(i, serie){
           // console.log(serie.options.id);
            //get value for power
          if(serie.options.VGWtype.toUpperCase()==="BUILDING") {
           
            if(serie.options.prosumption.toUpperCase()==="PRODUCTION") {
             //  console.log("PRODUCTION serie::"+serie.name);
                var floatI = parseFloat($("#"+serie.options.vgw+"_totalPowerProduction").text());
            }else {
              //  console.log("CONSUMPTION serie::"+serie.name);
                var floatI = parseFloat($("#GPXT_active_power_total").text());
            }
              
          } else if(serie.options.prosumption.toUpperCase()==="PRODUCTION") {
              var floatI = parseFloat($("#"+serie.options.vgw+"_totalPowerProduction").text());
          }else {
           var floatI = parseFloat($("#"+serie.options.vgw+"_totalPower").text());
          }
         
           serie.addPoint([time,floatI]);
        })     
       
    
         }, 1000);
}

