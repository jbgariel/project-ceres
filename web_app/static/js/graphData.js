queue()
    .defer(d3.json, "/ceres_db/devicestream")
    .defer(d3.json, "/ceres_db/devicestream_watering")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, projectsJson_watering, statesJson) {
	
	console.log("start makeGraphs fct");
	
	//Clean projectsJson data
	var devicestream = projectsJson;
  console.log(JSON.stringify(devicestream[1]));
  
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
  
  console.log(data);
  
  makeChart(data, markers);  

};    