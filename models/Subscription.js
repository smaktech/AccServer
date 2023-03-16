const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectID } = mongoose.Schema.Types;

const subscriptionSchema = new Schema(
  {
    userID: {
      type: ObjectID,
      ref: "Admin",
      required: true,
    },
    courseID: {
      type: ObjectID,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed", "canceled", "refunded"],
      default: "pending",
      required: true,
    },
    cancellationDate: {
      type: Date,
    },
    cancellationMessage: {
      type: String,
    },
    sessionID: {
      type: ObjectID,
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

const Subscription = model("Subscription", subscriptionSchema);

module.exports = Subscription;
