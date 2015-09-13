// app.js
var mongojs = require('mongojs')
var spark = require('spark');

var config = require('./config');
var db = mongojs('ceres_db', ['devices', 'devicestream'])

console.log(config);
console.log(config.mongodb.user_name);
console.log(config.mongodb.password);

spark.login({username: config.mongodb.user_name, password: config.mongodb.password});

insert = function insert(data) {
  db.devicestream.insert(data);
};

spark.on('login', function() {

  //Get device events
  spark.getEventStream(false, 'mine', function(data) {

  	var data_json = JSON.stringify(data);
  	var dataStream = JSON.parse(data_json);

  	if (dataStream.name == "dataStream"){
  		var sensorsData = dataStream.data.split(";");
 		console.log(sensorsData[0]);
  	}

  	console.log(sensorsData);
    console.log("Event: " + JSON.stringify(data));
	insert(data);
	//activateMotor(20);
  });

});

var activateMotor = function(motorDuration) {
	spark.callFunction('300037000347343138333038','serverPumpOrder',motorDuration,function(err,data){
		console.log("cannot pump ;)");
		console.log(err);
	});
};
