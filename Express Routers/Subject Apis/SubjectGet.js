const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const { listenerCount } = require("../../models/createSubject");
const Subject = require("../../models/createSubject");
const router = express.Router();

/***** get all Subjects with filter  *****/
router.get(
	"/filterSubject",
	getFilterSearchPaginatedResults(Subject),
	(req, res) => {
		res.send(req.results);
	}
);

/***** get a subject by ID  *****/
router.get("/getSubjectByID/:subjectID", async (req, res) => {
	try {
		const subjects = await Subject.findOne({ _id: req.params.subjectID });

		//if subject not found
		if (!subjects) {
			res.status(404).json({
				status: false,
				message: "Course Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				course: subjects,
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
