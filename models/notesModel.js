const mongoose = require("mongoose");
const notesSchema = mongoose.Schema({
  userID: String,
  user: String,
  title: String,
  body: String,
});

const NotesModel = new mongoose.model("note", notesSchema);
module.exports = { NotesModel };
