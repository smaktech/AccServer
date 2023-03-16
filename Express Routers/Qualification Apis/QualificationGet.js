const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const Qualification = require("../../models/createQualification");
const router = express.Router();

/***** get all Qualifications with filter  *****/
router.get(
	"/filterQualification",
	getFilterSearchPaginatedResults(Qualification),
	(req, res) => {
		res.send(req.results);
	}
);

/***** get a qualification by ID  *****/
router.get("/getQualificationByID/:qualificationID", async (req, res) => {
	try {
		const qualifications = await Qualification.findOne({ _id: req.params.qualificationID });

		//if qualification not found
		if (!qualifications) {
			res.status(404).json({
				status: false,
				message: "Course Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				course: qualifications,
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
