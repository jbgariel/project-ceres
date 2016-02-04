// app.js
var mongojs = require('mongojs')
var spark = require('spark');

var config = require('./config');
var db = mongojs('ceres_db', ['devices', 'devicestream'])

console.log(config);
console.log(config.mongodb.user_name);

spark.login({username: config.mongodb.user_name, password: config.mongodb.password});

insert = function insert(data) {
  db.devicestream.insert(data);
};

send_data = function send_data(data) {
    console.log("Event: " + JSON.stringify(data));
    insert(data);
    console.log("Data inserted");  
    console.log("----------------------------");
};

var openStream = function() {

    //Get your event stream
    var req = spark.getEventStream(false, 'mine', function(data) {
      console.log("Event stream openned");
      if (typeof dataStream.name != "undefined") {
      	send_data(data)
      }
    });

    req.on('end', function() {
        console.log("ended!  re-opening in 3 seconds...");
        setTimeout(openStream, 3 * 1000);
    });
};

spark.on('login', function() {
    console.log("Retreiving data");
    openStream();
});

function activateMotor(motorDuration) {
	spark.callFunction('300037000347343138333038','serverPumpOrder',motorDuration,function(err,data){
		console.log("cannot pump ;)");
		console.log(err);
	});
};

//var data_json = JSON.stringify(data);
//var dataStream = JSON.parse(data_json);
//if (typeof dataStream.name != "undefined") {
//  if (dataStream.name == "dataStream"){
//    var sensorsData = dataStream.data.split(";");
//}}
