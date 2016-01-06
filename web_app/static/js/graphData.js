queue()
    .defer(d3.json, "/ceres_db/devicestream_light")
    .defer(d3.json, "/ceres_db/devicestream_temp")
    .defer(d3.json, "/ceres_db/devicestream_mois")
    .defer(d3.json, "/ceres_db/devicestream_watering")
    .await(makeGraphs);

function makeGraphs(error, json_light, json_temp, json_mois, json_watering, statesJson) {

  Highcharts.setOptions({
    global: {
        useUTC: false
    }
  });
  
  // Mois sensor
  $(function () {
    $('#moisture_evol').highcharts({
      chart: {
        zoomType: 'x'
      },
      colors: ['#1F3A93'],
      title: {
        text: ''
      },
      //subtitle: {
      //  text: '% of water over time'
      //},
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        min: 0,
        title: {
          text: '% of water'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0.5
            },
            stops: [
              [0, '#1F3A93'],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        },
      },

      series: [{
        type: 'area',
        name: '% of water',
        data: json_mois
      }],
            
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    });
  });

 
  // Light sensor
  $(function () {
    $('#light_evol').highcharts({
      chart: {
        zoomType: 'x'
      },
      colors: ['#F7CA18'],
      title: {
        text: ''
      },
      //subtitle: {
      //  text: 'Lumens over time'
      //},
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Lumens'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0.5
            },
            stops: [
              [0, '#F7CA18'],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        },
      },

      series: [{
        type: 'area',
        name: 'Lumens',
        data: json_light
      }],
            
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    });
  });

 
  // Temp sensor
  $(function () {
    $('#temp_evol').highcharts({
      chart: {
        zoomType: 'x'
      },
      colors: ['#CF000F'],
      title: {
        text: ''
      },
      //subtitle: {
      //  text: 'Celcius degrees over time'
      //},
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        min: 0,
        title: {
          text: '°C'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0.5
            },
            stops: [
              [0, '#CF000F'],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        },
      },

      series: [{
        type: 'area',
        name: '°C',
        data: json_temp
      }],
            
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    });
  });



  
var config1 = liquidFillGaugeDefaultSettings();
      config1.circleColor = "#CF000F";
      config1.textColor = "#CF000F";
      config1.waveTextColor = "#D91E18";
      config1.waveColor = "#FF7668";
      config1.circleThickness = 0.08;
      config1.waveHeight = 0;
      config1.waveAnimate = false;
      config1.waveCount = 1;
      config1.waveOffset = 0.25;
      config1.minValue = -10;
      config1.maxValue = 50;
      config1.displayPercent = false;
      var gauge1 = loadLiquidFillGauge("fillgauge1", json_temp[ Object.keys(json_temp).pop() ][1], config1);

var config2 = liquidFillGaugeDefaultSettings();
      config2.circleColor = "#1F3A93";
      config2.textColor = "#1F3A93";
      config2.waveTextColor = "#2574A9";
      config2.waveColor = "#6BB9F0";
      config2.circleThickness = 0.08;
      config2.waveAnimateTime = 3000;
      config2.waveHeight = 0.05;
      config2.waveCount = 2;
      config2.minValue = 0;
      config2.maxValue = 100;
      var gauge2 = loadLiquidFillGauge("fillgauge2", json_mois[ Object.keys(json_mois).pop() ][1] / 100, config2);

var config3 = liquidFillGaugeDefaultSettings();
      config3.circleColor = "#F7CA18";
      config3.textColor = "#F7CA18";
      config3.waveTextColor = "#F4D03F";
      config3.waveColor = "#F5D76E";
      config3.circleThickness = 0.08;
      config3.waveHeight = 0;
      config3.waveAnimate = false;
      config3.waveCount = 1;
      config3.waveOffset = 0.25;
      config3.minValue = 0;
      config3.maxValue = 2000;
      config3.displayPercent = false;
      var gauge3 = loadLiquidFillGauge("fillgauge3", json_light[ Object.keys(json_light).pop() ][1], config3);

}

