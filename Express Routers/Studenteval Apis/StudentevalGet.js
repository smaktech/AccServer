const express = require("express");
const router = express.Router();
const StudenEval = require("../../models/createStudentEval");




/***** get all Course with filter  *****/
// router.get("/evaluation/createEvaluation", async (req, res) => {
//   // query object. subject will be founded based on it
//   const query = {};

//   // all the results will be store here
//   const results = {};

//   // Defining page number limit and sortByDate for condition
//   let page, limit, sortByDate;

//   // this five special field for course filter
//   const { board1, qualification, course, subject, description } = req.query;

//   // check if any of these are given in the query

//   if (board1) {
//     query.board1 = board1;
//   }
//   // if (subBoardID) {
//   //   query.subBoardID = subBoardID;
//   // }
//   if (qualification) {
//     query.qualification = qualification;
//   }
//   if (course) {
//     query.course = course;
//   }
//   if (description ) {
//     query.description  = description ;
//   }

//   // Limit is set based on query or default is 10
//   if (!parseInt(req.query.limit || parseInt(req.query.limit) <= 0)) {
//     limit = 10;
//   } else {
//     limit = parseInt(req.query.limit);
//   }

//   // Page number is set based on query or default is 1
//   if (!parseInt(req.query.page) || parseInt(req.query.page) <= 0) {
//     page = 1;
//   } else if (parseInt(req.query.page) > results.totalPages) {
//     page = results.totalPages;
//   } else {
//     page = parseInt(req.query.page);
//   }

//   // For sorting all the documents from server side
//   if (req.query.sortByDate) {
//     if (req.query.sortByDate === "asc") sortByDate = -1;
//     if (req.query.sortByDate === "dsc") sortByDate = 1;
//   } else {
//     sortByDate = 1;
//   }

//   // Searching parameter
//   if (req.query.searchString) {
//     query.name = {
//       $regex: new RegExp(req.query.searchString.trim(), "i"),
//     };
//   }

//   // check if status is correct
//   if (req.query.status) {
//     const allowableStatus = ["active", "inactive"];
//     const isValidStatus = allowableStatus.includes(req.query.status.trim());
//     if (isValidStatus) query.status = req.query.status.trim();
//   }

//   // if date filter is enable through query
//   if (req.query.startDate) {
//     let startDate, endDate;
//     startDate = req.query.startDate;
//     if (!req.query.endDate) {
//       // if end date is not given then end date will be current date
//       endDate = new Date();
//     } else {
//       endDate = req.query.endDate;
//     }
//     query.createdAt = {
//       $gt: new Date(new Date(startDate).setHours(00, 00, 01)),
//       $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
//     };
//   }

//   // Count of the filtered documents results
//   const documentsCount = await Evaluation.countDocuments(query).exec();

//   // Setting the total page number in response results
//   results.totalPages = Math.ceil(documentsCount / limit);

//   // Define start and end index for skip and limit
//   const startIndex = (page - 1) * limit;
//   const endIndex = page * limit;

//   if (startIndex > 0) {
//     results.previous = {
//       page: page - 1,
//       limit: limit,
//     };
//   }

//   if (endIndex < documentsCount) {
//     results.next = {
//       page: page + 1,
//       limit: limit,
//     };
//   }

//   try {
//     const evaluations = await Evaluation.find(query)
//       .populate({
//         path: "board qualification description ",
//       })
//       .limit(limit)
//       .skip(startIndex)
//       .sort({ createdAt: sortByDate })
//       .exec();

//     if (evaluations.length === 0) {
//       res.status(404).json({
//         status: false,
//         message: "No documents are Found",
//       });
//     } else {
//       results.data = evaluations;
//       res.status(200).json({
//         status: true,
//         results: results,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       error: error,
//     });
//   }
// });

/***** get a Course by ID  *****/
// router.get("/getEvaluationId/:evaluation", async (req, res) => {
//   try {
//     const evaluations = await evaluations.findOne({ _id: req.params.course }).populate(
//       [
//         { path: "subBoard" },
//         { path: "classes" },
//         { path: "subject" },
//         { path: "topic" },
//       ]
//     );
//     //if not courses
//     if (!evaluations) {
//       res.status(404).json({
//         status: false,
//         message: "Course Not Found",
//       });
//     } else {
//       res.status(200).json({
//         status: true,
//         course: evaluations,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       error: error,
//     });
//   }
// });

module.exports = router;
