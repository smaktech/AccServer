const mongoose = require("mongoose");

const { Schema } = mongoose;

const subjectSchema = new Schema(
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
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
