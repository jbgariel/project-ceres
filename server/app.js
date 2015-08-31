// app.js
var mongojs = require('mongojs')
var db = mongojs('ceres_db', ['devices', 'devicestream'])

var spark = require('spark');

spark.login({username: '', password: ''});

insert = function insert(data){
    console.log("saved data: " + JSON.stringify(data));
    db.devicestream.insert(data);
};

spark.on('login', function() {

  //Get device events
  spark.getEventStream(false, 'mine', function(data) {
    console.log("Event: " + JSON.stringify(data));
	insert(data);
  });

});
