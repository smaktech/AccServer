const express = require("express");
const UserCourse = require("../../models/UserCourse");
const UserTopic = require("../../models/UserTopic");
const router = express.Router();

router.get("/getAllTopicsByCourse/:userID/:courseID", async (req, res) => {
  const { userID, courseID } = req.params;
  try {
    const [course, topics] = await Promise.all([
      UserCourse.find({ userID, courseID }).populate({
        path: "courseID",
        select: "-topicIDs",
        populate: {
          path: "boardID subjectID classesID",
          select: "name",
        },
      }),
      UserTopic.find({ userID, courseID }).populate("topicID"),
    ]);

    if (!topics.length) {
      return res.status(404).json({
        status: false,
        message: "You have no course",
      });
    }
    res.status(200).json({
      status: true,
      course: course,
      topics: topics,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

router.post("/startTopic/:userID/:courseID/:topicID", async (req, res) => {
  const { userID, topicID, courseID } = req.params;

  try {
    const topic = await UserTopic.findOne({ userID, courseID, topicID });

    if (!topic) {
      const newTopic = new UserTopic({
        userID,
        courseID,
        topicID,
        ...req.body,
      });
      await newTopic.save();
      return res.status(201).json({
        status: true,
        message: "Topic added to user.",
        topic: newTopic,
      });
    }

    topic.progress =
      req.body.progress > topic.progress ? req.body.progress : topic.progress;

    await topic.save();

    res.status(201).json({
      status: true,
      message: "Topic updated.",
      topic: topic,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "user Response create failed",
    });
  }
});

router.get("/getAllUserTopics/:userID", async (req, res) => {
  const query = {
    userID: req.params.userID,
  };
  try {
    const userTopics = await UserTopic.find(query);
    if (!userTopics) {
      return res.status(404).json({
        status: false,
        message: "User Topics Not found",
      });
    }
    res.status(200).json({
      status: true,
      topics: userTopics,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
