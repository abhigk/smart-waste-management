/*var obj =
{
  name: 'jatin'
};

var stringObj = JSON.stringify(obj);
//console.log(typeof stringObj);
//console.log(stringObj);

var personstring = '{"name": "jatin", "age":25}';

var person = JSON.parse(personstring);
//console.log(typeof person);
//console.log(person);
*/

const fs = require('fs');

var originalNote =
{
  title: 'Secrets',
  body: 'secrets of jatin'
};

var originalNoteString = JSON.stringify(originalNote);
fs.writeFileSync('notes.json', originalNoteString);

var noteString = fs.readFileSync('notes.json');
var noteObject = JSON.parse(noteString);

//console.log(typeof noteObject);
//console.log(noteObject.body);
