const express = require("express");
const router = express.Router();
const { Admin } = require("../../models/Auth");
const getFilterSearchPaginatedResults = require("./../../middlewares/getFilterSearchPaginatedResults");

//get all users

router.get(
	"/getAllUsers",
	getFilterSearchPaginatedResults(Admin),
	(req, res) => {
		res.json(req.results);
	}
);

//get usrs by defined Filters
router.post("/getUsersByFilter/:offset/:limit", async (req, res) => {
	const limit = parseInt(req.params.limit);
	const offset = (parseInt(limit) - 1) * limit;

	try {
		const users = await Admin.findOne(
			req.body,
			{},
			{
				sort: {
					createdAt: -1,
				},
			}
		)
			.limit(limit)
			.skip(offset);

		if (!users || users.length === 0) {
			res.status(404).json({
				status: false,
				message: "Users Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				users: users,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

//Getting user By ID
router.get("/getUserByID/:userID", async (req, res) => {
	try {
		const user = await Admin.findOne({ _id: req.params.userID });
		if (!user) {
			res.status(404).json({
				status: false,
				message: "User not Found",
			});
		} else {
			res.status(200).json({
				status: false,
				user: user,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
