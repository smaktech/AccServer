const express = require("express");
const router = express.Router();
const Faq = require("./../../models/createFaq");
const faqGet = require("./FaqGet");

router.post("/createFaq", async (req, res) => {
	const faq = new Faq(req.body);
	if (!faq) {
		res.status(400).json({
			status: false,
			message: "Faq is not created",
		});
	} else {
		try {
			await faq.save();
			res.status(201).json({
				status: true,
				message: "Faq is created successfully",
				faq: faq,
			});
		} catch (error) {
			res.status(500).json({
				status: false,
				message: "sever error",
			});
		}
	}
});

router.patch("/editFaq/:faqID", async (req, res) => {
	// Checking if updates are valid
	const updates = Object.keys(req.body);
	const allowableUpdates = ["ques", "ans"];
	const isValidUpdate = updates.every((update) =>
		allowableUpdates.includes(update)
	);
	if (!isValidUpdate) return res.status(400).json({ error: "Invalid Update." });

	// Update Board
	try {
		const faq = await Faq.findOneAndUpdate(
			{ _id: req.params.faqID },
			req.body,
			{ runValidators: true, new: true }
		);

		res.status(200).json({
			status: true,
			message: "Edited Successfully",
			faq: faq,
		});
	} catch (error) {
		res.status(400).json({
			status: false,
			error: "Update Validator Failed",
		});
	}
});

router.delete("/deleteFaqById/:faqID", async (req, res) => {
	try {
		const faq = await Faq.findOneAndDelete({
			_id: req.params.faqID,
		});
		if (!faq) {
			res.status(404).json({
				status: false,
				message: "Faq Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				message: "Faq has been deleted.",
				faq: faq,
			});
		}
	} catch (error) {
		res.status(400).json({
			status: false,
			error: error,
		});
	}
});

// this will delete all the documents of this model. Use it consciously.
router.delete("/deleteAllX", async (req, res) => {
	try {
		Faq.deleteMany({}, (error) => {
			if (error) {
				res.status(500).json({
					status: false,
					error: error,
				});
			}
			res.status(200).json({
				status: true,
				message: "all Faqs deleted successfully.",
			});
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			error: error,
		});
	}
});

router.use(faqGet);

module.exports = router;
