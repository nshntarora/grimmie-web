var express = require('express');
var mysql = require("mysql");

var app = express();

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "139.59.1.150",
  user: "root",
  password: "grimmie123",
  database: "grimmie",
  //socketPath: '139.59.1.150/var/run/mysqld/mysqld.sock'
});

con.connect(function(err){
  	if(err){
    	console.log('Error connecting to Db');
    	console.log(err)
  	}
  	else
  		console.log('Connection established');
	});

	con.end(function(err) {
	  console.log("connection ended");
	  // The connection is terminated gracefully
	  // Ensures all previously enqueued queries are still
	  // before sending a COM_QUIT packet to the MySQL server.
	});


app.get('/',function(req,res){
	res.send("Welcome to the Grimmie API");
});

//Endpoint to create a new user with the FB ID and token recieved. There are separate endpoints to update instruments and other data.
app.post('/new/user',function(req,res){
	var fb_id = req.query.fb_id;
	var fb_token = req.query.fb_token;
	var name = req.query.name;
	var description = req.query.description;
	var country = req.query.country;
	console.log(fb_token+fb_id+name+description+country);
});

//Endpoint to update the latitude and longitude of a user
app.post('/set/location',function(req,res){
	var lat = req.params.lat;
	var lon = req.params.lon;
	console.log(lat+lon);
});

//Endpoint to update the instruments, genre and influences of a user
app.post('/set/profile',function(req,res){
	var instrument1 = req.params.instrument1;
	var instrument2 = req.params.instrument2;
	var instrument3 = req.params.instrument3;
	var genre1 = req.params.genre1;
	var genre2 = req.params.genre2;
	var genre3 = req.params.genre3;
	var influences = req.params.influences;
	console.log(instrument1+instrument2+instrument3);
	console.log(genre1+genre2+genre3);
	console.log(influences);
});

app.listen(5000,function(){
	console.log("Magic happening on port 5000");
})