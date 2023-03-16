const mongoose = require("mongoose");

const { Schema } = mongoose;

const downloadedResourceSchema = new Schema(
	{
		userID: {
			type: Schema.Types.ObjectId,
			ref: "Admin",
			required: true,
		},
		resources: [
			{
				type: Schema.Types.ObjectId,
				ref: "Resource",
				required: true,
			},
		],
	},
	{ timestamps: true }
);

const DownloadedResource = mongoose.model(
	"DownloadedResource",
	downloadedResourceSchema
);

module.exports = DownloadedResource;
