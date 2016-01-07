// app.js
var spark = require('spark');

var config = require('./config');

console.log(config);
console.log(config.mongodb.user_name);

spark.login({username: config.mongodb.user_name, password: config.mongodb.password});

function activateMotor(motorDuration) {
  spark.callFunction('300037000347343138333038','pump',motorDuration,function(err,data){
    console.log(err);
  });
};

activateMotor('20');

//curl "https://api.spark.io/v1/devices/300037000347343138333038?access_token=ed218fb2ed8bf607f58dc230fbf9061227d21656"



