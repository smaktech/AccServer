const mongoose = require("mongoose");

const { Schema } = mongoose;

const CMSSchema = new Schema(
	{
		termsAndConditions: {
			type: String,
			required: true,
			trim: true,
		},
		aboutUs: {
			type: String,
			required: true,
			trim: true,
		},
		privacyPolicy: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

const CMS = mongoose.model("CMS", CMSSchema);

module.exports = CMS;
