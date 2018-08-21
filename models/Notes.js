const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NotesSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    notes: Array,
    last_id: { type: Number, default: 0 }
});

NotesSchema.methods.addNote = function(content,cb) {
  this.notes.push({
    id: ++this.last_id,
    content: content
  });
  this.save(cb);
};

NotesSchema.methods.delNote = function(id,cb) {
  notes = this.notes;
  notes.forEach(function(note,index){
    if(note.id == id){
      notes.splice(index,1);
    }
  });
  //this.markModified("notes");
  this.save(cb);
};

NotesSchema.methods.updNote = function(id,content,cb) {
  notes = this.notes;
  notes.forEach(function(note,index){
    if(note.id == id){
      notes[index].content = content;
    }
  });
  this.markModified("notes");
  this.save(cb);
};

var Notes = mongoose.model('Notes', NotesSchema);

module.exports = Notes;
