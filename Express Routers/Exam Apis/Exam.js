const Exam = require("../../models/Exam");
const UserExam = require("../../models/UserExam");
const upload = require("./../../middlewares/examUploadMulter");
const path = require("path");
const fs = require("fs");
const router = require("express").Router();
const decompress = require("decompress");

// post user exam result
// router.post("/postResults", async (req, res) => {
//   const newUserExam = new UserExam(req.body);

//   try {
//     const userExam = await newUserExam.save();

//     res.status(201).json({
//       status: true,
//       userExam,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

router.post("/:subTopicID", upload.single("exam"), async (req, res) => {
  const { name } = req.body;
  let file;

  try {
    let newExam;
    if (req.file) {
      file = await decompress(
        path.join(__dirname, "../../public", req.file.filename),
        path.join(__dirname, `../../public/exams/${name}`)
      );
    }
    if (file) {
      newExam = new Exam({
        subTopicID: req.params.subTopicID,
        link: `exams/${name}/dist/index.html`,
        name: req.body.name,
      });

      fs.unlink(
        path.join(__dirname, "../../public", req.file.filename),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    const exam = await newExam.save();
    console.log(exam);
    res.status(201).json({
      status: true,
      exam: exam,
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.patch("/:examID", upload.single("exam"), async (req, res) => {
  let file;
  const { name } = req.body;
  const updateQuery = {};
  if (req.body.name) {
    updateQuery.name = req.body.name;
  }
  if (req.body.subTopicID) {
    updateQuery.subTopicID = req.body.subTopicID;
  }
  try {
    if (req.file) {
      if (req.file) {
        file = await decompress(
          path.join(__dirname, "../../public", req.file.filename),
          path.join(__dirname, `../../public/exams/${name}`)
        );
        if (file) {
          updateQuery.link = `exams/${name}/dist/index.html`;
          fs.unlink(
            path.join(__dirname, "../../public", req.file.filename),
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      }
    }
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.examID },
      updateQuery,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: true,
      message: "update complete",
      exam: exam,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// get single exam by exam id
router.get("/:examID", async (req, res) => {
  const { examID } = req.params;
  try {
    const exam = await Exam.find({ examID });

    if (!exam || !exam.length) {
      return res.status(404).json({
        status: false,
        message: "No exam is found",
      });
    }

    res.status(200).json({
      status: true,
      exam,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// post result of user exam
router.post("/postResults", async (req, res) => {
  const {
    stID: subTopicID,
    examID,
    uID: userID,
    examData,
    exerciseData,
  } = req.body;
  try {
    const userExam = new UserExam({
      subTopicID,
      examID,
      userID,
      examData,
      exerciseData,
    });

    const userExamRes = await userExam.save();

    res.status(200).json({
      status: true,
      exam: userExamRes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// router.get("/");

module.exports = router;
