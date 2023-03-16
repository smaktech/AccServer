const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const Board = require("../../models/createBoard");
const router = express.Router();

/***** get all Boards with filter  *****/
router.get(
	"/filterBoard",
	getFilterSearchPaginatedResults(Board),
	(req, res) => {
		res.send(req.results);
	}
);

/***** get a board by ID  *****/
router.get("/getBoardByID/:boardID", async (req, res) => {
	try {
		const boards = await Board.findOne({ _id: req.params.boardID });

		//if board not found
		if (!boards) {
			res.status(404).json({
				status: false,
				message: "Course Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				course: boards,
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
