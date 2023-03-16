const express = require("express");
const CMS = require("../../models/createCMS");
const Faq = require("../../models/createFaq");
const router = express.Router();

/***** get a cms by ID  *****/
router.get("/getCMS", async (req, res) => {
  try {
    const cms = await CMS.findOne({ _id: "6218b6b21cde1b664c0a9751" });

    //if cms not found
    if (!cms) {
      res.status(404).json({
        status: false,
        message: "CMS Not Found",
      });
    } else {
      res.status(200).json({
        status: true,
        cms,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error,
    });
  }
});

module.exports = router;
