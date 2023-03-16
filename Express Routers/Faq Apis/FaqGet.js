const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const Faq = require("../../models/createFaq");
const router = express.Router();

/***** get all Faqs with filter  *****/
router.get("/filterFaq", getFilterSearchPaginatedResults(Faq), (req, res) => {
	res.send(req.results);
});

/***** get a faq by ID  *****/
router.get("/getFaqByID/:faqID", async (req, res) => {
	try {
		const faqs = await Faq.findOne({ _id: req.params.faqID });

		//if faq not found
		if (!faqs) {
			res.status(404).json({
				status: false,
				message: "Course Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				course: faqs,
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
