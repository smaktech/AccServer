const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const userCourseSchema = new Schema(
  {
    userID: {
      type: ObjectId,
      ref: "Admin",
      required: true,
    },
    courseID: {
      type: ObjectId,
      ref: "Course",
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
      required: true,
    },
    sessionID: {
      type: ObjectId,
    },
    subscriptionID: {
      type: String,
    },
    category: {
      type: String,
      enum: ["per_subject", "unlimited"],
      default: "per_subject",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserCourse = model("UserCourse", userCourseSchema);
module.exports = UserCourse;
