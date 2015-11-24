// app.js
var mongojs = require('mongojs')
var spark = require('spark');

var config = require('./config');
var db = mongojs('ceres_db', ['devices', 'devicestream'])

console.log(config);
console.log(config.mongodb.user_name);
console.log(config.mongodb.password);

spark.login({username: config.mongodb.user_name, password: config.mongodb.password});

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

spark.on('login', function() {
  rl.question("Activate motor y/n? ", function(answer) {
    if (answer.match(/^y(es)?$/i)) {
      console.log("Motor:", answer);
      activateMotor(20);
      rl.close();
    }
  });
});

var activateMotor = function(motorDuration) {
	spark.callFunction('300037000347343138333038','pump',motorDuration,function(err,data){
		console.log("cannot pump ;)");
		console.log(err);
	});
};
