var express = require('express');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
var fileUpload = require('express-fileupload');
var app = express();

app.use(fileUpload());

app.use(bodyParser());

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
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
	con.query('SELECT * FROM `users` WHERE `fb_id` = ?', ['121'], function (error, results, fields) {
		console.log(results);
		res.send(results[0]);
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
	if(req.body.fb_id && req.body.fb_token && req.body.name){
		con.query('INSERT INTO users SET ?', user , function (err, result) {
		});
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
	var user  = { 				
					  lat: req.body.lat,
					  lon: req.body.lon,					  
					  updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
			    };
	if(req.body.lat && req.body.lon){
		con.query('UPDATE users  SET ?  WHERE `fb_id` =  '+ req.body.fb_id , user , function (err, result) {
		});
		res.send(responseObject);
	}
	else {
		responseObject.status = 400;
		responseObject.text = "failure"
		responseObject.errorcode = "ERR01"
		res.send(responseObject);
	}
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
    songFile.mv('/home/grimmie/uploads/songs/'+req.body.fb_id+rString+'.mp3', function(err) {
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

app.post('/delete/user',function(req,res){
	var user = { activated: 0 };
	con.query('UPDATE users  SET ?  WHERE `fb_id` =  '+ req.body.fb_id , user , function (err, result) {
	});
	res.send(responseObject);
})


app.post('/swipe/right',function(req,res){


	con.query("SELECT * FROM right_swipes WHERE liked_id = "+req.query.current_liked_id+" AND liker_id = " + req.query.current_liker_id , function (error, results, fields) {
			if(results)
			{
				console.log("Match!");
				res.send("Match!")
			}
			else
			{
				console.log("Not yet matched!");
				res.send("Not yet matched!");
			}
	});
})

app.post('/swipe/left',function(req,res){

	var rejection = {
						disliker :req.body.disliker,
						disliked : req.body.disliked
					}

	con.query('INSERT INTO rejections SET ?', rejection , function (err, result) {
	});
	res.send("Disliked!");
	console.log(rejection);
	console.log("Disliked!");
	
})


app.get('/cards/fetch', function(req,res){

	
	//console.log(req.query.fb_id);
	con.query("SELECT disliked FROM rejections WHERE disliker = ? ", req.query.fb_id  , function (error, disliked, fields) {
		DislikedArrString = JSON.stringify(disliked);
		var disliked_arr = JSON.parse(DislikedArrString);
		var arr = [];
		for(i=0;i<disliked_arr.length;i++)
		{
			arr[i] = disliked_arr[i]['disliked'];
		}

		
		
		con.query("SELECT liked_id FROM right_swipes WHERE liker_id = ? ", req.query.fb_id  , function (error, liked, fields) {

			LikedArrString = JSON.stringify(liked);
			var liked_arr = JSON.parse(LikedArrString);
			console.log(liked_arr);
			
			var x=0;
				for(i=disliked_arr.length;i<disliked_arr.length+liked_arr.length;i++)
				{
					arr[i] = liked_arr[x++]['liked_id'];
				}
				con.query("SELECT * FROM users WHERE fb_id NOT IN ("+arr+")", function (error, results, fields) {
		     	shuffle(results);
				console.log(results);		
				res.send(results);
				});
			
		});		
	});

})

app.get('/checkuser', function(req,res){
	con.query('SELECT * FROM `users` WHERE `fb_id` = ?', req.query.fb_id , function (error, results, fields) {
	if(results.length <= 0)
    {
    	console.log("Not Registered");
		res.send({status: 0});
	}
	else
	{	console.log("Registered!");
		res.send({status: 1});
	}
});
})

app.listen(5000,function(){
	console.log("Magic happening on port 5000");
});
