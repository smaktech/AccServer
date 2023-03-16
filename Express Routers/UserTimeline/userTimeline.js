const router = require("express").Router(); 
const UserTimeline = require("../../models/userTimeline");

router.post("/add", async (req, res) => {
    let timeline; 
    try { 
        timeline = new UserTimeline(req.body);
        await timeline.save();
        return res.status(201).json({
          status: true,
          timeline,
        }); 
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  });

  router.patch("/editTimeLine/:timelineId",    async (req, res) => {
      const updateQuery = {};
      // Checking if updates are valid
      const updates = Object.keys(req.body);
      const allowableUpdates = ["textColor", "end", "start","description","title","allday"]; 

      updates.forEach((el) => {
        if (allowableUpdates.includes(el)) updateQuery[el] = req.body[el];
      }); 
  
      try {
        const timeline = await UserTimeline.findOneAndUpdate(
          { _id: req.params.timelineId   },
          updateQuery,
          { runValidators: true, new: true }
        );
  
        res.status(200).json({
          status: true,
          message: "Edited Successfully",
          timeline: timeline,
        });
      } catch (error) {
        res.status(400).json({
          status: false,
          error: "Update Validator Failed",
        });
      }
    }
  );
  router.delete("/deleteUserTimeline/:timeLineId", async (req, res) => {
    try {
      const timeline = await UserTimeline.findOneAndDelete({
        _id: req.params.timeLineId,
      });
      if (!timeline) {
        res.status(404).json({
          status: false,
          message: "Timeline Not Found",
        });
      } else {
        
        res.status(200).json({
          status: true,
          message: "Timeline has been deleted.",
          timeline: timeline,
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        error: error,
      });
    }
  });



  router.get("/:userID", async (req, res) => {
    const { userID } = req.params;
    const { date } = req.query;
    try {
      const timeline = await UserTimeline.find({
        userID,
        start: {
          $gte: new Date(new Date(date).setHours(00, 00, 00)),
          $lte: new Date(new Date(date).setHours(23, 59, 59)),
        },
      });
      
      res.status(200).json({
        status: true,
        data:timeline,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  });
  
router.get("/all/:userID", async (req, res) => {
    const { userID } = req.params;
    const { date } = req.query;
    try {
      const timeline = await UserTimeline.find({
        userID, 
      });
      
      res.status(200).json({
        status: true,
        data:timeline,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  });
module.exports = router;
