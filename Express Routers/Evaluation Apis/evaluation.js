const express = require("express");
const Evaluation = require("../../models/createEvaluation");
const router = express.Router();
const upload = require("../../middlewares/multer");
const evaluationGET = require("./EvaluationGet");



router.post("/createEvaluation", upload.single("image"), async (req, res) => {
  try {
    const evalObj = req.body;
   

    console.log('backend request');
    // console.log(req.body);
    const eval = new Evaluation(evalObj);
    


    await eval.save(); 
    console.log('Evaluation _ID',eval._id);
    return res.status(200).json( eval._id );
   
    
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

router.delete("/deleteEvaluationById/:board", async (req, res) => {
  try {
    const board = await board.findOneAndDelete({
      _id: req.params.board,
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

router.use(evaluationGET);

module.exports = router;
