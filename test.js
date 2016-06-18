var express = require('express')
 
var app = express()
 
app.get('/notes', function(req, res) {
  res.json({notes: "This is your notebook. Edit this to start saving your notes!"})
})

app.post('/notes', function(req,res){
	var name = req.params.name;
})
 
app.listen(3000)