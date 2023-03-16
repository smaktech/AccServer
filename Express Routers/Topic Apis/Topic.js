const express = require("express");
const router = express.Router();
const topicGet = require("./TopicGet");
const upload = require("../../middlewares/videoUploadMulter");
const Topic = require("../../models/Topic");
const fs = require("fs");
const { Course } = require("../../models/createCourse");

//create Topic

// router.post("/createTopic", upload.single("topicVideo"), async (req, res) => {
//   const {
//     name,
//     description,
//     mockTestLink,
//     examTestLink,
//     linkType,
//     linkString,
//     status,
//   } = req.body;

//   const topicData = {
//     name,
//     description,
//     mockTestLink,
//     examTestLink,
//     status,
//   };

//   if (linkType === "upload" && req.file?.path) {
//     topicData.videoLink = {
//       linkType: "upload",
//       linkString: req.file.filename,
//     };
//   } else if (linkType === "iframe") {
//     topicData.videoLink = {
//       linkType: "iframe",
//       linkString: linkString,
//     };
//   } else if (linkType === "link") {
//     topicData.videoLink = {
//       linkType: "link",
//       linkString: linkString,
//     };
//   } else {
//     return res.status(400).json({
//       status: false,
//       message: "link or upload is not ok",
//     });
//   }

//   try {
//     //creating the courses
//     const topic = await new Topic(topicData);

//     if (!topic) {
//       return res.status(500).json({
//         status: false,
//         message: "Topic is not Created",
//       });
//     } else {
//       await topic.save();
//       res.status(200).json({
//         status: true,
//         message: "Topic is created Successfully!!",
//         topic: topic,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       error: error,
//     });
//   }
// });

router.post("/createTopic", upload.single("image"), async (req, res) => {
  try {
    const topicObj = req.body;
    if (req.file) {
      topicObj.image = req.file.filename;
    }
    const newTopic = new Topic(topicObj);
    const topic = await newTopic.save();

    res.status(200).json({
      status: true,
      topic,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

router.patch(
  "/editTopic/:topicId",
  upload.single("image"),
  async (req, res) => {
    const updateQuery = {};
    // Checking if updates are valid
    const updates = Object.keys(req.body);
    const allowableUpdates = ["name", "description", "status"];

    updates.forEach((el) => {
      if (allowableUpdates.includes(el)) updateQuery[el] = req.body[el];
    });
    if (req.file) {
      updateQuery.image = req.file.filename;
    }
    try {
      const topic = await Topic.findOneAndUpdate(
        { _id: req.params.topicId },
        updateQuery,
        { runValidators: true, new: true }
      );

      res.status(200).json({
        status: true,
        message: "Edited Successfully",
        topic: topic,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        error: "Update Validator Failed",
      });
    }
  }
);

router.delete("/deleteTopicById/:topicID", async (req, res) => {
  try {
    const topic = await Topic.findOneAndDelete({
      _id: req.params.topicID,
    });
    if (!topic) {
      res.status(404).json({
        status: false,
        message: "Topic Not Found",
      });
    }
    const course = await Course.findOneAndUpdate({
      $elemMatch: { topicIDs: req.params.topicID },
    });
    res.status(200).json({
      status: true,
      message: "Topic has been deleted.",
      topic: topic,
    });
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
    Topic.deleteMany({}, (error) => {
      if (error) {
        res.status(500).json({
          status: false,
          error: error,
        });
      }
      res.status(201).json({
        status: true,
        message: "all Topics deleted successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

router.use(topicGet);

module.exports = router;
