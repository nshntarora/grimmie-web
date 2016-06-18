var express = require('express');
var bodyParser = require('body-parser')
var mysql = require("mysql");

var app = express();

app.use(bodyParser());

var checkempty = function(){
}


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



//Remember to set Content-Type: application/x-www-form-urlencoded for the POST request. Pleeeease!


app.get('/',function(req,res){
	res.send("Welcome to the Grimmie API");
});

//Endpoint to create a new user with the FB ID and token recieved. There are separate endpoints to update instruments and other data.
//Remember to set Content-Type: application/x-www-form-urlencoded for the POST request. Pleeeease!
app.post('/new/user',function(req,res){
	var fb_id = req.body.fb_id;
	var fb_token = req.body.fb_token;
	var name = req.body.name;
	var description = req.body.description;
	var country = req.body.country;
	if(fb_id && fb_token && name && description && country){
		res.send(fb_token+fb_id+name+description+country);
		console.log(req.body);
	}
	else{
		res.send("One or more values are empty. Invalid request.");
	}
});

//Endpoint to update the latitude and longitude of a user
app.post('/set/location',function(req,res){
	var lat = req.body.lat;
	var lon = req.body.lon;
	if(lat && lon){
		console.log(lat+lon);	
	}
	else{
		res.send("One or more values are empty. Invalid request.");
	}
});

//Endpoint to update the instruments, genre and influences of a user
app.post('/set/profile',function(req,res){
	var instrument1 = req.body.instrument1;
	var instrument2 = req.body.instrument2;
	var instrument3 = req.body.instrument3;
	var genre1 = req.body.genre1;
	var genre2 = req.body.genre2;
	var genre3 = req.body.genre3;
	var influences = req.body.influences;
	console.log(instrument1+instrument2+instrument3);
	console.log(genre1+genre2+genre3);
	console.log(influences);
});

app.listen(5000,function(){
	console.log("Magic happening on port 5000");
})