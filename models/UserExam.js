const { Schema, model } = require("mongoose");

const userExamSchema = new Schema(
  {
    subTopicID: {
      type: Schema.Types.ObjectId,
      ref: "SubTopic",
      required: true,
    },
    examID: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    examData: {
      type: String,
    },
    exerciseData: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserExam = model("UserExam", userExamSchema);

module.exports = UserExam;
