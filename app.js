var express = require("express");
var app = express();
// var bodyParser = require("body-parser");

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// app.use(bodyParser.urlencoded({extended: true}));

var indexRoute = require("./routes/index");

app.use("/", indexRoute);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("ClassesAtMac Server Started!!");
});