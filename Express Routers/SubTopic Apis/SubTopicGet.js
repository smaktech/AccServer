const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const Exam = require("../../models/Exam");
const router = express.Router();
const SubTopic = require("../../models/SubTopic");

/***** get all Topics with filter  *****/
router.get(
  "/filterSubTopic",
  getFilterSearchPaginatedResults(SubTopic),
  (req, res) => {
    res.send(req.results);
  }
);

/***** get a topic by id  *****/
router.get("/getSubTopicById/:subTopicID", async (req, res) => {
  try {
    const subTopic = await SubTopic.findOne({
      _id: req.params.subTopicID,
    });

    const exam = await Exam.findOne({ subTopicID: req.params.subTopicID });

    if (!subTopic) {
      res.status(404).json({
        status: false,
        message: "Topic Not Found",
      });
    } else {
      res.status(200).json({
        status: true,
        subTopic,
        exam,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

module.exports = router;
