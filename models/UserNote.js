const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const userNoteSchema = new Schema(
  {
    userID: {
      type: ObjectId,
      ref: "Admin",
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserNote = model("UserNote", userNoteSchema);

module.exports = UserNote;
