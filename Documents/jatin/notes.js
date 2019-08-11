
const fs = require('fs');

var fetchNote = () =>
{
  try
  {
    var notesString = fs.readFileSync('notes-data.json');
    return JSON.parse(notesString);

  }
  catch (e)
  {
    return[];
  }
};

var saveNote = (notes) =>
{
  fs.writeFileSync('notes-data.json', JSON.stringify(notes));
};

var addNote = (title, body) =>
{
  var notes = fetchNote();
  var note =
  {
    title,
    body
  };

  var duplicateNotes = notes.filter((note) => note.title === title);

  if(duplicateNotes.length === 0)
  {
    notes.push(note);
    saveNote(notes);
    return note
  }
};

var getAll = () =>
{
  return fetchNote();

};

var getNode = (title) =>
{
  var notes = fetchNote();
  var filteredNotes = notes.filter((note) => note.title === title);
  return filteredNotes[0];
};

var removeNote = (title) =>
{
  var notes = fetchNote();
  var filteredNotes = notes.filter((note) => note.title !== title);
  saveNote(filteredNotes);

  return notes.length !== filteredNotes.length;

};

var logNote = (note)  =>
{
  //console.log('-------');
  //console.log('title: ' + note.title);
  //console.log('body: ' + note.body);
};

module.exports =
{
  addNote, getAll, getNode, removeNote, logNote
};
