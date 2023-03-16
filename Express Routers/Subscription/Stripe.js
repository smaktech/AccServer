const mongoose = require("mongoose");
// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51K6dnWSHyBlwYpkFndgKCXyoloPOjqmoDznVrlTgGuQVSGs3j4mykWHB8wjWH7f6x2ceMlA3hXexT5VC3wkRlOkS00JM2TFTmB"
);
const express = require("express");
const router = express.Router();
const Subscription = require("./../../models/Subscription");
const UserCourse = require("./../../models/UserCourse");
const createEarning = require("./../../models/createEarning");
const Cart = require("../../models/Cart");

// const YOUR_DOMAIN = "https://acadme.herokuapp.com";
const YOUR_DOMAIN = "http://localhost:4000";

// router.post('/create-checkout-session', async (req, res) => {
//   const { price } = req.body
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: 'test'
//           },
//           unit_amount: price

//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `${YOUR_DOMAIN}/?success=true`,
//     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//   });

//   res.status(200).json({
//     status: true,
//     url: session.url,
//   });

router.post("/create-checkout-session", async (req, res) => {
  // const prices = await stripe.prices.list({
  //   lookup_keys: [req.body.lookup_key],
  //   expand: ['data.product'],
  // });
  const { priceID, quantity, courses, userID, amount } = req.body;
  const sessionID = new mongoose.Types.ObjectId();

  const userCourses = courses.map((courseID) => ({
    userID,
    courseID,
    sessionID,
  }));

  const subscribedCourses = await UserCourse.insertMany(userCourses);

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // price_data: {
        //   currency: "inr",
        //   product_data: {
        //     name: 'test'
        //   },
        //   unit_amount: price

        // },
        price: priceID,
        quantity: quantity,
      },
    ],
    mode: "subscription",
    cancel_url: `${YOUR_DOMAIN}/v1/subcription/checkout_failed?canceled=true&session_id=${sessionID}&userId=${userID}&amount=${amount}`,
    success_url: `${YOUR_DOMAIN}/v1/subcription/checkout_success?success=true&session_id=${sessionID}&userId=${userID}&amount=${amount}`,
  });

  console.log(session," session")
  res.status(200).json({
    status: true,
    url: session.url,
  });
});

router.get("/checkout_success", async (req, res) => {
  const { session_id, subscription_id, userId, amount } = req.query;
  // const session = await stripe.checkout.sessions.retrieve("cs_test_a1hUkL5kel4WlbYj07LbPR5xLhLMefybvqJwj4lIFNTiDjIAZoC8Ak98pK");
  console.log(session," session")
  const subscribedCourse = await UserCourse.updateMany(
    { sessionID: session_id },
    { $set: { status: "success", subscriptionID: subscription_id } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!subscribedCourse.modifiedCount) {
    return res.status(400).json({
      status: false,
      message: "update failed",
    });
  }
  const updatedCourses = await UserCourse.find({ sessionID: session_id });
  const earning = new createEarning({
    userID: userId,
    orderID: "none",
    transactionID: session_id,
    status: true,
    amount,
  });
  if (earning) {
    await earning.save();
  }
  const cart = await Cart.findOne({ userID: userId });
  cart.courses = [];
  await cart.save();
  // res.send(updatedCourses);
  // res.redirect("https://academe.tk/dashboard/payment-success");
  res.redirect("http://localhost:3001/dashboard/payment-success");
});

router.get("/checkout_failed", async (req, res) => {
  const { session_id, subscription_id } = req.query;

  // const subscribedCourse = await Subscription.find({ sessionID: session_id });
  const subscribedCourse = await UserCourse.updateMany(
    { sessionID: session_id },
    { $set: { status: "failed", subscriptionID: subscription_id } },
    {
      new: true,
      runValidators: true,
      multi: true,
    }
  );

  if (!subscribedCourse.modifiedCount) {
    return res.status(400).json({
      status: false,
      message: "update failed",
    });
  }

  const updatedDocuments = await UserCourse.find({ sessionID: session_id });

  res.redirect("http://localhost:3001/app/paymentfailure");
});
module.exports = router;
