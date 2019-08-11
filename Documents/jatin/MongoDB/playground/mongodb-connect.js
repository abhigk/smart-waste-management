
//Make a connection to the mongo DB client

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err, db) =>
{
  if(err)
  {
    return //console.log('Unable to connect to the Mongo database server');
  }
  //console.log('Connected to MongoDB server');

/*
db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false,
    gender: 'Male'
  }, (err, result) => {
    if(err)
    {
      return //console.log('Unable to insert todo', err);
    }

    //console.log(JSON.stringify(result.ops))

  }); */

  //To insert records into the collection

  db.collection('Users').insertOne({
    Name: 'Jatin Mittal',
    Age: 24,
    Location: 'Melbourne'
  }, (err, result) => {
    if(err)
    {
      return //console.log('Unable to insert users', err);
    }

    //console.log(JSON.stringify(result.ops));

  });

  db.close();
});
