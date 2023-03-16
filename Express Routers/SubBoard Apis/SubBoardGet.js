const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const SubBoard = require("../../models/createSubBoard");
const router = express.Router();

/***** get all Boards with filter  *****/
router.get(
  "/filterSubBoard",
  getFilterSearchPaginatedResults(SubBoard),
  (req, res) => {
    res.send(req.results);
  }
);

/***** get a board by ID  *****/
router.get("/getSubBoardByID/:subBoardID", async (req, res) => {
  try {
    const subBoards = await SubBoard.findOne({ _id: req.params.subBoardID });

    //if board not found
    if (!subBoards) {
      res.status(404).json({
        status: false,
        message: "Course Not Found",
      });
    } else {
      res.status(200).json({
        status: true,
        subBoards: subBoards,
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
