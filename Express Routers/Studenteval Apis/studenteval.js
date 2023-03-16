const express = require("express");
const Studenteval = require("../../models/createStudentEval");
const router = express.Router();
const upload = require("../../middlewares/multer");
// const AnswerGET = require("./AnswerGet");

// router.get("/getstudentevallist",  async (req, res) => {
//   console.log(" get StudentEvalData check server")
  
 // const StudentEvalData = await StudenEval.find().exec();
  //console.log('This is StudentEvalData data ', StudentEvalData);
  

//   res.status(200).json({
//     status: true,
//     results: 'success',
//   });
// });
router.get("/getstudentevallist",  async (req, res) => {
  console.log(" get StudentEvalData check server")
  
 const StudentEvalData = await Studenteval.find().exec();
  console.log('This is StudentEvalData data ', StudentEvalData);
  

  res.status(200).json({
    status: true,
    results: StudentEvalData,
  });
});

router.post("/createStudenEval", upload.single("image"), async (req, res) => {
  try {
    const stuObj = req.body;

    console.log('THIS IS FROM STUDENTEVAL', stuObj);
    console.log(req.body);
    const stu = new Studenteval(stuObj);

    await stu.save();
    console.log('StudenEval _ID',stu._id);
    return res.status(200).json( stu._id );

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

router.use(Studenteval);

module.exports = router;