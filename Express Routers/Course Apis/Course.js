const express = require("express");
const upload = require("../../middlewares/multer");
const router = express.Router();

const { Course } = require("../../models/createCourse");
const UserCourse = require("../../models/UserCourse");
const courseGET = require("./CoursesGet");

//createCourse
router.post("/createCourse", upload.single("image"), async (req, res) => {
  try {
    const courseObj = req.body;
    if (req.file) {
      courseObj.image = req.file.filename;
    }
    const course = new Course(courseObj);
    if (!course) {
      res.status(500).json({
        status: false,
        message: "Create new course failed.",
      });
    } else {
      await course.save();
      res.status(200).json({
        status: true,
        message: "Course is created successfully.",
        course: course,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

// updates courses
router.patch(
  "/editCourse/:courseID",
  upload.single("image"),
  async (req, res) => {
    const updateQuery = {};

    // Checking if updates are valid
    const updates = Object.keys(req.body);
    const allowableUpdates = [
      "name",
      "subBoardID",
      "classesID",
      "subjectID",
      "topicIDs",
      "description",
      "status",
    ];

    updates.forEach((el) => {
      if (allowableUpdates.includes(el)) updateQuery[el] = req.body[el];
    });

    if (req.file) {
      updateQuery.image = req.file.filename;
    }

    try {
      const course = await Course.findOneAndUpdate(
        { _id: req.params.courseID },
        updateQuery,
        { runValidators: true, new: true }
      );

      if (!course) {
        res.status(400).json({
          status: false,
          message: "Could not upload",
        });
      }

      res.status(200).json({
        status: true,
        message: "Edited Successfully",
        course: course,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: "Update Validator Failed",
      });
    }
  }
);

router.patch("/addTopicToCourse/:courseID", async (req, res) => {
  const updateQuery = {};

  // Checking if updates are valid
  const updates = Object.keys(req.body);
  const allowableUpdates = ["topicIDs"];

  updates.forEach((el) => {
    if (allowableUpdates.includes(el));
  });

  try {
    const existingCourse = await Course.findOne({ _id: req.params.courseID });
    if (!existingCourse) {
      res.status(404).json({
        status: false,
        message: "Could not find the course with ID" + req.params.courseID,
      });
    }

    const topic = [...existingCourse.topicIDs, ...req.body.topicIDs];

    updateQuery["topicIDs"] = topic;

    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseID },
      updateQuery,
      { runValidators: true, new: true }
    );

    if (!course) {
      res.status(400).json({
        status: false,
        message: "Could not upload",
      });
    }

    res.status(200).json({
      status: true,
      message: "Edited Successfully",
      course: course,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Update Validator Failed",
    });
  }
});

// remove topic from the course
router.patch("/removeTopicFromCourse/:courseID", async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseID },
      { $pull: { topicIDs: req.query.topicID } },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: true,
      message: "topic removed",
      course: course,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Update Validator Failed",
    });
  }
});

// Delete single courses
router.delete("/deleteCourseById/:courseID", async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.courseID,
    });

    if (!course) {
      res.status(404).json({
        status: false,
        message: "Course Not Found",
      });
    } else {
      // if (course.courseVideoLink.linkType === "upload") {
      //   fs.unlink(course.courseVideoLink.linkString, (error) => {
      //     if (error) throw err;
      //     console.log("File Deleted");
      //   });
      // }

      await UserCourse.deleteMany({ courseID: req.params.courseID });

      res.status(200).json({
        status: true,
        message: "Course has been deleted.",
        course: course,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error,
    });
  }
});

// This route will delete full collection use it carefully
router.delete("/deleteAllX", async (req, res) => {
  try {
    Course.deleteMany({}, (error) => {
      if (error) {
        res.status(500).json({
          status: false,
          error: error,
        });
      }
      res.status(200).json({
        status: true,
        message: "all Courses deleted successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

router.use(courseGET); //GET APis for the courses

module.exports = router;
