const {
  Schema,
  model,
  SchemaTypes: { ObjectId },
} = require("mongoose");

const cartSchema = new Schema(
  {
    userID: {
      type: ObjectId,
      ref: "Admin",
      required: true,
    },
    courses: [
      {
        type: ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = model("Cart", cartSchema);

module.exports = Cart;
