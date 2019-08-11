var app = require("express")();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serviceAccount = require('./keys.json');
var firebase = require("firebase");
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var nodemailer = require('nodemailer');
var configuration = require("./configuration.js");
var message = require("./message.js");

var config = {                                          //Setting up database
    apiKey: "AIzaSyARk5k9jBvqHHjniavl08r84ReHjYPBSYc",
    authDomain: "data-ccd0e.firebaseapp.com",
    databaseURL: "https://data-ccd0e.firebaseio.com",
    projectId: "data-ccd0e",
    storageBucket: "data-ccd0e.appspot.com",
    messagingSenderId: "262459432768"
  };

 firebase.initializeApp(config);              //Initializing database
 var database = firebase.database();
 var bin = database.ref("binMetaData");       //Connecting database which has bin data/information
 var users = database.ref("users");           //Connecting database which has users data information
 var address = process.argv[2];
 var user = database.ref("users");
 var readBin = database.ref("binReadings");
 var location = database.ref("locations");
 var notificationUsers = database.ref("notificationUser");
 var notifications = database.ref("notifications");


 app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });
 io.origins('*:*');


 app.use(morgan('dev'));                                         // log every request to the console
 app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
 app.use(bodyParser.json());


//Method that creates the transport and takes of the user who sends the email
 var smtpTransport = nodemailer.createTransport({
  service: configuration.getService(),
  auth: {
    user: configuration.getUser(),
    pass: configuration.getPassword()
  }
});

var msg = {
  from: message.getFrom(),
  subject: message.getSubject(),
  //text: message.getText(),
  status: message.getStatus()
}

app.post("/api/pushNotificationUser", function(req,res){
  var data = req.body;
  //console.log(data);
  notificationUser.push(data);
});

//database.ref(`notifications`).remove();


database.ref(`notifications`).remove();
////console.log(Date.parse("31 October 2018"));



////console.log("31 October 2018" > "1 November 2018");


/*
//API that stores the users in the notificationUser that will be passed by the admin
 app.post("/api/storeUser", function(req,res){
   notificationUser.once("value", function(snapshot){
     var input = req.body;
     var data = snapshot.val();
     if(data != null)
     {
        var keys = Object.keys(data);
     }
     var keysInput = Object.keys(input);
     var userSent = [];
     var isNotified;
     var count = 0;
     for(var i = 0; i < keysInput.length; i++)
     {
       var k = keysInput[i];
       userSent[i] = input[k];
       isNotified = input[k].notified;
       if(isNotified == "true")
       {
          notificationUser.push(userSent[i]);
       }
       else
       {
         for(var j = 0; j < keys.length; j++)
         {
           var l = keys[j];
           if(data[l].email == input[k].email)
           {
             database.ref(`notificationUser/${l}`).remove();
           }
         }
       }
     }
   });
 });
*/
