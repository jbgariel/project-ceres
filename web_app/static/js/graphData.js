queue()
    .defer(d3.json, "/ceres_db/devicestream")
    .defer(d3.json, "/ceres_db/devicestream_watering")
    .defer(d3.json, "/ceres_db/devicestream_test")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, projectsJson_watering, projectsJson_test, statesJson) {
	
	console.log("start makeGraphs fct");
	
	//Clean projectsJson data
	var devicestream = projectsJson;
  //var devicestream_test = JSON.parse(JSON.stringify(projectsJson_test));
    
  var devicestream_test = $.map(projectsJson_test, function(el) { return el; });  
    
  console.log(JSON.stringify(devicestream[1]));
  console.log(JSON.stringify(devicestream_test[1]));

	var watering = projectsJson_watering;
	console.log(JSON.stringify(watering));
  
	var dateFormat = d3.time.format("%Y-%m-%d");
	devicestream.forEach(function(d) {
		d["published_at"] = new Date(d["published_at"]);
		d["published_at"].setDate(1);
		//d["data"] = +d["data"];
	});

	watering.forEach(function(d) {
		d["published_at"] = new Date(d["published_at"]);
		d["published_at"].setDate(1);
	});
  
  var data = devicestream.map(function (d) {
    
    var data_json = JSON.stringify(d);
  	var dataStream = JSON.parse(data_json);
    var sensorsData = dataStream.data.split(";");
  
    return {
      date:  d.published_at,
      temp: sensorsData[0],
      light: sensorsData[1],
      mois: sensorsData[2],
    };
  });
    
  var markers = watering.map(function (marker) {
    return {
      date: marker.published_at,
      type: "PumpManual",//marker.name,
      quantity: marker.data
    };
  });
    
  makeChart(data, markers);  
  
  
  // test highcharts
  
  $(function () {
    //$.getJSON(projectsJson_test, function (data) { 
      console.log(devicestream_test);
        $('#container').highcharts({
            chart: {
                zoomType: 'x'
            },
            colors: ['#1F3A93'],
            title: {
                text: 'Moisture Sensor'
            },
            subtitle: {
                text: '% of water over time'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
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
                            y2: 1
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
                data: devicestream_test
            }],
            
            exporting: {
              enabled: false
            },
            credits: {
              enabled: false
            }
        });
  //});
  });
  
  
  
  
};