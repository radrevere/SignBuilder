
require('babel-register')({presets:['react']});
var signbuilder = require('./appjs/signbuilder');
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json({type:"*/*"}));
app.use(bodyParser.urlencoded({ extended: true }));
//app.set('json spaces', 40);

var con = mysql.createPool({
	connectionLimit: 50,
  host: "localhost",
  user: "root",
  password: "",
  database: "signdb"
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected to mysql");
// });

function isEmpty(obj)
{
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
				return false;
	}
	return true;
}

app.get('/autoapp.htm', function(req, res) {
	res.sendFile(__dirname + "/autoapp.htm");
});
app.use('/js', express.static('js'));

app.get('/commonarrays', function(req,res){
	console.log("commonarrays hit");
	res.end(signbuilder.GetArrays());
});

app.get('/svgPreview', function(req,res){
	console.log("preview requested");
	// being sent an autosign object
	var index = req.query.sizeIdx;
	var autosign = JSON.parse(req.query.autosign);
	var result = signbuilder.GetAutoSVG(autosign,index);
	res.end(result);
});

app.get('/signList',function(req,res){
	console.log("getting sign list");
	res.end(signbuilder.GetSignList());
});

app.get('/loadSign',function(req,res){
	console.log("load sign hit");
	var id = req.query.id;
	con.query("SELECT data FROM autosign WHERE id=" + id + ";",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        for(var i in result)
        {
			res.end( result[i].data);
			break;
        }
    });
});

app.post('/saveSign', function(req,res){
	console.log("saving sign");
	if(!req.body || isEmpty(req.body))
	{
		console.log("Request body not found");
		res.end("-1");
		return;
	}
	signbuilder.SaveSign(req.body, con,res);
	//res.end();
});


var server = app.listen(8085,function(){
	var host = server.address().address;
	var port = server.address().port;
	signbuilder.LoadCommonArrays(con);
	signbuilder.LoadSymbols(con);
	signbuilder.LoadCategories(con);
	console.log("sign server listening at http://%s:%s", host, port);
});

/*
for debugging json parsing
arSymbols = JSON.parse(req.responseText,(key,value)=>{
						console.log("key=" + key + "val=" + value);
						return value;});
*/