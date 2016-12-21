// Config.js
var config = function () {};

config.prototype.GetPG = function () {
	var cfg={
	  	user: 'postgres',
		password: 'postgres',
		database: 'geocoder',
		host: '127.0.0.1',
		port: 5433,
		application_name: 'Geocodificardor Cali',
		max: 30, //set pool max size to 30
	  	min: 2, //set min pool size to 2
	  	idleTimeoutMillis: 1000 
	};
	return cfg;	 
};

config.prototype.GetPort = function (){
	var port=3000;
	return port;
};


module.exports = new config();
 