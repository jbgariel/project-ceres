queue()
    .defer(d3.json, "/ceres_db/devicestream_light")
    .defer(d3.json, "/ceres_db/devicestream_temp")
    .defer(d3.json, "/ceres_db/devicestream_mois")
    .defer(d3.json, "/ceres_db/devicestream_watering")
    .await(makeGraphs);

function makeGraphs(error, json_light, json_temp, json_mois, json_watering, statesJson) {
	
  var watering = json_watering;
  var dateFormat = d3.time.format("%Y-%m-%d");
  watering.forEach(function(d) {
	  d["published_at"] = new Date(d["published_at"]);
    d["published_at"].setDate(1);
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

}
