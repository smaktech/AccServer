const express = require("express");
const Answer = require("../../models/createAnswer");
const router = express.Router();
const upload = require("../../middlewares/multer");
const AnswerGET = require("./AnswerGet");



router.post("/createAnswer", upload.single("image"), async (req, res) => {
  try {
    const ansObj = req.body;

    // console.log('backend request');
    console.log(req.body); 
    const ans = new Answer(ansObj);

    await ans.save();
   } catch (error) {console.log(error)}


  });
  //Update
  router.patch("/editAnswer/:ansid", async (req, res) => {
    const updateObject = req.body;
    const updates = Object.keys(req.body);
    const allowableUpdates = ["hint", "type","marks","answer","ansid"];
    const isValidUpdate = updates.every((update) =>
      allowableUpdates.includes(update)
    );
    if (!isValidUpdate)
      return res.status(400).json({ error: "Invalid Update." });
    try {
      const ansObj = await Answer.findOneAndUpdate({ _id: req.params.ansid },
        updateObject,
        { runValidators: true, new: true }
      );  
      console.log('Update backend request',ansObj);
      console.log(req.body); 
      const ans = new Answer(ansObj);
      await ans.save();
      res.status(200).json({
        status: true,
        message: "Updated Successfully",
        ans: ans,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        error: "Update Validator Failed",
      });
     } 
    }
  );

// router.get("/getAnswer", async (req, res) => {
//   try {
//     console.log('Request from Answer API');
//     res.status(200).json({ status: "Request Success." });

//    } catch (error) {console.log(error)}

// });
	
 



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

router.use(AnswerGET);

module.exports = router;