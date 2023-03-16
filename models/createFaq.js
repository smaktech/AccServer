const mongoose = require("mongoose");

const { Schema } = mongoose;

const faqSchema = new Schema(
	{
		ques: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
		},
		ans: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
		},
	},
	{ timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);

module.exports = Faq;
