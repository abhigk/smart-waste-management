
//Make a connection to Mongo db client

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err, db) =>
{
  if(err)
  {
    return //console.log('Unable to connect to the Mongo database server');
  }
  //console.log('Connected to MongoDB server');

  // Delete many documents

  /* db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result) => {
    //console.log(result);
  }); */

  // Delete insertOne
/*
  db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
    //console.log(result);
  }); */

  //find one and delete

  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //console.log(result);
  });


  //db.close();
});
