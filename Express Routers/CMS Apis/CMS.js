const express = require("express");
const CMS = require("../../models/createCMS");
const router = express.Router();
const cmsGet = require("./CMSGet");

// Create CMS
router.post("/createCMS", async (req, res) => {
  try {
    const cms = new CMS(req.body);

    if (!cms) {
      // if cms is not created
      res.status(500).json({
        status: false,
        message: "CMS is not Created",
      });
    } else {
      //if cms is created
      await cms.save();
      res.status(200).json({
        status: true,
        message: "CMS created Successfull",
        cms: cms,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

router.patch("/editTerms/:cmsID", async (req, res) => {
  try {
    const cms = await CMS.findOneAndUpdate(
      { _id: req.params.cmsID },
      { termsAndConditions: req.body.termsAndConditions },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!cms) {
      res.status(400).json({
        status: false,
        message: "Update failed or CMS dose not exist.",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Update Successful",
        cms: cms,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
});

router.patch("/editAboutUS/:cmsID", async (req, res) => {
  try {
    const cms = await CMS.findOneAndUpdate(
      { _id: req.params.cmsID },
      { aboutUs: req.body.aboutUs },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!cms) {
      res.status(400).json({
        status: false,
        message: "Update failed or CMS dose not exist.",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Update Successful",
        cms: cms,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
});

router.patch("/editPolicy/:cmsID", async (req, res) => {
  try {
    const cms = await CMS.findOneAndUpdate(
      { _id: req.params.cmsID },
      { privacyPolicy: req.body.privacyPolicy },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!cms) {
      res.status(400).json({
        status: false,
        message: "Update failed or CMS dose not exist.",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Update Successful",
        cms: cms,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
});

router.delete("/deleteCMSById/:cmsId", async (req, res) => {
  try {
    const cms = await CMS.findOneAndDelete({
      _id: req.params.cmsId,
    });
    if (!cms) {
      res.status(404).json({
        status: false,
        message: "CMS Not Found",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "CMS has been deleted.",
        cms: cms,
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
    CMS.deleteMany({}, (error) => {
      if (error) {
        res.status(500).json({
          status: false,
          error: error,
        });
      }
      res.status(201).json({
        status: true,
        message: "all CMSs deleted successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

router.use(cmsGet);

module.exports = router;
