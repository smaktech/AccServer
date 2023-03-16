const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const Classes = require("../../models/createClasses");
const router = express.Router();

/***** get all Classed with filter  *****/
router.get(
	"/filterClasses",
	getFilterSearchPaginatedResults(Classes),
	(req, res) => {
		res.send(req.results);
	}
);

/***** get a classes by ID  *****/
router.get("/getClassesByID/:classesID", async (req, res) => {
	try {
		const classes = await Classes.findOne({ _id: req.params.classesID });

		//if classes not found
		if (!classes) {
			res.status(404).json({
				status: false,
				message: "Course Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				course: classes,
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
