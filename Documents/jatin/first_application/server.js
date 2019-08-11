var express = require('express');
var logger = require('morgan');

var app = express()    //Create instance of an express app

//For serving js and html in ejs
//ejs stands for embedded javascript
app.set('view engine', 'ejs');

//We want to send HTML,css,images and other static files
app.use(express.static('views'))


app.use(logger('dev'))


app.get('/', function(request, response)
{
  response.render('home.ejs');
})


app.listen(3000, function()
{
  //console.log('app running on port: 3000');
})
