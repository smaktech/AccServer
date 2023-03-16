const { Schema, model } = require("mongoose");

const examSchema = new Schema(
  {
    subTopicID: {
      type: Schema.Types.ObjectId,
      ref: "SubTopic",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = model("Exam", examSchema);

module.exports = Exam;
