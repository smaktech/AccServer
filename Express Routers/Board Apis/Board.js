const express = require("express");
const upload = require("../../middlewares/multer");
const Board = require("../../models/createBoard");
const router = express.Router();
const boardGet = require("./BoardGet");

// Create Board
router.post("/createBoard", upload.single("image"), async (req, res) => {
  try {
    const boardObj = req.body;
    if (req.file) {
      boardObj.image = req.file.filename;
    }
    const board = new Board(boardObj);
    console.log("this is from board image",boardObj);

    if (!board) {
      // if board is not created
      res.status(500).json({
        status: false,
        message: "Board is not Created",
      });
    } else {
      //if board is created
      await board.save();
      res.status(200).json({
        status: true,
        message: "Board created Successfull",
        board: board,
      });
    }
  } catch (error) {}
});

router.patch(
  "/editBoard/:boardId",
  upload.single("image"),
  async (req, res) => {
    // Checking if updates are valid
    const updateObject = req.body;
    const updates = Object.keys(req.body);
    const allowableUpdates = ["name", "status"];
    const isValidUpdate = updates.every((update) =>
      allowableUpdates.includes(update)
    );
    if (!isValidUpdate)
      return res.status(400).json({ error: "Invalid Update." });

    if (req.file) {
      updateObject.image = req.file.filename;
    }

    // Update Board
    try {
      const board = await Board.findOneAndUpdate(
        { _id: req.params.boardId },
        updateObject,
        { runValidators: true, new: true }
      );

      res.status(200).json({
        status: true,
        message: "Edited Successfully",
        board: board,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        error: "Update Validator Failed",
      });
    }
  }
);

router.delete("/deleteBoardById/:boardId", async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.boardId,
    });
    if (!board) {
      res.status(404).json({
        status: false,
        message: "Board Not Found",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Board has been deleted.",
        board: board,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error,
    });
  }
});

// this will delete all the documents of this model. Use it consciously.
router.delete("/deleteAllX", async (req, res) => {
  try {
    Board.deleteMany({}, (error) => {
      if (error) {
        res.status(500).json({
          status: false,
          error: error,
        });
      }
      res.status(201).json({
        status: true,
        message: "all Boards deleted successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

router.use(boardGet);

module.exports = router;
