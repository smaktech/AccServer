const mongoose = require("mongoose");

const { Schema } = mongoose;

const subBoardSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
      trim: true,
      minlength: 3,
    },
    boardID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
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
  { timestamps: true }
);

const SubBoard = mongoose.model("SubBoard", subBoardSchema);

module.exports = SubBoard;
