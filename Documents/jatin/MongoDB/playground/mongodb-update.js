
//Make a connection to Mongo db client

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err, db) =>
{
  if(err)
  {
    return //console.log('Unable to connect to the Mongo database server');
  }
  //console.log('Connected to MongoDB server');


  //Find one and update

  

  //db.close();
});
