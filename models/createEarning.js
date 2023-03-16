const mongoose = require("mongoose");

const { Schema } = mongoose;

const earningSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  orderID: {
    type: String,
    required: true,
  },
  transactionID: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  cancellationStatus: {
    type: String,
    enum: ["canceled", "refunded"],
  },
  cancellationDate: {
    type: Date,
  },
  refundDate: {
    type: Date,
  },
  cancellationMessage: {
    type: String,
  },
  amount: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Earning = mongoose.model("Earning", earningSchema);

module.exports = Earning;
