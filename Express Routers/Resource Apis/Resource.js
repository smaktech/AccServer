const express = require("express");
const router = express.Router();
const resourceGet = require("./ResourceGet");
const upload = require("../../middlewares/resourceFileUploadMulter");
const Resource = require("../../models/createResource");
const fs = require("fs");

//create Resource

router.post(
	"/createResource",
	upload.single("resourceFile"),
	async (req, res) => {
		const { name, description, linkType, linkString, status } = req.body;

		const resourceData = {
			name,
			description,
			status,
		};

		if (linkType === "upload" && req.file?.path) {
			resourceData.fileLink = {
				linkType: "upload",
				linkString: req.file.filename,
			};
		} else if (linkType === "link") {
			resourceData.fileLink = {
				linkType: "link",
				linkString: linkString,
			};
		} else {
			res.status(400).json({
				status: false,
				message: "link or upload is not ok",
			});
		}

		try {
			//creating the courses
			const resource = await new Resource(resourceData);

			if (!resource) {
				res.status(500).json({
					status: false,
					message: "Resource is not Created",
				});
			} else {
				await resource.save();
				res.status(200).json({
					status: true,
					message: "Resource is created Successfully!!",
					resource: resource,
				});
			}
		} catch (error) {
			res.status(500).json({
				status: false,
				error: error,
			});
		}
	}
);

router.patch(
	"/editResource/:resourceId",
	upload.single("resourceFile"),
	async (req, res) => {
		const updateQuery = {};
		// Checking if updates are valid
		const updates = Object.keys(req.body);
		const allowableUpdates = [
			"name",
			"description",
			"mockTestLink",
			"examTestLink",
			"status",
		];

		updates.forEach((el) => {
			if (allowableUpdates.includes(el)) updateQuery[el] = req.body[el];
		});

		if (req.body?.linkType === "upload" && req.file?.path) {
			updateQuery.fileLink = {
				linkType: "upload",
				linkString: req.file.filename,
			};
		} else if (req.body?.linkType === "link") {
			updateQuery.fileLink = {
				linkType: "link",
				linkString: req.body?.linkString,
			};
		}

		try {
			const resource = await Resource.findOneAndUpdate(
				{ _id: req.params.resourceId },
				updateQuery,
				{ runValidators: true, new: true }
			);

			res.status(200).json({
				status: true,
				message: "Edited Successfully",
				resource: resource,
			});
		} catch (error) {
			res.status(400).json({
				status: false,
				error: "Update Validator Failed",
			});
		}
	}
);

router.delete("/deleteResourceById/:resourceID", async (req, res) => {
	try {
		const resource = await Resource.findOneAndDelete({
			_id: req.params.resourceID,
		});
		if (!resource) {
			res.status(404).json({
				status: false,
				message: "Resource Not Found",
			});
		} else {
			if (resource.fileLink.linkType === "upload") {
				fs.unlink(resource.fileLink.linkString, (error) => {
					if (error) throw err;
					console.log("File Deleted");
				});
			}
			res.status(200).json({
				status: true,
				message: "Resource has been deleted.",
				resource: resource,
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
		Resource.deleteMany({}, (error) => {
			if (error) {
				res.status(500).json({
					status: false,
					error: error,
				});
			}
			res.status(201).json({
				status: true,
				message: "all Resources deleted successfully.",
			});
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			error: error,
		});
	}
});

router.use(resourceGet);

module.exports = router;
