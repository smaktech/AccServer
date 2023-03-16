const express = require("express");
const router = express.Router();
const Qualification = require("../../models/createQualification");
const qualificationGet = require("./QualificationGet");

// Create Qualification
router.post("/createQualification", async (req, res) => {
	try {
		const qualification = new Qualification(req.body);

		if (!qualification) {
			// if qualification is not created
			res.status(500).json({
				status: false,
				message: "Qualification is not Created",
			});
		} else {
			//if qualification is created
			await qualification.save();
			res.status(200).json({
				status: true,
				message: "Qualification created Successfull",
				qualification: qualification,
			});
		}
	} catch (error) {}
});

router.patch("/editQualification/:qualificationId", async (req, res) => {
	// Checking if updates are valid
	const updates = Object.keys(req.body);
	const allowableUpdates = ["name", "status"];
	const isValidUpdate = updates.every((update) =>
		allowableUpdates.includes(update)
	);
	if (!isValidUpdate) return res.status(400).json({ error: "Invalid Update." });

	// Update Qualification
	try {
		const qualification = await Qualification.findOneAndUpdate(
			{ _id: req.params.qualificationId },
			req.body,
			{ runValidators: true, new: true }
		);

		res.status(200).json({
			status: true,
			message: "Edited Successfully",
			qualification: qualification,
		});
	} catch (error) {
		res.status(400).json({
			status: false,
			error: "Update Validator Failed",
		});
	}
});

router.delete("/deleteQualificationById/:qualificationId", async (req, res) => {
	try {
		const qualification = await Qualification.findOneAndDelete({
			_id: req.params.qualificationId,
		});
		if (!qualification) {
			res.status(404).json({
				status: false,
				message: "Qualification Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				message: "Qualification has been deleted.",
				qualification: qualification,
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
		Qualification.deleteMany({}, (error) => {
			if (error) {
				res.status(500).json({
					status: false,
					error: error,
				});
			}
			res.status(201).json({
				status: true,
				message: "all Qualifications deleted successfully.",
			});
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			error: error,
		});
	}
});

router.use(qualificationGet);
module.exports = router;
