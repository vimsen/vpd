// Docs at http://simpleweatherjs.com
function addWeatherWidget(vgwObject, skycons) {
  console.log("addWeatherWidget object:"+JSON.stringify(vgwObject));
  
 
      //for highcharts
      var categories = [];
      var data = [];
      var weatherMeasurement= '&deg;C';
      var dewPointMeasurement= '&deg;C';
      var humidityMeasurement= '%';
      var ozoneMeasurement= 'DU';
      var pressureMeasurement= 'mb';
      var precipIntensityMeasurement= 'in/hr';
      var windSpeedMeasurement= 'm/hr';
      var path = vgwObject.group+'/'+vgwObject.mac+'/weather';

            var html =  '<div class="col-sm-12 col-md-12 col-lg-12 p-0">';
               
                html += '<div class="col-sm-12 col-md-12 col-lg-4">';
                html += '<div class="card weatherDiv weatherColor">';
                html += '<div class="weather-status p-t-5"><span topicid="'+path+'/current/temperature" class="p-l-10">'+0+'</span><span>'+weatherMeasurement+'</span></div>';
                html += '<ul class="weather-info m-10">';
                html += '<li>'+vgwObject.city+', '+vgwObject.country+'</li>';
                html += '<li>Current:<span topicid="'+path+'/current/summary">'+0+'</span></li>';
                html += '</ul>';
                html += '<div class="text-center p-b-5 m-b-5 p-l-10 p-r-10 row">';
                html += '<div class="col-xs-6"><p align="left"><img src="../../img/vimsen/humidity.png" title="Humidity" style="margin-right:3px" height="16" width="16s"><span topicid="'+path+'/current/humidity">Clear  day</span><span> '+humidityMeasurement+'</span></p>';
                html += '<p align="left"><img src="../../img/vimsen/cloudCover.png" title="Cloud Cover" style="margin-right:3px" height="16" width="16"><span id="cloudCover" topicid="'+path+'/current/cloudCover">0</span> %</p>';
                html += '<p align="left"><img src="../../img/vimsen/pressure.png" title="Pressure" style="margin-right:3px" height="16" width="16"><span topicid="'+path+'/current/pressure">Clear the day</span><span> '+pressureMeasurement+'</span></p>';
                html += '<p align="left"><img src="../../img/vimsen/precipProbability.png" title="Precipitation Probability" style="margin-right:3px" height="16" width="16"><span topicid="'+path+'/current/precipProbability">Clear the day</span> %</p>';
                html += '</div>';
                html += '<canvas class="col-xs-6" id= "'+path+'/current/icon"  width="128" height="128"></canvas>';
                html += '</div>';
                html += '<div class="weather-list tomorrow p-l-10 m-t-5">';
                html += '<div class="weatherP row">';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/precipType.png" title="Precipitation Type" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/current/precipType">Clear the day</span></div>';
                html += '<div class="col-xs-6"><i class="zmdi zmdi-chart zmdi-hc-fw" title="Precipitation Intensity"></i><span  class="m-l-5" topicid="'+path+'/current/precipIntensity">Clear the day</span><span class="m-r-10"> '+precipIntensityMeasurement+'</span></div>';
                html += '</div>';
                html += '<div class="weatherP row">';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/wind.png" title="Wind Speed" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/current/windSpeed">Clear the day</span><span class="m-r-10"> '+windSpeedMeasurement+'</span></div>';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/windBearing.png" title="Wind Bearing" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/current/windBearing">Clear the day</span> &deg;</div>';
                html += '</div>';
                html += '<div class="weatherP row">';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/dewPoint.png" title="Dew Point" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/current/dewPoint">Clear the day</span><span class="m-r-10"> '+dewPointMeasurement+'</span></div>';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/ozone.png" title="Ozone" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/current/ozone">Clear the day</span><span class="m-r-10"> '+ozoneMeasurement+'</span></div>';
                html += '</div>';
                html += '</div></div></div>';

     
                html += '<div class="col-sm-12 col-md-12 col-lg-8">';
                html += '<div class="card weatherColor">';
                html += '<div class="col-md-12 col-sm-12 col-lg-6 p-l-0 p-r-0 todayWeatherDiv weatherColor weatherDivIn">';
                html += '<div class="weather-status weatherHeader col-xs-12 p-t-5 m-b-5">Today</div>';
                html += '<div class="text-center p-t-10 p-b-25 m-0 p-l-0 p-r-0 row">';
                html += '<div class="col-xs-9 p-t-10">';
                html += '<span topicid="'+path+'/today/temperatureMax" class="weather-status text-left p-t-10 maxTemp">'+0+'</span>';
                html += '<span class="minMaxDiv">/</span>';
                html += '<span topicid="'+path+'/today/temperatureMin" class="weather-status text-left p-t-10 minTemp">'+9+'</span>';
                html += '</div>';
                html += '<canvas class="col-xs-3 p-10" id= "'+path+'/today/icon"  width="64" height="64"></canvas>';
                html += '</div>';
                html += '<div class="weather-info p-b-30 m-b-30">';
                html += '<div class="currently col-xs-8 f-14"><span topicid="'+path+'/today/summary">Clear throughout the day.</span></div>';
                html += '<div class="col-xs-4 m-0 p-0"><img src="../../img/vimsen/wind.png" title="Wind Speed" style="margin-right:3px" height="32" width="32"><span  class="m-l-0" topicid="'+path+'/today/windSpeed">0</span><span class="m-r-0"> '+windSpeedMeasurement+'</span></div>';
                html += '</div>';
                html += '<div class="weather-list tomorrow p-l-10">';
                html += '<div class="weatherP row f-16 p-t-5">';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/humidity.png" title="Humidity" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/today/humidity">Clear </span><span> '+humidityMeasurement+'</span></div>';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/cloudCover.png" title="Cloud Cover" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/today/cloudCover">Clear th</span> %</div>';
                html += '</div>';
                html += '<div class="weatherP row f-16">';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/sunrise.png" title="Sunrise time" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/today/sunriseTime-hhmm">Clear the </span></div>';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/sunset.png" title="Sunset Time" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/today/sunsetTime-hhmm">Clear the </span></div>';
                html += '</div>';
                html += '<div class="row f-16">';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/precipProbability.png" title="Precipitation Probability" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/today/precipProbability">Clear</span> %</div>';
                html += '<div class="col-xs-6"><i class="zmdi zmdi-chart zmdi-hc-fw" title="Precipitation Intensity"></i><span  class="m-l-5" topicid="'+path+'/today/precipIntensity">Clear</span><span class="m-r-10"> '+precipIntensityMeasurement+'</span></div>';
                html += '</div>';
                html += '</div></div>';
                
                html += '<div class="col-md-12 col-sm-12 col-lg-6 p-l-0 p-r-0 todayWeatherDiv weatherColor weatherDivIn">';
                html += '<div class="weather-status weatherHeader col-xs-12 p-t-5 m-b-5">Tomorrow</div>';
                html += '<div class="text-center p-t-10 p-b-25 m-0 p-l-0 p-r-0 row">';
                html += '<div class="col-xs-9 p-t-10">';
                html += '<span topicid="'+path+'/tomorrow/temperatureMax" class="weather-status text-left p-t-10 maxTemp">'+0+'</span>';
                html += '<span class="minMaxDiv">/</span>';
                html += '<span topicid="'+path+'/tomorrow/temperatureMin" class="weather-status text-left p-t-10 minTemp">'+9+'</span>';
                html += '</div>';
                html += '<canvas class="col-xs-3 p-15" id= "'+path+'/tomorrow/icon"  width="64" height="64"></canvas>';
                html += '</div>';
                html += '<div class="weather-info p-b-30 m-b-30">';
                html += '<div class="currently col-xs-8 f-14"><span topicid="'+path+'/tomorrow/summary">Clear throughout the day.</span></div>';
                html += '<div class="col-xs-4 m-0 p-0"><img src="../../img/vimsen/wind.png" title="Wind Speed" style="margin-right:3px" height="32" width="32"><span  class="m-l-0" topicid="'+path+'/tomorrow/windSpeed">0</span><span class="m-r-0"> '+windSpeedMeasurement+'</span></div>';
                html += '</div>';
                html += '<div class="weather-list tomorrow p-l-10">';
                html += '<div class="weatherP row f-16 p-t-5">';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/humidity.png" title="Humidity" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/tomorrow/humidity">Clear </span><span> '+humidityMeasurement+'</span></div>';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/cloudCover.png" title="Cloud Cover" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/tomorrow/cloudCover">Clear th</span> %</div>';
                html += '</div>';
                html += '<div class="weatherP row f-16">';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/sunrise.png" title="Sunrise time" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/tomorrow/sunriseTime-hhmm">Clear the </span></div>';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/sunset.png" title="Sunset Time" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/tomorrow/sunsetTime-hhmm">Clear the </span></div>';
                html += '</div>';
                html += '<div class="row f-16">';
                html += '<div class="col-xs-6"><img src="../../img/vimsen/precipProbability.png" title="Precipitation Probability" style="margin-right:3px" height="16" width="16"><span  class="m-l-5" topicid="'+path+'/tomorrow/precipProbability">Clear</span> %</div>';
                html += '<div class="col-xs-6"><i class="zmdi zmdi-chart zmdi-hc-fw" title="Precipitation Intensity"></i><span  class="m-l-5" topicid="'+path+'/tomorrow/precipIntensity">Clear</span><span class="m-r-10"> '+precipIntensityMeasurement+'</span></div>';
                html += '</div>';
                html += '</div></div>';
                html += '</div>';
                html += '</div>';

               
                var weatherItem = document.createElement('div');
                weatherItem.id = vgwObject.mac;
                weatherItem.innerHTML = html;

              var weatherContainer = document.getElementById('weather-widget');
         
              weatherContainer.appendChild(weatherItem);

              // you can add a canvas by it's ID...
               skycons.add(path+'/current/icon', Skycons.PARTLY_CLOUDY_DAY);
              skycons.add(path+'/today/icon', Skycons.PARTLY_CLOUDY_DAY);
              skycons.add(path+'/tomorrow/icon', Skycons.PARTLY_CLOUDY_DAY);



          
     //$("#weather-widget").html(html);
       /* if(weather.temp < 0) {
          $( '.weatherColor').css('background', 'rgba(230,230,230,0.9)');
        } else if(weather.temp >= 0 && weather.temp < 20)  {        
          $( '.weatherColor').css('background', 'rgba(0,188,212, 0.7)');
        } else if(weather.temp >= 20 && weather.temp < 30)   {        
        $( '.weatherColor').css('background', 'rgba(255,126,0, 0.6)');
        } else if(weather.temp >= 30) {        
          $( '.weatherColor').css('background', 'rgba(229,25,25,0.6)');
        } else {        
          $( '.weatherColor').css('background', '#0091c2');
        }*/

      
     // console.log("categories:"+categories);
     // console.log("data::"+data);
     // createChart(categories,data, vgwObject.city, vgwObject.country);        
  
};

function createChart(categories, data, city, country) {

  console.log("createChart::"+data);
 Highcharts.setOptions({
    colors: ['rgba(0,170,191,0.99)']
});


    $('#containerWeather').highcharts({

        chart: {
            backgroundColor:'rgba(0, 0, 0, 0)',
            type: 'columnrange',
            inverted: true
        },

        credits: {
         enabled: false
        },

        title: {
            text: 'Daily Temperature variation',
          style: {
         color: 'rgba(255,255, 255, 1)'
           }
       },

        subtitle: {
            text: 'Observed in '+city+','+country,
             style: {
              color: 'rgba(255,255, 255, 1)'
           }
        },

        xAxis: {
            categories: categories,
            labels: {
                style: {
                    color: 'rgba(255,255, 255, 1)'
                }
            }
         
        },

        yAxis: {
            title: {
                text: 'Temperature ( °C )',
                style: {
                    color: 'rgba(255,255, 255, 1)'
                }
            },
            labels: {
                style: {
                    color: 'rgba(255,255, 255, 1)'
                }
            }
        },

        tooltip: {
            valueSuffix: '°C',
            formatter:function(){

            return this.x +' Temperature Ranges- Lowest: '+this.point.low+' Highest: '+this.point.high ;
          }
        },

        plotOptions: {
          series: {
                borderColor: 'rgba(255,255, 255, 0.3)'
            },
            columnrange: {
                dataLabels: {
                    enabled: true,
                    color: 'rgba(255,255, 255, 0.7)',
                    formatter: function () {
                        return this.y + '°C';
                    }
                }
            },
             column: {
            colorByPoint: true
           }
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Temperatures',
            data: data
        }]

    });

};
