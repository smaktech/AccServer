const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const Resource = require("../../models/createResource");
const router = express.Router();

/***** get all Resources with filter  *****/
router.get(
	"/filterResource",
	getFilterSearchPaginatedResults(Resource),
	(req, res) => {
		res.send(req.results);
	}
);

router.get("/all", async (req, res) => {
	const re = await Resource.find({});
	res.send(re);
});

/***** get a resource by ID  *****/
router.get("/getResourceByID/:resourceID", async (req, res) => {
	try {
		const resources = await Resource.findOne({ _id: req.params.resourceID });

		//if resource not found
		if (!resources) {
			res.status(404).json({
				status: false,
				message: "Course Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				course: resources,
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
