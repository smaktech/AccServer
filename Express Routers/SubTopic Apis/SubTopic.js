const express = require("express");
const router = express.Router();
const subTopicGet = require("./SubTopicGet");
const upload = require("../../middlewares/fileUploadMulter");
const SubTopic = require("../../models/SubTopic");
const fs = require("fs");

router.post(
  "/createSubTopic/:topicID",
  upload.single("file"),
  async (req, res) => {
    const { topicID } = req.params;
    try {
      const subTopicObj = { ...req.body, topic: topicID };

      if (req.file) {
        subTopicObj.file = req.file.filename;
      }

      const newSubTopic = new SubTopic(subTopicObj);
      const subTopic = await newSubTopic.save();

      res.status(200).json({
        status: true,
        SubTopic: subTopic,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
);

router.patch(
  "/editSubTopic/:subTopicId",
  upload.single("file"),
  async (req, res) => {
    const updateQuery = {};
    // Checking if updates are valid
    const updates = Object.keys(req.body);
    const allowableUpdates = ["name", "description", "status"];

    updates.forEach((el) => {
      if (allowableUpdates.includes(el)) updateQuery[el] = req.body[el];
    });

    if (req.file) {
      updateQuery.file = req.file.filename;
    }

    try {
      const topic = await SubTopic.findOneAndUpdate(
        { _id: req.params.subTopicId },
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

router.delete("/deleteSubTopicById/:subTopicID", async (req, res) => {
  try {
    const subTopic = await SubTopic.findOneAndDelete({
      _id: req.params.subTopicID,
    });
    if (!subTopic) {
      res.status(404).json({
        status: false,
        message: "Sub Topic Not Found",
      });
    } else {
      if (subTopic.file) {
        fs.unlink(subTopic.file, (error) => {
          if (error) throw err;
          console.log("File Deleted");
        });
      }
      res.status(200).json({
        status: true,
        message: "Sub Topic has been deleted.",
        subTopic: subTopic,
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
    SubTopic.deleteMany({}, (error) => {
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

router.use(subTopicGet);

module.exports = router;
