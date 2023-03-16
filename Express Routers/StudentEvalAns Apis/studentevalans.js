const express = require("express");
const Studentevalans = require("../../models/createStdEvalAnswer");
const router = express.Router();
const upload = require("../../middlewares/multer");
const StudentevalansGET = require("./Studevalansget");



router.post("/createstudentevalans", upload.single("image"), async (req, res) => {
  try {
    const stuevalansObj = req.body;
    
    // 
    console.log(' this is stuevalansObj backend request', stuevalansObj);
    // console.log(req.body);
    const stuevalans = new Studentevalans(stuevalansObj);
    
    await stuevalans.save();
   } catch (error) {console.log(error)} 


  });


// router.get("/getAnswer", async (req, res) => {
//   try {
//     console.log('Request from Answer API');
//     res.status(200).json({ status: "Request Success." });

//    } catch (error) {console.log(error)}

// });
	
 

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

router.use(StudentevalansGET);

module.exports = router;