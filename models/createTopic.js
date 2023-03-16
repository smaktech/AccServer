// const mongoose = require("mongoose");

// const { Schema } = mongoose;

// const topicSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 3,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 5,
//     },
//     mockTestLink: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 5,
//     },
//     examTestLink: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 5,
//     },
//     videoLink: {
//       linkType: {
//         type: String,
//         required: true,
//         enum: ["link", "iframe", "upload"],
//       },
//       linkString: {
//         type: String,
//         required: true,
//       },
//     },
//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//     },
//   },
//   { timestamps: true }
// );

// topicSchema.methods.getUserTopicRes = async function (userID) {
//   const userTopicRes = await UserTopic.findOne({
//     userID,
//     topicID: this._id,
//   });
//   return userTopicRes;
// };

// const Topic = mongoose.model("Topic", topicSchema);

// module.exports = Topic;
