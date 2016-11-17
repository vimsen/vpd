// Docs at http://simpleweatherjs.com
$(document).ready(function() {
    // google.maps.event.addDomListener(window, 'load', initialize);
    LoadMap();
    $.simpleWeather({
        woeid: '', //2357536
        location: 'Athens, GR',
        unit: 'c',
        success: function(weather) {
            console.log("successsss");

            //for highcharts
            var categories = [];
            var data = [];

            var html = '<div class="col-sm-12 col-md-12 col-lg-12">';

            html += '<div class="col-sm-12 col-md-12 col-lg-4">';
            html += '<div class="card weatherDiv weatherColor">';
            html += '<div class="weather-status">' + weather.temp + '&deg;' + weather.units.temp + '</div>';
            html += '<ul class="weather-info m-10">';
            html += '<li>' + weather.city + ', ' + weather.country + '</li>';
            html += '<li class="currently">Current:' + weather.currently + '</li>';
            html += '</ul>';
            html += '<div class="weather-icon wi-' + weather.code + '"></div>';
            html += '<div class="weather-status text-center p-b-20 m-b-25">' + weather.text + '</div>';
            html += '<div class="weather-list tomorrow p-20 m-t-30">';
            html += '<p>';
            html += '<i class="zmdi zmdi-upload zmdi-hc-fw"></i> <span>High:' + weather.high + '&deg;' + 'C </span>';
            html += '<i class="zmdi zmdi-download zmdi-hc-fw"></i> <span>Low:' + weather.low + '&deg;' + 'C</span>';
            html += '</p>';
            html += '</div></div></div>';

            html += '<div class="col-sm-12 col-md-12 col-lg-8">';
            html += '<div class="card weatherColor">';
            html += '<div id="weatherDetailsHeader" class="weather-status weatherColor">Details</div>';
            html += '<div class="col-md-12 col-sm-12 col-lg-6 weatherColor weatherDivIn">';
            html += '<ul class="weather-info m-5">';
            html += '<li>Humidity: ' + weather.humidity + '%</li>';
            html += '<li>Pressure: ' + weather.pressure + weather.units.pressure + '</li>';
            html += '</ul>';
            html += '<img src="../../img/vimsen/wind.png" height="145" width="145" class="m-15"><span class="weather-status text-left p-t-10">' + weather.wind.speed + weather.units.speed + '</span>';
            html += '<ul class="weather-info">';
            html += '<li>Wind chill: ' + weather.wind.chill + '</li>';
            html += '<li>Direction: ' + weather.wind.direction + '</li>';
            html += '</ul>';
            html += '</div>';
            html += '<div class="col-md-12 col-sm-12 col-lg-6 weatherColor weatherDivIn">';
            html += '<ul class="weather-info m-5">';
            html += '<li>Rising: ' + weather.rising + '</li>';
            html += '<li>Visibility: ' + weather.visibility + ' ' + weather.units.distance + '</li>';
            html += '</ul>';
            html += '<div class="p-t-20 m-t-30">';
            html += '<img src="../../img/vimsen/daylight.png" height="100" width="130" class="m-30">';
            /* html += '<p><span class="spanBorder"><img src="../../img/vimsen/sunrise.png" height="22" width="22" class="m-15">Sunrise at: '+weather.sunrise+' </span>';
             html += '<span class="spanBorder"><img src="../../img/vimsen/sunset.png" height="22" width="22" class="m-15">Sunset at: '+weather.sunset+'</span></p>';
             */
            html += '<p class="m-t-15"><span class="spanBorder">Sunrise at: ' + weather.sunrise + ' </span>';
            html += '<span class="spanBorder">Sunset at: ' + weather.sunset + '</span></p>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="col-md-12 col-sm-12 m-b-10"><div class="bgm-teal"><div id="forecastHeader" class="weather-status">Forecast</div>';
            html += '<div id="weatherForecast" class="col-md-6 col-sm-6 bgm-teal">';
            for (var i = 0; i < weather.forecast.length; i++) {
                //var day = moment(new Date(weather.forecast[i].date));   
                var xval = parseFloat(weather.forecast[i].low);
                yval = parseFloat(weather.forecast[i].high);
                var x = [xval, yval];
                data.push(x);
                categories.push(weather.forecast[i].day)

                html += '<div class="weather-forecast weather-list after-tomorrow">';
                html += '<span class="weather-list-icon wi-' + weather.forecast[i].code + '"></span><span>' + weather.forecast[i].day + ' ' + weather.forecast[i].date + '</span><span>' + weather.forecast[i].text + '</span>';
                //html += '<i class="zmdi zmdi-upload zmdi-hc-fw weatherUpDown"></i> <span class="weatherSpan">High:'+weather.forecast[i].high+'&deg;'+'C </span>';
                // html += '<i class="zmdi zmdi-download zmdi-hc-fw weatherUpDown"></i> <span class="weatherSpan">Low:'+weather.forecast[i].low+'&deg;'+'C</span></p>';
                html += '</div>';
                // html += '<p>'+weather.forecast[i].day+': '+weather.forecast[i].high+'</p>';
            }

            html += '</div>';
            html += '<div class="col-md-6 col-sm-6 bgm-teal"><div id="containerWeather" style="height:100%; margin: 0 auto"></div>';
            html += '</div></div>';

            $("#weather-widget").html(html);
            if (weather.temp < 0) {
                $('.weatherColor').css('background', 'rgba(230,230,230,0.9)');
            } else if (weather.temp >= 0 && weather.temp < 20) {
                $('.weatherColor').css('background', 'rgba(0,188,212, 0.7)');
            } else if (weather.temp >= 20 && weather.temp < 30) {
                $('.weatherColor').css('background', 'rgba(255,126,0, 0.6)');
            } else if (weather.temp >= 30) {
                $('.weatherColor').css('background', 'rgba(229,25,25,0.6)');
            } else {
                $('.weatherColor').css('background', '#0091c2');
            }

            // console.log("categories:"+categories);
            // console.log("data::"+data);
            createChart(categories, data, weather.city, weather.country);

        },
        error: function(error) {
            $("#weather-widget").html('<p>' + error + '</p>');
        }
    });
});

function createChart(categories, data, city, country) {

    // console.log("createChart::"+data);
    Highcharts.setOptions({
        colors: ['rgba(0,170,191,0.99)']
    });

    $('#containerWeather').highcharts({

        chart: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
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
            text: 'Observed in ' + city + ',' + country,
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
            formatter: function() {

                return this.x + ' Temperature Ranges- Lowest: ' + this.point.low + ' Highest: ' + this.point.high;
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
                    formatter: function() {
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

//get map coordintes
function initialize() {
    var myCenter = new google.maps.LatLng(17.433053, 78.412172);
    var mapProp = {
        center: myCenter,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    var marker = new google.maps.Marker({
        position: myCenter,
        title: 'Click to zoom'
    });

    marker.setMap(map);

    var infowindow = new google.maps.InfoWindow({
        content: "Hi"
    });

    //Zoom to 7 when clicked on marker
    google.maps.event.addListener(marker, 'click', function() {
        map.setZoom(18);
        map.setCenter(marker.getPosition());
        infowindow.open(map, marker);
    });
}