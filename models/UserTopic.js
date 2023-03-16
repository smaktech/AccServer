const mongoose = require("mongoose");
const UserCourse = require("./UserCourse");
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const userTopicSchema = new Schema(
  {
    userID: {
      type: ObjectId,
      ref: "Admin",
      required: true,
    },
    courseID: {
      type: ObjectId,
      ref: "Course",
      required: true,
    },
    topicID: {
      type: ObjectId,
      ref: "Topic",
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userTopicSchema.post("save", async function () {
  try {
    const { userID, courseID } = this;
    const allTopics = await UserTopic.find({ userID, courseID });

    const progress =
      allTopics.reduce((acc, cur) => cur.progress + acc, 0) / allTopics.length;

    const userCourse = await UserCourse.findOne({ userID, courseID });

    userCourse.progress = progress;

    const c = await userCourse.save();
  } catch (error) {
    console.log(error.message);
  }
});

const UserTopic = model("UserTopic", userTopicSchema);
module.exports = UserTopic;
