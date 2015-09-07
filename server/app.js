// app.js
var mongojs = require('mongojs')
var spark = require('spark');

var config = require('./config');
var db = mongojs('ceres_db', ['devices', 'devicestream'])

spark.login({username: config.mongodb.user_name, password: config.mongodb.password});

insert = function insert(data){
  var dataStream = JSON.stringify(data);
  console.log("saved data: " + dataStream);
  
  //console.log(dataStream.data.split(";"));
  
  db.devicestream.insert(dataStream);
};

spark.on('login', function() {

  //Get device events
  spark.getEventStream(false, 'mine', function(data) {
    console.log("Event: " + JSON.stringify(data));
	insert(data);
  });

});

