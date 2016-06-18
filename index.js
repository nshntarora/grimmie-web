var express = require('express');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
var fileUpload = require('express-fileupload');
var app = express();

app.use(fileUpload());

app.use(bodyParser());

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



function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


var responseObject = {
	status: 200,
	text: "success",
	errorcode: ""
}


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
		res.send(responseObject);
	}
	else{
		responseObject.status = 400;
		responseObject.text = "failure"
		responseObject.errorcode = "ERR01"
		res.send(responseObject);
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
		responseObject.status = 400;
		responseObject.text = "failure"
		responseObject.errorcode = "ERR01"
		res.send(responseObject);
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



/*

Endpoint to upload a new song to user profile
change the directory of upload to the directory we want the files on at the server
Also, change permissions for the directory so that anyone could listen to the songs
For the request remember to set the encoding header to multipart/form-data
This endpoint uploads one song.

The request body should contain the file with param name songFile, the id of the
user in param fb_id and the name of the file in the param filename

*/

app.post('/new/song', function(req, res) {
    var songFile;
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    songFile = req.files.songFile;
    var rString = randomString(7, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    songFile.mv('/home/nishant/grimmie/'+req.body.fb_id+rString+'.mp3', function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
        	var song  = { 
					  user_id: req.body.fb_id,
					  label: req.body.filename,
					  href: "file:///home/nishant/grimmie/"+req.body.fb_id+rString+".mp3",
					  created_at: moment().format('YYYY-MM-DD HH:mm:ss')
			    };
			console.log(song);
			con.query('INSERT INTO songs SET ?', song , function (err, result) {
				if(err){
					console.log(err);
				}
			});
            res.send('File uploaded!');
        }
    });
});


app.listen(5000,function(){
	console.log("Magic happening on port 5000");
})