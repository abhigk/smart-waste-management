
//Make a connection to Mongo db client

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err, db) =>
{
  if(err)
  {
    return //console.log('Unable to connect to the Mongo database server');
  }
  //console.log('Connected to MongoDB server');


// TO find/get/select records from the collection (find them all in one go)

  db.collection('Todos').find().toArray().then ((docs) => {
    //console.log('Todos');
    //console.log(JSON.stringify(docs, undefined, 2));
  },(err) => {
    //console.log('Unable to fetch todos', err);
  });


//To count the number of items in the collection
/*db.collection('Todos').find().count().then ((count) => {
    //console.log('Todos Count' , count);
  },(err) => {
    //console.log('Unable to fetch todos', err);
  });

  //db.close();
});  */

//To find/select the element in the collection by attribute (Filter)
db.collection('Users').find({Name: 'Andrew'}).toArray().then ((docs) => {
  //console.log('Users');
  //console.log(JSON.stringify(docs, undefined, 2));
}, (err) => {
    //console.log('Unable to find the record andrew', err);
  });
});
