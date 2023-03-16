const router = require("express").Router();
const UserCourse = require("../../models/UserCourse");
const UserExam = require("../../models/UserExam");

router.get("/:userID", async (req, res) => {
  const { userID } = req.params;
  const { date } = req.query;
  try {
    const visitedCourses = await UserCourse.find({
      userID,
      updatedAt: {
        $gt: new Date(new Date(date).setHours(00, 00, 01)),
        $lt: new Date(new Date(date).setHours(23, 59, 59)),
      },
    });
    const purchasedCourses = await UserCourse.find({
      userID,
      createdAt: {
        $gt: new Date(new Date(date).setHours(00, 00, 01)),
        $lt: new Date(new Date(date).setHours(23, 59, 59)),
      },
    });
    const takenExams = await UserExam.find({
      userID,
      createdAt: {
        $gt: new Date(new Date(date).setHours(00, 00, 01)),
        $lt: new Date(new Date(date).setHours(23, 59, 59)),
      },
    });
    res.status(200).json({
      status: true,
      data: { visitedCourses, purchasedCourses, takenExams },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
