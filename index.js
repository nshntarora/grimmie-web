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

	res.send("Connection works. Check console");
});

app.listen(5000,function(){
	console.log("Magic happening on port 5000");
})