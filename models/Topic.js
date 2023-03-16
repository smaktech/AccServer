const { Schema, model } = require("mongoose");

const topicSchema = new Schema(
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
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Topic = model("Topic", topicSchema);

module.exports = Topic;
