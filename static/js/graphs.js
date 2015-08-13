queue()
    .defer(d3.json, "/ceres_db/devicestream")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, statesJson) {
	
	console.log("start makeGraphs fct")
	
	//Clean projectsJson data
	
	//var ceresProjects = require('./json_projects.json');
	
	var ceresProjects = projectsJson;
	console.log(JSON.stringify(ceresProjects[1]))
	
	var dateFormat = d3.time.format("%Y-%m-%d");
	ceresProjects.forEach(function(d) {
		d["published_at"] = new Date(d["published_at"]);
		d["published_at"].setDate(1);
		d["data"] = +d["data"];
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(ceresProjects);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["published_at"]; });
	var ligthDim  = ndx.dimension(function(d) { return d["data"]; });

	//Calculate metrics
	var numProjectsByDate = dateDim.group(); 
	console.log(numProjectsByDate)

	var all = ndx.groupAll();
	var totalDonations = ndx.groupAll().reduceSum(function(d) {return d["data"];});

	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["published_at"];
	var maxDate = dateDim.top(1)[0]["published_at"];

    //Charts
	var timeChart = dc.barChart("#time-chart");
	var numberProjectsND = dc.numberDisplay("#number-projects-nd");

	numberProjectsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	timeChart
		.width(900)
		.height(300)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(dateDim)
		.group(numProjectsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.xAxisLabel("Date")
		.yAxis().ticks(4);

    dc.renderAll();

};