const express = require('express');

const app = express();
const firebase = require('firebase');

 var config = {
    apiKey: "AIzaSyARk5k9jBvqHHjniavl08r84ReHjYPBSYc",
    authDomain: "data-ccd0e.firebaseapp.com",
    databaseURL: "https://data-ccd0e.firebaseio.com",
    projectId: "data-ccd0e",
    storageBucket: "data-ccd0e.appspot.com",
    messagingSenderId: "262459432768"
  };

 firebase.initializeApp(config);
 var database = firebase.database();
 var ref = firebase.database().ref('binMetaData');


app.get('/api/bindata', (req, res) => {
  ref.once("value")
    .then(function(snapshot) {
      res.send(snapshot.val());
    });
});


app.listen(3000, () => {
  //console.log('started on port 3000');
});
