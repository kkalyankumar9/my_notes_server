const express = require("express");
const { auth } = require("../middleware/auth");
const { NotesModel } = require("../models/notesModel");
const notesRoutes = express.Router();

notesRoutes.use(auth);

notesRoutes.get("/", async (req, res) => {
  try {
    const note = await NotesModel.find({ userID: req.body.userID });
    res.status(200).send(note);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

notesRoutes.post("/create", async (req, res) => {
  try {
    const data = new NotesModel(req.body);
    await data.save();
    res.status(200).send({ msg: "New User has been created", data: data });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

notesRoutes.patch("/update/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const notes = await NotesModel.findOne({ _id: id });
    if (notes.userID !== req.body.userID) {
      res.status(400).send({ err: "Not Authorized" });
    } else {
      await NotesModel.findByIdAndUpdate({ _id: id }, req.body);
      res.status(200).send({ msg: `Notes having id ${id} is updated ` });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});
notesRoutes.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const notes = await NotesModel.findOne({ _id: id });
    if (notes.userID !== req.body.userID) {
      res.status(400).send({ err: "Not Authorized" });
    } else {
      await NotesModel.findByIdAndDelete({ _id: id });
      res.status(200).send({ msg: `Notes having id ${id} is Deleted ` });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = { notesRoutes };
