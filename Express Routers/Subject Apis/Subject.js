const express = require("express");
const upload = require("../../middlewares/multer");
const Subject = require("../../models/createSubject");
const router = express.Router();
const subjectGet = require("./SubjectGet");

// Create Subject
router.post("/createSubject", upload.single("image"), async (req, res) => {
  try {
    const subjectObj = req.body;
    if (req.file) {
      subjectObj.image = req.file.filename;
    }
    const subject = new Subject(req.body);
    if (!subject) {
      // if subject is not created
      res.status(500).json({
        status: false,
        message: "Subject is not Created",
      });
    } else {
      //if subject is created
      await subject.save();
      res.status(200).json({
        status: true,
        message: "Subject created Successfull",
        subject: subject,
      });
    }
  } catch (error) {}
});

router.patch(
  "/editSubject/:subjectId",
  upload.single("image"),
  async (req, res) => {
    const updateObj = req.body;
    // Checking if updates are valid
    const updates = Object.keys(req.body);
    const allowableUpdates = ["name", "status"];
    const isValidUpdate = updates.every((update) =>
      allowableUpdates.includes(update)
    );
    if (!isValidUpdate)
      return res.status(400).json({ error: "Invalid Update." });
    if (req.file) {
      updateObj = req.file.filename;
    }
    // Update Subject
    try {
      const subject = await Subject.findOneAndUpdate(
        { _id: req.params.subjectId },
        updateObj,
        { runValidators: true, new: true }
      );

      res.status(200).json({
        status: true,
        message: "Edited Successfully",
        subject: subject,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        error: "Update Validator Failed",
      });
    }
  }
);

router.delete("/deleteSubjectById/:subjectId", async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.subjectId,
    });
    if (!subject) {
      res.status(404).json({
        status: false,
        message: "Subject Not Found",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Subject has been deleted.",
        subject: subject,
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
    Subject.deleteMany({}, (error) => {
      if (error) {
        res.status(500).json({
          status: false,
          error: error,
        });
      }
      res.status(201).json({
        status: true,
        message: "all Subjects deleted successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

router.use(subjectGet);

module.exports = router;
