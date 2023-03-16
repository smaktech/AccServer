const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const subTopicSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: true,
    },
    description: {
      type: String,
      minlength: 3,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    topic: {
      type: ObjectId,
      ref: "Topic",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

subTopicSchema.virtual("exam", {
  localField: "_id",
  foreignField: "subTopicApi",
  ref: "Exam",
});

subTopicSchema.set("toJSON", { virtuals: true });
subTopicSchema.set("toObject", { virtuals: true });

const SubTopic = model("SubTopic", subTopicSchema);

module.exports = SubTopic;
