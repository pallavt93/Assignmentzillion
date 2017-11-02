var express = require('express');
var hostname = 'localhost';
var port  = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var morgan = require('morgan');




//data base config
var mongoose = require('mongoose');
var KeyWords = require('./models/searchinfo');
// Connection URL
var url = 'mongodb://localhost:27017/assignment';
//var url = 'mongodb://pallav:pallav123@ds243295.mlab.com:43295/assignmentzillion';

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});





var app =  express();
app.set('view engine','ejs');


app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));






var imageRouter = require("./routes/imageRouter");


app.use(express.static(__dirname + '/public'));
app.use('/scrape',imageRouter);



app.listen(port, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});