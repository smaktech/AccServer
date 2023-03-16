const express = require("express");
const Question = require("../../models/createQuestion");
const router = express.Router();
const upload = require("../../middlewares/multer");
const questionGET = require("./QuestionGet");



router.post("/createQuestion", upload.single("media"), async (req, res) => {
  try {
    const quesObj = req.body;
    if (req.file) {
      quesObj.media = req.file.filename;
    }
    const ques = new Question(quesObj);
    console.log('backend request From Question table',quesObj);
    // console.log(req.body);
    

    if (!ques) {
      // if board is not created
      console.log('Question is not created');
    } else {
      await ques.save();
      console.log('Question Table _ID' ,ques._id);
      return res.status(200).json( ques._id );
    }
    

    
   } catch (error) {console.log(error)}

});
	


router.patch(
  "/editBoard/:boardId",
//   upload.single("image"),
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

router.use(questionGET);

module.exports = router;