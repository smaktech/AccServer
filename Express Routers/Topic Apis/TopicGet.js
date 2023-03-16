const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const router = express.Router();

const { Course } = require("../../models/createCourse");
const Topic = require("../../models/Topic");

/***** get all Topics with filter  *****/
router.get(
  "/filterTopic",
  getFilterSearchPaginatedResults(Topic),
  (req, res) => {
    res.send(req.results);
  }
);

/***** get a topic by id  *****/
router.get("/getTopicById/:topicID", async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.topicID });

    if (!topic) {
      res.status(404).json({
        status: false,
        message: "Topic Not Found",
      });
    } else {
      res.status(200).json({
        status: true,
        topic: topic,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

router.get("/getCourseTopics/:courseID", async (req, res) => {
  const { courseID } = req.params;
  try {
    const courseWithTopics = await Course.findOne({ _id: courseID }).populate(
      "topicIDs"
    );

    if (!courseWithTopics) {
      return res.status(404).json({
        status: false,
        message: "You have no course",
      });
    }
    res.status(200).json({
      status: true,
      data: courseWithTopics.topicIDs,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
