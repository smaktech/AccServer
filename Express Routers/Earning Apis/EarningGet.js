const express = require("express");
const getFilterSearchPaginatedResults = require("../../middlewares/getFilterSearchPaginatedResults");
const Earning = require("../../models/createEarning");
const router = express.Router();

/***** get all Earnings with filter  *****/
router.get("/filterEarning", async (req, res) => {
	// query object. subject will be founded based on it
	const query = {};

	// all the results will be store here
	const results = {};

	// Defining page number limit and sortByDate for condition
	let page, limit, sortByDate;

	// For sorting all the documents from server side
	if (req.query.sortByDate) {
		if (req.query.sortByDate === "asc") sortByDate = -1;
		if (req.query.sortByDate === "dsc") sortByDate = 1;
	} else {
		sortByDate = 1;
	}

	// Searching parameter
	if (req.searchString) {
		query.name = {
			$regex: new RegExp(req.query.searchString.trim(), "i"),
		};
	}

	// check if status is correct
	if (req.query.status) {
		query.status = req.query.status;
	}

	// if date filter is enable through query
	if (req.query.startDate) {
		let startDate, endDate;
		startDate = req.query.startDate;
		if (!req.query.endDate) {
			// if end date is not given then end date will be current date
			endDate = new Date();
		} else {
			endDate = req.query.endDate;
		}
		query.createdAt = {
			$gt: new Date(new Date(startDate).setHours(00, 00, 01)),
			$lt: new Date(new Date(endDate).setHours(23, 59, 59)),
		};
	}

	// if amount is given
	if (req.query.amountFrom) {
		let amountFrom, amountTo;
		amountFrom = parseInt(req.query.amountFrom);
		if (!req.query.amountTo) {
			amountTo = 10000;
		} else {
			amountTo = parseInt(req.query.amountTo);
		}
		query.amount = {
			$gt: amountFrom,
			$lt: amountTo,
		};
	}

	// Limit is set based on query or default is 10
	if (!parseInt(req.query.limit || parseInt(req.query.limit) <= 0)) {
		limit = 10;
	} else {
		limit = parseInt(req.query.limit);
	}

	// Count of the filtered documents results
	const documentsCount = await Earning.countDocuments(query).exec();

	// Setting the total page number in response results
	results.totalPages = Math.ceil(documentsCount / limit);

	// Page number is set based on query or default is 1
	if (!parseInt(req.query.page) || parseInt(req.query.page) <= 0) {
		page = 1;
	} else if (parseInt(req.query.page) > results.totalPages) {
		page = results.totalPages;
	} else {
		page = parseInt(req.query.page);
	}

	// Define start and end index for skip and limit
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	if (startIndex > 0) {
		results.previous = {
			page: page - 1,
			limit: limit,
		};
	}

	if (endIndex < documentsCount) {
		results.next = {
			page: page + 1,
			limit: limit,
		};
	}

	try {
		const earnings = await Earning.find(query)
			.populate({
				path: "userID",
				select: "-tokenAuth",
			})
			.limit(limit)
			.skip(startIndex)
			.sort({ createdAt: sortByDate })
			.exec();

		if (earnings.length === 0) {
			res.status(200).json({
				status: false,
				message: "No documents are Found",
			});
		} else {
			results.data = earnings;
			res.status(200).json({
				status: true,
				results: results,
			});
		}
	} catch (error) {
		res.status(500).json({
			status: false,
			error: error,
		});
	}
});

/***** get a earning by ID  *****/
router.get("/getEarningByID/:earningID", async (req, res) => {
	try {
		const earnings = await Earning.findOne({
			_id: req.params.earningID,
		}).populate({
			path: "userID",
			select: "-tokenAuth",
		});

		//if earning not found
		if (!earnings) {
			res.status(404).json({
				status: false,
				message: "Course Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				course: earnings,
			});
		}
	} catch (error) {
		res.status(500).json({
			status: false,
			error: error,
		});
	}
});

/***** get a earning by userID  *****/
router.get("/getEarningByUserID/:userId", async (req, res) => {
	try {
		const earnings = await Earning.find({
			userID: req.params.userId,
		}).populate({
			path: "userID",
			select: "-tokenAuth",
		});

		//if earning not found
		if (!earnings) {
			res.status(404).json({
				status: false,
				message: "Course Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				course: earnings,
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
