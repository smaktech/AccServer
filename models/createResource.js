const mongoose = require("mongoose");

const { Schema } = mongoose;

const resourceSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			minlength: 5,
		},
		fileLink: {
			linkType: {
				type: String,
				required: true,
				enum: ["link", "upload"],
			},
			linkString: {
				type: String,
				required: true,
			},
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
	},
	{ timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
