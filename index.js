var express = require('express');
var bodyParser = require('body-parser')
var mysql = require("mysql");
var moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
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

	/*con.end(function(err) {
	  console.log("connection ended");
	  // The connection is terminated gracefully
	  // Ensures all previously enqueued queries are still
	  // before sending a COM_QUIT packet to the MySQL server.
	}); */



//Remember to set Content-Type: application/x-www-form-urlencoded for the POST request. Pleeeease!


app.get('/',function(req,res){
	con.query('SELECT * FROM `users` WHERE `fb_id` = ?', ['121'], function (error, results, fields) {
		console.log(results);
		res.send(results);
  // error will be an Error if one occurred during the query 
  // results will contain the results of the query 
  // fields will contain information about the returned results fields (if any) 
});
//	res.send("Welcome to the Grimmie API");
});

//Endpoint to create a new user with the FB ID and token recieved. There are separate endpoints to update instruments and other data.
//Remember to set Content-Type: application/x-www-form-urlencoded for the POST request. Pleeeease!
app.post('/new/user',function(req,res){

	var user  = { 
					  fb_id: req.body.fb_id ,
					  fb_token: req.body.fb_token,
					  name:req.body.name,
					  description:req.body.description,
					  country:req.body.country,
					  lat: req.body.lat,
					  lon: req.body.lon,
					  instrument1: req.body.instrument1,
					  genre1: req.body.genre1,
					  influences: req.body.influences,
					  created_at: moment().format('YYYY-MM-DD HH:mm:ss')
			    };

	con.query('INSERT INTO users SET ?', user , function (err, result) {
	});
	res.send("User created!");
	console.log(user);
	console.log("User Created!");
});

//Endpoint to update the latitude and longitude of a user
app.post('/set/location',function(req,res){

	var user  = { 				
					  lat: req.body.lat,
					  lon: req.body.lon,					  
					  updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
			    };

	con.query('UPDATE users  SET ?  WHERE `fb_id` =  '+ req.body.fb_id , user , function (err, result) {
	});
	res.send("User updated!");
	console.log(user);
	console.log("User Updated!");
    
});

//Endpoint to update the instruments, genre and influences of a user
app.post('/set/profile',function(req,res){
	var user  = { 			
					  description:req.body.description,	
					  instrument1: req.body.instrument1,
				      instrument2: req.body.instrument2,
					  instrument3 : req.body.instrument3,
					  genre1 : req.body.genre1,
				 	  genre2 : req.body.genre2,
			   	  	  genre3 : req.body.genre3,
					  influences : req.body.influences,
					  lat: req.body.lat,
					  lon: req.body.lon,					  
					  updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
			    };
    con.query('UPDATE users  SET ?  WHERE `fb_id` =  '+ req.body.fb_id , user , function (err, result) {
	});
	res.send("User updated!");
	console.log(user);
	console.log("User Updated!");
});

app.post('/delete/user',function(req,res){
	var user = { activated: 0 };
	 con.query('UPDATE users  SET ?  WHERE `fb_id` =  '+ req.body.fb_id , user , function (err, result) {
	});
	res.send("User deleted!");
	console.log(user);
	console.log("User deleted!");


})

app.listen(5000,function(){
	console.log("Magic happening on port 5000");
})