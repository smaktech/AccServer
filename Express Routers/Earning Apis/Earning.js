const express = require("express");
const router = express.Router();
const earningGet = require("./EarningGet");
const Earning = require("../../models/createEarning");

//create Earning

router.post("/createEarning", async (req, res) => {
	const { userID, orderID, status, amount } = req.body;

	const earningData = {
		userID,
		orderID,
		status,
		amount,
	};

	// these data will come from third party get way system
	earningData.transactionDate = new Date();
	earningData.transactionID = `kjkjlkjhasd`;

	try {
		//creating the courses
		const earning = await new Earning(earningData);

		if (!earning) {
			res.status(500).json({
				status: false,
				message: "Earning is not Created",
			});
		} else {
			await earning.save();
			res.status(200).json({
				status: true,
				message: "Earning is created Successfully!!",
				earning: earning,
			});
		}
	} catch (error) {
		res.status(500).json({
			status: false,
			error: error,
		});
	}
});

router.patch("/editEarning/:earningId", async (req, res) => {
	const updateQuery = {};
	// Checking if updates are valid
	const updates = Object.keys(req.body);
	const allowableUpdates = ["status", "amount"];

	updates.forEach((el) => {
		if (allowableUpdates.includes(el)) updateQuery[el] = req.body[el];
	});

	try {
		const earning = await Earning.findOneAndUpdate(
			{ _id: req.params.earningId },
			updateQuery,
			{ runValidators: true, new: true }
		);

		res.status(200).json({
			status: true,
			message: "Edited Successfully",
			earning: earning,
		});
	} catch (error) {
		res.status(400).json({
			status: false,
			error: "Update Validator Failed",
		});
	}
});

router.delete("/deleteEarningById/:earningID", async (req, res) => {
	try {
		const earning = await Earning.findOneAndDelete({
			_id: req.params.earningID,
		});
		if (!earning) {
			res.status(404).json({
				status: false,
				message: "Earning Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				message: "Earning has been deleted.",
				earning: earning,
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
		Earning.deleteMany({}, (error) => {
			if (error) {
				res.status(500).json({
					status: false,
					error: error,
				});
			}
			res.status(201).json({
				status: true,
				message: "all Earnings deleted successfully.",
			});
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			error: error,
		});
	}
});

router.use(earningGet);

module.exports = router;
