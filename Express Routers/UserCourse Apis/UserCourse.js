const express = require("express");
const UserCourse = require("../../models/UserCourse");
const UserTopic = require("../../models/UserTopic");
const { Course } = require("../../models/createCourse");
const stripe = require("stripe")(
  "sk_test_51HtbPdCnK8tRy3ZpUzDKozaA02MdZXxBRqhMCFyoiooDmooqzIU42ZJfQYrQXyMr81fuBRLXKqJILLHqK3RFOu1d00HUouv4Rh"
);
const Earning = require("../../models/createEarning");
const router = express.Router();

// const paymentIntent = await stripe.paymentIntents.create({
//   amount: 2000,
//   currency: "usd",
//   payment_method_types: ["card"],
// });

router.post("/purchaseCourse/:userID/:courseID", async (req, res) => {
  const { userID, courseID } = req.params;

  try {
    const purchasedCourse = await UserCourse.findOne({ userID, courseID });
    if (purchasedCourse) {
      return res.status(200).json({
        status: false,
        message: "This course is already purchased by you.",
        course: purchasedCourse,
      });
    }

    const newUserCourse = new UserCourse({ userID, courseID });

    const userCourse = await newUserCourse.save();

    const subscription = await stripe.subscriptions.create({
      customer: "cus_KmuVeHWBTDchRw",
      items: [{ price: "price_1K7CIcCnK8tRy3Zp2wLoINxO" }],
    });

    userCourse.subscriptionID = subscription.id;

    await userCourse.save();

    // const topics = await Course.findOne({ courseID });
    // const topicIDs = topics.topicIDs;
    // await Promise.all(
    //   topicIDs.map(async (topic) => {
    //     await UserTopic.findOneAndUpdate(
    //       {
    //         userID,
    //         courseID,
    //         topicID: topic._id,
    //       },
    //       {
    //         progress: 0,
    //       },
    //       {
    //         upsert: true,
    //         new: true,
    //         runValidators: true,
    //         setDefaultsOnInsert: true,
    //       }
    //     );
    //   })
    // );
    res.status(201).json({
      status: true,
      message: "Course added to user.",
      courseRes: userCourse,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

router.patch("/cancelSubscription", async (req, res) => {
  const { session_id, userID } = req.query;
  const { message } = req.body;
  try {
    let purchasedCourse = await UserCourse.deleteMany({ userID, session_id });
    let earings = await Earning.findOne({
      userID,
      transactionID: session_id,
    });

    
    earings.cancellationStatus = "canceled";
    earings.cancellationMessage = message;
    earings.cancellationDate = new Date();

    earings = await earings.save();

    res.status(200).json({
      status: true,
      message: "Subscription Canceled successfully",
      cancelSubscription: earings,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

router.patch("/refundForSubscription", async (req, res) => {
  const { session_id, userID } = req.query;
  try {
    let earings = await Earning.findOne({
      userID,
      transactionID: session_id,
    });

    earings.cancellationStatus = "refunded";
    earings = await earings.save();

    res.status(200).json({
      status: true,
      message: "Subscription refunded successfully",
      refundSubscription: earings,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

router.post("/startCourse/:userID/:courseID", async (req, res) => {
  const { userID, courseID } = req.params;

  try {
    const userCourse = await UserCourse.findOneAndUpdate(
      {
        userID,
        courseID,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: "courseID",
        populate: {
          path: "subjectID classesID boardID",
        },
      })
      .exec();

    const topicIDs = userCourse.courseID.topicIDs;

    const topicsRes = await Promise.all(
      topicIDs.map(async (topic) => {
        return await UserTopic.findOneAndUpdate(
          {
            userID,
            courseID,
            topicID: topic._id,
          },
          {},
          {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        ).populate({
          path: "topicID",
        });
      })
    );

    res.status(201).json({
      status: true,
      message: "Course added to user.",
      course: userCourse,
      topics: topicsRes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "user Response create failed",
    });
  }
});

router.post("/startTopic/:userID/:topicID", async (req, res) => {
  const { userID, topicID } = req.params;
  try {
    const userTopic = await UserTopic.findOneAndUpdate(
      {
        userID,
        topicID,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "user topic Response create failed",
    });
  }
});

//  user's last 3 visited course
router.get("/recentCourses/:userID", async (req, res) => {
  try {
    const courses = await UserCourse.find({
      userID: req.params.userID,
      status: "success",
    })
      .sort({
        updatedAt: -1,
      })
      .limit(3);

    if (!courses || !courses.length) {
      return res.status(404).json({
        status: false,
        message: "User Courses Not found",
      });
    }

    res.status(200).json({
      status: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
const mongoose = require("mongoose");
// get all user courses progress
router.get("/courseUserProgresses/:userID", async (req, res) => {
  try {
    const pro = await UserCourse.find({
      userID: req.params.userID,
      status: "success",
    }).populate({
      path: "courseID",
      select: "name",
    });
    res.send(pro);
  } catch (error) {
    res.send(error.message);
  }
});

// get all user course
router.get("/getAllUserCourses/:userID", async (req, res) => {
  const query = {
    userID: req.params.userID,
    status: "success",
  };
  try {
    const userCourses = await UserCourse.find(query).populate({
      path: "courseID",
      populate: {
        path: "boardID classesID subjectID",
        select: "name",
      },
    });
    if (!userCourses) {
      return res.status(404).json({
        status: false,
        message: "User Courses Not found",
      });
    }
    res.status(200).json({
      status: true,
      courses: userCourses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
});

// get all user course purchased in a single transaction
router.get("/getAllUserCoursesBySessionId/:userID/:sessionID", async (req, res) => {
  const query = {
    userID: req.params.userID,
    sessionID: req.params.sessionID,

    status: "success",
  };
  try {
    const userCourses = await UserCourse.find(query).populate({
      path: "courseID",
      populate: {
        path: "boardID classesID subjectID",
        select: "name",
      },
    });
    if (!userCourses) {
      return res.status(404).json({
        status: false,
        message: "User Courses Not found",
      });
    }
    res.status(200).json({
      status: true,
      courses: userCourses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server Error "+error.message,
    });
  }
});

module.exports = router;
