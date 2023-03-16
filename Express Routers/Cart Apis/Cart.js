const Cart = require("../../models/Cart");

const router = require("express").Router();

router.post("/add", async (req, res) => {
  let cart;
  const { userID, courseID } = req.body;
  try {
    cart = await Cart.findOne({ userID });
    if (!cart) {
      const courses = [courseID];
      cart = new Cart({ userID, courses });
      await cart.save();
      return res.status(201).json({
        status: true,
        cart,
      });
    }
    if (!cart.courses.includes(courseID)) {
      cart.courses.push(courseID);
    }
    await cart.save();
    res.status(200).json({
      status: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

router.patch("/remove", async (req, res) => {
  const { userID, courseID } = req.body;
  try {
    const cart = await Cart.findOne({ userID });
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "you have no cart",
      });
    }
    const updatedCart = await Cart.findOneAndUpdate(
      { userID },
      { $pull: { courses: courseID } },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "course Removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

router.get("/all/:userID", async (req, res) => {
  const { userID } = req.params;
  try {
    const cart = await Cart.findOne({ userID });
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "you have no cart",
      });
    }
    res.status(200).json({
      status: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
