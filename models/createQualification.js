const mongoose = require("mongoose");

const { Schema } = mongoose;

const qualificationSchema = new Schema(
	{
		name: {
			type: String,
			default: "",
			required: true,
			trim: true,
			minlength: 3,
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
	},
	{ timestamps: true }
);

const Qualification = mongoose.model("Qualification", qualificationSchema);

module.exports = Qualification;
