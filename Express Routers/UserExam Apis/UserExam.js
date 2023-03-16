const UserExam = require("../../models/UserExam");

const router = require("express").Router();

// get all user exams
router.get("/", async (req, res) => {
  try {
    const userExams = await UserExam.find({});

    if (!userExams.length) {
      return res.status(404).json({
        status: false,
        message: "No UserExam is found",
      });
    }

    res.status(200).json({
      status: true,
      userExams,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// get all user exams of a user
router.get("/:userID", async (req, res) => {
  try {
    const userExams = await UserExam.find({ userID: req.params.userID });

    if (!userExams.length) {
      return res.status(404).json({
        status: false,
        message: "No UserExam is found",
      });
    }

    res.status(200).json({
      status: true,
      userExams,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// get single user exams of a user
router.get("/:userID/:examID", async (req, res) => {
  try {
    const userExam = await UserExam.find({
      userID: req.params.userID,
      examID: req.params.examID,
    });

    if (!userExam.length) {
      return res.status(404).json({
        status: false,
        message: "No UserExam is found",
      });
    }

    res.status(200).json({
      status: true,
      userExams: userExam,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
