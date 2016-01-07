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

function openStream() {
  const req = Spark.getEventStream( false, 'mine', function(data) {
    console.log("Defining variables");

    var data_json = JSON.stringify(data);
    var dataStream = JSON.parse(data_json);

    console.log("Defined data verification");

    if (typeof dataStream.name != "undefined") {
       if (dataStream.name == "dataStream"){
        var sensorsData = dataStream.data.split(";");
    }

    console.log("Event: " + JSON.stringify(data));
    insert(data);
    console.log("Data inserted");  
    console.log("----------------------------"); 
  });
  req.on('end', function() {
    console.warn("Spark event stream ended! re-opening in 3 seconds...");
    setTimeout(openStream, 3 * 1000);
  });
}

spark.on('login', function() {

  console.log("Retreiving data");

  //Get device events
  openStream()
  //spark.getEventStream(false, 'mine', function(data) {
//
//    console.log("Defining variables");
//
//    var data_json = JSON.stringify(data);
//    var dataStream = JSON.parse(data_json);
//
//    console.log("Defined data verification");
//
//    if (typeof dataStream.name != "undefined") {
//       if (dataStream.name == "dataStream"){
//        var sensorsData = dataStream.data.split(";");
//    }
//
//    console.log("Event: " + JSON.stringify(data));
//    insert(data);
//    console.log("Data inserted");  
//    console.log("----------------------------");   
// }
	//activateMotor(20);
});

});

var activateMotor = function(motorDuration) {
	spark.callFunction('300037000347343138333038','serverPumpOrder',motorDuration,function(err,data){
		console.log("cannot pump ;)");
		console.log(err);
	});
};
