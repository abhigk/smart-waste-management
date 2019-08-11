var port = process.env.PORT || 8810;
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io').listen(server);


//var http = require('http').Server(app);
//var io = require('socket.io')(http);
var serviceAccount = require('./keys.json');
var firebase = require("firebase");
var morgan = require('morgan');
var bodyParser = require('body-parser');

var nodemailer = require('nodemailer');
var configuration = require("./configuration.js");
var message = require("./message.js");
var path = require('path');




io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){

    });
  socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});



// app.listen(port, () =>
// console.log(`listening on port ${port}!`)
// );

// http.listen(8080, function(){
// console.log('http listening on *:3001');
// });



var config = {                                          //Setting up database
    apiKey: "AIzaSyARk5k9jBvqHHjniavl08r84ReHjYPBSYc",
    authDomain: "data-ccd0e.firebaseapp.com",
    databaseURL: "https://data-ccd0e.firebaseio.com",
    projectId: "data-ccd0e",
    storageBucket: "data-ccd0e.appspot.com",
    messagingSenderId: "262459432768"
  };


app.use(express.static(__dirname + '/dist/'));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

 firebase.initializeApp(config);              //Initializing database
 var database = firebase.database();
 var bin = database.ref("binMetaData");       //Connecting database which has bin data/information
 var users = database.ref("users");           //Connecting database which has users data information
 var address = process.argv[2];
 var user = database.ref("users");
 var readBin = database.ref("binReading");
 var location = database.ref("locations");
 var notifications = database.ref("notifications");
 var notificationUser = database.ref("notificationUser");
 var admin = database.ref("admins");


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// io.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

 app.use(morgan('dev'));                                         // log every request to the console
 app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
 app.use(bodyParser.json());


//Method that creates the transport and takes of the user who sends the email
var smtpTransport = nodemailer.createTransport({
    host: configuration.getService(),
    secure: false, // TLS requires secureConnection to be false
    port: 587,
    auth: {
        user: configuration.getUser(),
        pass: configuration.getPassword()
    }
});

var msg = {
  from: message.getFrom(),
  subject: message.getSubject(),
  text: message.getText(),
  status: message.getStatus()
}

//Api for getting all the users
   app.get("/api/getUsers", function(req, res)
  {
   users.once("value")
   .then(function(snapshot){
        res.send(snapshot.val());
   });
 });


 //Validate the email if it is in the correct format
 function validateEmail(email)
  {
    var x = email;
    //console.log(x);
    var atpos = x.lastIndexOf('@');
    var dotpos = x.lastIndexOf(".");
    if (atpos < 1 || dotpos<atpos+2 || dotpos+2>=x.length)
     {
        throw new Error("Please enter a valid e-mail address");
     }
     return true;
 }

 //Creating the users
 app.post('/api/signUp', function(req, res)
  {
   var data = req.body;
   var email = req.body.email;
   ////console.log(data);
   var val = validateEmail(email);      //Validating email if it is in the proper format
   //console.log("val is: " + val);
   users.orderByChild('email').equalTo(req.body.email).once("value", snapshot => {  //Check if the email passed by the user already exists or not
    var value = snapshot.val();
    if (value == null && val == true)
    {
      users.push(data);     //Stores users who signed up
      res.status(200).json({message: "User successfully saved", result: true});
    }
    else
    {
        res.status(400).json({message: "User already exists", result: false});
    }
  });
});

//Login method which checks the email id and the pass values
app.post('/api/login', function(req, res)
 {
  var data = req.body;        //Takes data that will passed by the user while login
  var email = req.body.email;
  var pass = req.body.password;
  var emailCheck = false;
  var passCheck = false;
  ////console.log(data);

  users.once("value",snapshot => {
   var data = snapshot.val();
   var keys = Object.keys(data);
   for(var i = 0; i < keys.length; i++)
   {
     var k =  keys[i];
     if(data[k].email === email)     //Checking if email matches the email entered
     {
       //console.log('inside email check condition');
       emailCheck = true;
     }

     if(data[k].password === pass)    //Checking if password matches the pass entered
     {
       //console.log('inside password check condition');
       passCheck = true;
     }
   }

   if(emailCheck && passCheck)    //If both checks pass, then send status (200) OK
   {
     res.status(200).json({message: "Success: User logged in.", result: true})
   }
   else
   {
     res.status(400).json({message: "failed: Please enter your email and password again.", result: false})    //If does not pass then give bad status
   }

});
});


//Getting all the bin data and the filtered data according to the location
 app.get("/api/bins/data", function(req, res)
  {
    var x = Object.keys(req.query).length;      //If user selects all the location, The whole snapshot will be displayed
    var area = req.query.area;
    if(x == 0)
    {
      bin.once("value").then(function(snapshot)
         {
          res.send(snapshot.val());
        });
    }
    else                  //If user selects particular location, then the data will be filtered.
      {
        bin.orderByChild('location_precinct').equalTo(area).on("value", function(snapshot) {
        res.send(snapshot.val());
      });
    }
  });

  //read all the data from the bin
  app.get("/api/allBins", function(req,res){
      readBin.once("value")
      .then(function(snapshot)
       {
        res.send(snapshot.val());
      });
  });

  //API that gets all the locations stored
  app.get("/api/getLocations", function(req, res)
   {
    location.once("value")
    .then(function(snapshot)
     {
      res.send(snapshot.val());
    });
  });

  app.get("/api/getAdmins", function(req, res)
   {
    admin.once("value")
    .then(function(snapshot)
     {
      res.send(snapshot.val());
    });
  });

   app.get("/api/getLatestData", function(req, res){
     readBin.once("value", function(snapshot) {
      var data = snapshot.val();
      var keys = Object.keys(data);
      var binData = [];
      var binIds = [];
      for(var i = 0; i < keys.length; i++)
      {
         var x =  keys[i];
         binData[i] = data[x];
      }

      for(var j = 0; j < keys.length; j++)     //taking all the bins ids and storing
      {
         var y =  keys[j];
         binIds[j] = data[y].payload_fields.hardware_id;
      }

        const unique = (value, index, self) => {
        return self.indexOf(value) === index;
      }
       const uniqueIds = binIds.filter(unique);      //Taking unique binIds
       ////console.log("Unique ids: " + uniqueIds);

       var count = 0;
       var bin = [];

       for(var i = 0; i < uniqueIds.length; i++)
       {
         var first = 0;
         for(var k = 0; k < binData.length; k++)
         {
           if(binData[k].payload_fields.hardware_id == uniqueIds[i])
           {
             if(first == 0)
             {
               biggest = binData[k];
               first = 1;
             }
             else if(Date.parse(binData[k].metadata.time) >= Date.parse(biggest.metadata.time))
             {
               biggest = binData[k];      //Get the latest record
             }
           }
         }
         bin[i] = biggest;
       }
      res.send(bin);
    });
});


//Read latest bin data real-time

readBin.on("value", function(snapshot) {
 var data = snapshot.val();
 var keys = Object.keys(data);
 var binData = [];
 var binIds = [];
 for(var i = 0; i < keys.length; i++)
 {
    var x =  keys[i];
    binData[i] = data[x];
 }

 for(var j = 0; j < keys.length; j++)     //taking all the bins ids and storing
 {
    var y =  keys[j];
    binIds[j] = data[y].payload_fields.hardware_id;
 }

   const unique = (value, index, self) => {
   return self.indexOf(value) === index;
 }
  const uniqueIds = binIds.filter(unique);      //Taking unique binIds
  ////console.log("Unique ids: " + uniqueIds);

  var count = 0;
  var bin = [];

  for(var i = 0; i < uniqueIds.length; i++)
  {
    var first = 0;
    for(var k = 0; k < binData.length; k++)
    {
      if(binData[k].payload_fields.hardware_id == uniqueIds[i])
      {
        if(first == 0)
        {
          biggest = binData[k];
          first = 1;
        }
        else if(Date.parse(binData[k].metadata.time) >= Date.parse(biggest.metadata.time))
        {
          biggest = binData[k];     //Get the latest record
        }
      }
    }
    bin[i] = biggest;

  }
    console.log('got new reading');
    io.emit('binReadings', bin );
});



//API that stores the users in the notificationUser that will be passed by the admin
 app.post("/api/storeUser", function(req,res){
   var data = req.body;
   database.ref('notificationUser').remove();
   database.ref().child('notificationUser').set(data);
   res.status(200).json({message: "Success: successfully stored the user", result: true});
 });


//Method for sending email and sending notification to the user (Real time)
readBin.once("value", function(snapshot) {
    database.ref('notifications').remove();
    var data = snapshot.val();
    if(data != null)
    {
        var keys = Object.keys(data);
        var binData = [];
        var binIds = [];
        var user = [];
        for(var i = 0; i < keys.length; i++)
        {
            var x =  keys[i];
            binData[i] = data[x];
        }

        for(var j = 0; j < keys.length; j++)     //taking all the bins ids and storing in binids array
        {
            var y =  keys[j];
            binIds[j] = data[y].payload_fields.hardware_id;
        }

        const unique = (value, index, self) => {
            return self.indexOf(value) === index;
        }
        const uniqueIds = binIds.filter(unique);      //Taking unique binIds

        var count = 0;
        var bin = [];
        var bins = [];

        for(var i = 0; i < uniqueIds.length; i++)
        {
            var first=0;
            for(var k = 0; k < binData.length; k++)
            {
                if(binData[k].payload_fields.hardware_id == uniqueIds[i])
                {
                    if(first==0)
                    {
                        biggest = binData[k];
                        first = 1;
                    }
                    else if(Date.parse(binData[k].metadata.time) >= Date.parse(biggest.metadata.time))
                    {
                        biggest = binData[k];
                    }
                }
            }
            bins[i] = biggest;
        }
        console.log(bins);
        notificationUser.once("value", function(snapshot){
            database.ref(`notifications`).remove();

            var data = snapshot.val();
            if(data != null)
            {
                //console.log(data);
                var keys = Object.keys(data);
                for(var i = 0; i < keys.length; i++)
                {
                    var k = keys[i];
                    var threshold = parseInt(data[k].threshold);
                    var email = data[k].email;

                    for(var j = 0; j < bins.length; j++)
                    {
                        var hardware_id = bins[j].payload_fields.hardware_id;
                        var level = bins[j].payload_fields.level;
                        var levelFilled = 120 - bins[j].payload_fields.level;
                        var percentFilled = Math.trunc((levelFilled*100)/120);

                        if(percentFilled >= threshold)
                        {
                            console.log('% filled',percentFilled,'level left',level,'levelfill',levelFilled,'threshold' , threshold, hardware_id, email);
                            msg.to = email;
                            msg.text = `This is to inform you that BIN ID ${hardware_id} is ${Math.trunc(percentFilled)}% filled`;

                            smtpTransport.sendMail(msg, function(err){
                                if(!err)
                                {
                                    console.log(`here BIN ID ${hardware_id} is ${percentFilled}% `);
                                    console.log('Sending to ' + to.email + ' success: ');
                                    console.log('here');
                                }
                                else {
                                    console.log(err);
                                    console.log('error sending email');
                                }
                            });
                            notifications.push({
                                email: email,
                                status: msg.status,
                                message: `BIN ${hardware_id} is ${percentFilled}% `
                            });
                        }
                    }
                }
            }
        });
    }
});


//start notifcation realtime and email
readBinChildAddedCount = 0;
let p = new Promise(function(res,rej){
    readBin.on("child_added",function(snapshot){
        //generate notification and send email
        //console.log("here");
        if(readBinChildAddedCount != 0) {
            //console.log("new aded");
            console.log(snapshot.val());
            let levelFilled = 120 - snapshot.val().payload_fields.level;
            let hardware_id = snapshot.val().payload_fields.hardware_id;

            // generate mail and notifcation
            let promiseToGetUsers =  new Promise(function(resolve, reject){
                notificationUser.once("value", function(snapshot){
                    resolve(snapshot.val());
                });
            });
            promiseToGetUsers.then(function(userData){
                let keys = Object.keys(userData);
                //console.log(keys);
                for(var i = 0 ; i < keys.length; i++){
                    let user = userData[keys[i]];
                    let threshold = (user.threshold*120)/100;

                    if(levelFilled >= threshold){

                        //send email and generate notification
                        console.log(user.threshold,threshold,levelFilled,hardware_id);
                        let percentFilled = Math.trunc((levelFilled*100)/120);
                        console.log('ravi wala',percentFilled);
                        //add notification
                        console.log('sending notification');
                        notifications.push({
                            email: user.email,
                            status: msg.status,
                            message: `bin ${hardware_id} is ${percentFilled}% `
                        });

                        //send email
                        msg.to = user.email;
                        msg.text = `This is to inform you that BIN ID ${hardware_id} is ${percentFilled}% filled`;
                        smtpTransport.sendMail(msg, function(err){
                            if(!err)
                            {
                                //console.log(`BIN ID ${id} has ${level}% space left`);
                                //console.log('Sending to ' + to.email + ' success: ');
                            }
                        });


                    }

                }
            });

        }

        //do changes
        res(snapshot.val());

    });

});
p.then(function(data){
    console.log('data');
    readBinChildAddedCount++;
});

//end notirealtime



//Api for getting the notifications
  app.get("/api/getNotifications", function(req,res){
    notifications.once("value", function(snapshot){
      var data = snapshot.val();
      res.send(data);
  });
});

app.get("/api/getnotifiedUsers", function(req,res){
  notificationUser.once("value", function(snapshot){
    var data = snapshot.val();
    res.send(data);
});
});



//Real time get notificationUser
  notifications.on("value", function(snapshot){
    var data = snapshot.val();
    //console.log(data);
    io.emit('notifications', data );
  });



app.post('/api/updateProfile', function(req, res)
 {
   var obj = req.body;
  var email = req.body.email;
  user.once("value", function(snapshot){
    var data = snapshot.val();
    var keys = Object.keys(data);
    for(var j = 0; j < keys.length; j++)
    {
      var k = keys[j];
      if(data[k].email == email)
      {
        database.ref(`users/${k}`).update(obj);
        res.status(200).json({message: "Success: Updated the profile", result: true});
      }
    }
  });
});



app.post('/api/readNotifications', function(req, res)
 {
  var id = req.body.id;
    notifications.once("value", function(snapshot){
    var data = snapshot.val();
    var keys = Object.keys(data);
    for(var i = 0; i < keys.length; i++)
    {
        var k = keys[i];
        if(k == id)
        {
          database.ref(`notifications/${k}/status`).set("read");
          res.status(200).json({message: "Success: set the status", result: true});
        }
    }
  });
});


//API for removing the notificationUser
app.post('/api/deleteNotifications', function(req, res)
 {
   var id = req.body.id;
   notifications.once("value", function(snapshot){
    var data = snapshot.val();
    var keys = Object.keys(data);
    for(var j = 0; j < keys.length; j++)
    {
      var k = keys[j];
      if(k == id)
      {
        database.ref(`notifications/${k}`).remove();
        res.status(200).json({message: "Success: deleted the notification", result: true});
      }
    }
  });
});

//Api to push the data in the bin reading for testing
app.post("/api/pushBinData", function(req,res){
  var data = req.body;
  //console.log(data);
  readBin.push(data);

});


//database.ref(`notificationUser`).remove();

//Api to push notification Users for testing
app.post("/api/pushNotificationUser", function(req,res){
  var data = req.body;
  //console.log(data);
  notificationUser.push(data);
});



