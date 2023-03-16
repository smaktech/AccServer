const mongoose = require("mongoose");

const { Schema } = mongoose;

const Courses = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: true,
      trim: true,
    },
    boardID: {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
    subBoardID: {
      type: Schema.Types.ObjectId,
      ref: "SubBoard",
    },
    classesID: {
      type: Schema.Types.ObjectId,
      ref: "Classes",
    },
    subjectID: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    topicIDs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    description: {
      type: String,
      required: true,
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

const Course = mongoose.model("Course", Courses);

exports.Course = Course;
