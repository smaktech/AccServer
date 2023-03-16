const express = require("express");
const upload = require("../../middlewares/multer");
const Classes = require("../../models/createClasses");
const router = express.Router();
const classesGet = require("./ClassesGet");

// Create Classes
router.post("/createClasses", upload.single("image"), async (req, res) => {
  try {
    const classesObj = req.body;
    if (req.file) {
      classesObj.image = req.file.filename;
    }
    const classes = new Classes(classesObj);

    if (!classes) {
      // if classes is not created
      res.status(500).json({
        status: false,
        message: "Classes is not Created",
      });
    } else {
      //if classes is created
      await classes.save();
      res.status(200).json({
        status: true,
        message: "Classes created Successfully",
        classes: classes,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

router.patch(
  "/editClasses/:classesId",
  upload.single("image"),
  async (req, res) => {
    const updateObj = req.file;
    // Checking if updates are valid
    const updates = Object.keys(req.body);
    const allowableUpdates = ["name", "status"];
    const isValidUpdate = updates.every((update) =>
      allowableUpdates.includes(update)
    );
    if (!isValidUpdate)
      return res.status(400).json({ error: "Invalid Update." });
    if (req.file) {
      updateObj.image = req.file.filename;
    }
    // Update Classes
    try {
      const classes = await Classes.findOneAndUpdate(
        { _id: req.params.classesId },
        updateObj,
        { runValidators: true, new: true }
      );

      res.status(500).json({
        status: true,
        message: "Edited Successfully",
        classes: classes,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        error: "Update Validator Failed",
      });
    }
  }
);

router.delete("/deleteClassesById/:classesId", async (req, res) => {
  try {
    const classes = await Classes.findOneAndDelete({
      _id: req.params.classesId,
    });
    if (!classes) {
      res.status(404).json({
        status: false,
        message: "Classes Not Found",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Classes has been deleted.",
        classes: classes,
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
    Classes.deleteMany({}, (error) => {
      if (error) {
        res.status(500).json({
          status: false,
          error: error,
        });
      }
      res.status(201).json({
        status: true,
        message: "all classes deleted successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

router.use(classesGet);

module.exports = router;
