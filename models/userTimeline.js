const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const userTimelineSchema = new Schema(
  {
    userID: {
      type: ObjectId,
      ref: "Admin",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    start:{
        type: Date,
        required: false,
    },
    allDay:{
        type: Boolean,
        required: false,
    },
    end:{
        type: Date,
        required: false,
    },
    textColor:{
        type: String,
        required: false,
    },


  },
  {
    timestamps: true,
  }
);

const UserTimeLine = model("UserTimeLine", userTimelineSchema);

module.exports = UserTimeLine;
