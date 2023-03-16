const DownloadedResource = require("../../models/createDownloadedResource");

const router = require("express").Router();

router.post("/add/:userID/:resourceID", async (req, res) => {
	try {
		const download = await DownloadedResource.findOne({
			userID: req.params.userID,
		});
		if (!download) {
			const downloadedResource = new DownloadedResource({
				userID: req.params.userID,
				resources: [req.params.resourceID],
			});
			console.log(downloadedResource);
			await downloadedResource.save();
			return res.status(201).json({
				status: true,
				downloadedResource,
			});
		}
		if (download.resources.includes(req.params.resourceID)) {
			return res.json({
				status: true,
				downloadedResource: download,
			});
		}
		download.resources = download.resources.concat(req.params.resourceID);
		await download.save();
		res.status(201).json({
			status: true,
			downloadedResource: download,
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "Server Error",
		});
	}
});

router.get("/all/:userID", async (req, res) => {
	try {
		const downloadedResource = await DownloadedResource.findOne({
			userID: req.params.userID,
		}).populate({
			path: "resources",
		});
		if (!downloadedResource) {
			return res.status(404).json({
				status: false,
				message: "NO downloaded resources has been found",
			});
		}
		res.status(200).json({
			status: true,
			downlaod: downloadedResource,
		});
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
