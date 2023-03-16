const express = require("express");
const SubBoard = require("../../models/createSubBoard");
const upload = require("../../middlewares/multer");
const router = express.Router();
const subBoardGet = require("./SubBoardGet");

// Create Board
router.post(
  "/createSubBoard/:boardID",
  upload.single("image"),
  async (req, res) => {
    try {
      const subBoardObj = req.body;
      if (req.file) {
        subBoardObj.image = req.file.filename;
      }
      const subBoard = new SubBoard({
        ...subBoardObj,
        boardID: req.params.boardID,
      });

      if (!subBoard) {
        // if board is not created
        res.status(500).json({
          status: false,
          message: "Board is not Created",
        });
      } else {
        //if board is created
        await subBoard.save();
        res.status(200).json({
          status: true,
          message: "Board created Successfull",
          subBoard: subBoard,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
);

router.patch(
  "/editSubBoard/:subBoardID",
  upload.single("image"),
  async (req, res) => {
    const updateObj = req.body;
    // Checking if updates are valid
    const updates = Object.keys(req.body);
    const allowableUpdates = ["name", "status"];
    const isValidUpdate = updates.every((update) =>
      allowableUpdates.includes(update)
    );
    if (!isValidUpdate)
      return res.status(400).json({ error: "Invalid Update." });
    if (req.file) {
      updateObj.image = req.file.filename;
    }
    // Update Board
    try {
      const subBoard = await SubBoard.findOneAndUpdate(
        { _id: req.params.subBoardID },
        updateObj,
        { runValidators: true, new: true }
      );

      res.status(200).json({
        status: true,
        message: "Edited Successfully",
        subBoard: subBoard,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        error: "Update Validator Failed",
      });
    }
  }
);

router.delete("/deleteSubBoardById/:subBoardID", async (req, res) => {
  try {
    const subBoard = await SubBoard.findOneAndDelete({
      _id: req.params.subBoardID,
    });
    if (!subBoard) {
      res.status(404).json({
        status: false,
        message: "Sub Board Not Found",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Board has been deleted.",
        subBoard: subBoard,
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
    SubBoard.deleteMany({}, (error) => {
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

router.use(subBoardGet);

module.exports = router;
