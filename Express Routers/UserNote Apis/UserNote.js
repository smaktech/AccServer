const UserNote = require("../../models/UserNote");

const router = require("express").Router();

// get all the user's notes
router.get("/all/:userID", async (req, res) => {
  try {
    const notes = await UserNote.find({ userID: req.params.userID });
    if (!notes || !notes.length) {
      return res.status(404).json({
        status: false,
        message: "No note is found",
      });
    }
    res.status(200).json({
      status: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// create new note for user
router.post("/:userID", async (req, res) => {
  const { note } = req.body;
  const { userID } = req.params;
  try {
    const newNote = new UserNote({ userID, note });
    await newNote.save();

    res.status(201).json({
      status: true,
      note: newNote,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
// update note
router.patch("/update/:userID/:noteID", async (req, res) => {
  const { note } = req.body;
  const { userID, noteID } = req.params;
  try {
    const userNote = await UserNote.findOne({ _id: noteID, userID });
    if (!userNote) {
      throw new Error("No note found");
    }
    userNote.note = note;
    await userNote.save();

    res.status(201).json({
      status: true,
      note: userNote,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// get single user note
router.get("/:userID/:noteID", async (req, res) => {
  try {
    const note = await UserNote.findOne({
      _id: req.params.noteID,
      userID: req.params.userID,
    });
    if (!note) {
      return res.status(404).json({
        status: false,
        message: "Note is not found",
      });
    }
    res.status(200).json({
      status: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// get single user note
router.delete("/delete/:userID/:noteID", async (req, res) => {
  try {
    const note = await UserNote.findOneAndDelete({
      _id: req.params.noteID,
      userID: req.params.userID,
    });
    if (!note) {
      return res.status(404).json({
        status: false,
        message: "Note is not found",
      });
    }
    res.status(200).json({
      status: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
