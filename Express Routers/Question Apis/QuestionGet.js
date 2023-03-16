const express = require("express");
const router = express.Router();
const question = require("../../models/createQuestion");



router.get("/getQuestion",  async (req, res,  ) => {
 
  const questionData = await question.find({
    ID: req.query.id}).exec();
  // console.log('questionData', questionData, );
  // console.log('Request questionData', req.query.id);

  res.status(200).json({
    status: true,
    results: questionData,
  });
});
 

module.exports = router;