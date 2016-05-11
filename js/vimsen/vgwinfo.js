// Docs at http://simpleweatherjs.com
function addVGWInfoWidget(vgwObject) {
  console.log("addVGWInfoWidget object:"+JSON.stringify(vgwObject));
  
 
      //for highcharts
      var data = [];
       var path = vgwObject.group+'/'+vgwObject.mac+'/VGW';

            var html =  '<div class="col-sm-12 col-md-12 col-lg-12 c-white">';
               
                 
                html += '<div class="col-sm-12 col-md-12 col-lg-12 m-b-25 p-0">';
                html += '<div class="card bgm-teal">';
                html += '<div class="col-md-12 col-sm-12 col-lg-12 todayWeatherDiv bgm-teal weatherDivIn p-0">';
                html += '<div class="vgw-header col-xs-12 p-b-10"><span  class="m-l-15 f-20" topicid="'+path+'/name/">Clear the </span></div>';
                html += '<div class="row">';

                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">';
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-5">';
                html += '<small>Activation Date</small> <h3  class="m-0 vgwText" topicid="'+path+'/Activation_Date/">Loading...</h3>';
                html += '</div>';                
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-5">';
                html += '<small>MAC Address</small> <h3  class="m-0 vgwText" topicid="'+path+'/MAC/">Loading...</h3>';
                html += '</div>';                
                 html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-5">';
                html += '<small>Firmware Version</small> <h3  class="m-0 vgwText" topicid="'+path+'/firmware_version/">Loading...</h3>';
                html += '</div>';                
                 html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-5">';
                html += '<small>Firmware Update</small> <h3  class="m-0 vgwText" topicid="'+path+'/firmware_update/">Loading...</h3>';
                html += '</div>';                
                html += '<div id="'+vgwObject.mac+'_Chart" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-0 p-0 cpuChart"></div>';
                html += '</div>'; 

                html += '<div class="col-sm-6 col-md-6 col-lg-6">';
                html += '<div class="col-sm-6 col-md-6 col-lg-6 m-b-5">';
                html += '<small>Uptime</small> <h3  class="m-0 vgwText" topicid="'+path+'/uptime/">Loading...</h3>';
                html += '</div>';                
                html += '<div class="col-sm-6 col-md-6 col-lg-6 m-b-5 ">';
                html += '<small>Last Ping</small> <h3  class="m-0 vgwText" topicid="'+path+'/LastPing/">Loading...</h3>';
                html += '</div>';                
                html += '</div>';

                html += '<div class="col-sm-6 col-md-6 col-lg-6">';
                html += '<div class="col-sm-12 col-md-12 col-lg-12 m-t-5 p-0 f-20 elementHeader">RAM</div>';
                html += '<div class="col-sm-4 col-md-4 col-lg-4 m-b-5">';
                html += '<small>Free</small> <span class="badge freeBar"> </span> <h3 id="'+vgwObject.mac+'_RAMfree" class="m-0 vgwText ram" topicid="'+path+'/RAM/free/">0</h3>';
                html += '</div>';                
                html += '<div class="col-sm-4 col-md-4 col-lg-4 m-b-5">';
                html += '<small>Used</small> <span class="badge usedBar"> </span> <h3 id="'+vgwObject.mac+'_RAMused" class="m-0 vgwText ram" topicid="'+path+'/RAM/used/">0</h3>';
                html += '</div>';   
                html += '<div class="col-sm-4 col-md-4 col-lg-4 m-b-5">';
                html += '<small>Total</small> <h3 id="'+vgwObject.mac+'_RAMtotal" class="m-0 vgwText ram" topicid="'+path+'/RAM/total/">1</h3>';
                html += '</div>';       

                html += '<div id="progressBar" class="col-sm-12 col-md-12 col-lg-12 m-b-15 p-0 progress bgm-teal">';
                html += '<div id="'+vgwObject.mac+'_RAMfreeBar" class="progress-bar freeBar" style="width: 30%">';
                html += '<span class="sr-only">30% Complete (success)</span>';
                html += '</div>';
                html += '<div id="'+vgwObject.mac+'_RAMusedBar" class="progress-bar usedBar" style="width: 70%">';
                html += '<span class="sr-only">70% Complete (warning)</span>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-sm-6 col-md-6 col-lg-6 m-t-5">';
                html += '<div class="col-sm-12 col-md-12 col-lg-12 m-t-10 p-0 f-20 elementHeader">CPU</div>';
                html += '<div class="col-sm-6 col-md-6 col-lg-6 m-b-5">';
                html += '<small>Usage</small> <h3  id="'+vgwObject.mac+'_CPUload" class="m-0 cpuElements" topicid="'+path+'/CPUload/">0</h3>';
                html += '</div>';                
                html += '<div class="col-sm-6 col-md-6 col-lg-6 m-b-5">';
                html += '<small>Temperature</small> <h3  class="m-0 cpuElements maxTemp" topicid="'+path+'/CPUtemp/">0</h3>';
                html += '</div>';  
                html += '</div>';

                html += '</div>';
                html += '<div class="vgw-list tomorrow p-b-5">';
                html += '<div class="weatherP row f-12 p-t-5 m-5">';
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">eth0_Global_IPv4:<span  class="m-l-5" topicid="'+path+'/eth0_Global_IPv4/">Loading... </span></div>';
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">eth0_Global_IPv6:<span  class="m-l-5" topicid="'+path+'/eth0_Global_IPv6/">Loading...</span></div>';
                html += '</div>';
                html += '<div class="weatherP row f-12 m-5">';
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">eth0_Local_IPv4:<span class="m-l-5" topicid="'+path+'/eth0_Local_IPv4/">Loading... </span></div>';
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">eth0_Local_IPv6:<span class="m-l-5" topicid="'+path+'/eth0_Local_IPv6/">Loading... </span></div>';
                html += '</div>';
                html += '<div class="weatherP row f-12 m-5">';
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">ppp0_IPv4:<span  class="m-l-5" topicid="'+path+'/ppp0_IPv4/">Loading...</span></div>';
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">ppp0_IP6:<span  class="m-l-5" topicid="'+path+'/ppp0_IP6/">Loading...</span></div>';
                html += '</div>';
                html += '<div class="weatherP row f-12 m-5">';
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">tun0_IPv4:<span  class="m-l-5" topicid="'+path+'/tun0_IPv4/">Loading...</span></div>';
                html += '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">tun0_IPv6:<span  class="m-l-5" topicid="'+path+'/tun0_IPv6/">Loading...</span></div>';
                html += '</div>';
                html += '</div></div>';
                
                
                html += '</div>';
                html += '</div>';

               
                var weatherItem = document.createElement('div');
                weatherItem.id = vgwObject.mac;
                weatherItem.innerHTML = html;

              var weatherContainer = document.getElementById('vgwinfo-widget');
         
              weatherContainer.appendChild(weatherItem);

                var data = [];
               var xval = parseFloat(0);
                     yval = parseFloat(90);
                    var x = [xval, yval];
                data.push(x);

             createChart(vgwObject.mac,data, vgwObject.name); 
     
  
};

function createChart(mac, data, name) {
  Highcharts.setOptions({
        global: {
            useUTC: false
        },
        chart: {
            style: {
                margin:'0px'
            }
        }
    });
  
    $('#'+mac+'_Chart').highcharts({

          chart: {
           type: "areaspline",
         backgroundColor:'#159f8f',// 'rgba(4,50,2,0.08)',
          height: 200
        },
         title: {
            text: 'CPU Usage',
            style: {
                    color: 'rgba(255,255, 255, 1)'
                }
            
       },
       xAxis: {
                type: 'datetime',
                labels: {
                style: {
                    color: 'rgba(255,255, 255, 1)'
                }
            }
        },
        yAxis: {
         title: {
          text: null
           },
            tickWidth: 1,
          labels: {
                style: {
                    color: 'rgba(255,255, 255, 1)'
                },
                format: '{value}%'
            },
           minorTickInterval: "auto",
           gridLineWidth: 0,
           minorGridLineWidth: 0,
          max:100
        },
        tooltip: {
         formatter: function() {
        return this.series.name +' CPU usage:<b>' + this.y + '%</b>';
           }
        },
       legend: {
            enabled: false
        },
       credits: {
         enabled: false
        },
       exporting: {
         enabled: false
        },
       
        series: []

    });

     var chart = $('#'+mac+'_Chart').highcharts();
   var data = [],time = (new Date()).getTime(),i;
   for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: parseFloat(0)
                        });
     }
          chart.addSeries({
               id:mac,
               vgw: mac,
               name:name,
               data: data,
               color: 'rgba(0,140,201,0.9)'/*,
               shadow: {
                  color: 'rgba(0,170,191,0.9)',
                  width: 8,
                  offsetX: 0,
                  offsetY: 0
              }*/
            });

  //console.log("createChart::"+data);
   Highcharts.setOptions({
    colors: ['rgba(0,170,191,0.99)']
});



 intervalLive(mac);
};

function intervalLive(chartContainer) {
    setInterval(function(){ 
         var chart = $('#'+chartContainer+'_Chart').highcharts();

          var time = (new Date()).getTime();
         
          $(chart.series).each(function(i, serie){
           // console.log(serie.options.id);
            //get value for CPU load
          var cpuLoad = parseFloat($("#"+serie.options.id+'_CPUload').text());
          //var floatI = parseFloat(8);
           serie.addPoint([time,cpuLoad]);
        })     
       
    
         }, 1000);
}
