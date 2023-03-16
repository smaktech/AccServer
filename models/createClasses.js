const mongoose = require("mongoose");

const { Schema } = mongoose;

const classesSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
      trim: true,
      minlength: 3,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Classes = mongoose.model("Classes", classesSchema);

module.exports = Classes;
