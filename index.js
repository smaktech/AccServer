console.log("Hello Student Developer");

// ------------------------All files ---------------------------------

const express = require("express");
const loginRoute = require("./Express Routers/Auth/Auth");
const createCourse = require("./Express Routers/Course Apis/Course");
const createSubject = require("./Express Routers/Subject Apis/Subject");
const createQualification = require("./Express Routers/Qualification Apis/Qualification");
const createBoard = require("./Express Routers/Board Apis/Board");
const createEvaluation = require("./Express Routers/Evaluation Apis/evaluation");
const createAnswer = require("./Express Routers/Answer Apis/answer");
const createStudentEval = require("./Express Routers/Studenteval Apis/studenteval");
const createStdEvalAnswer = require("./Express Routers/StudentEvalAns Apis/studentevalans");
const createQuestion = require("./Express Routers/Question Apis/question");
const createSubBoard = require("./Express Routers/SubBoard Apis/SubBoard");
const createClasses = require("./Express Routers/Classes Apis/Classes");
const createTopic = require("./Express Routers/Topic Apis/Topic");
const createSubTopic = require("./Express Routers/SubTopic Apis/SubTopic");
const createResource = require("./Express Routers/Resource Apis/Resource");
const createEarning = require("./Express Routers/Earning Apis/Earning");
const createCMS = require("./Express Routers/CMS Apis/CMS");
const createFaq = require("./Express Routers/Faq Apis/Faq");
const createDownload = require("./Express Routers/DownloadedResource/DownloadedResource");
const UserCourse = require("./Express Routers/UserCourse Apis/UserCourse");
const UserTopic = require("./Express Routers/UserTopic Apis/UserTopic");
const subscription = require("./Express Routers/Subscription/Stripe");
const userNote = require("./Express Routers/UserNote Apis/UserNote");
const exam = require("./Express Routers/Exam Apis/Exam");
const timeline = require("./Express Routers/TimeLine/TimeLine");
const cart = require("./Express Routers/Cart Apis/Cart");
const userTimeline = require("./Express Routers/UserTimeline/userTimeline");

const mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
const YAML = require("yamljs");

const swaggerUI = require("swagger-ui-express");

const swaggerJsDocs = YAML.load("./api.yaml");

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// -------------------end_here----------------------------------------------

//-------------------------Dotenv Manager --------------------
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT;
const db = process.env.DB;

// closing dotenev files

// ----------------------------connecting the Database ----------------------------------

mongoose.connect(db, () => {
  console.log("Database in connected Successfully");
});

// --------------------------closing ----------------------------------------------------------

// ------------------------------------------close------------------------------------------------

// ------------------------------Opening then express server --------------------------

const app = express();
app.use(express.static("public"));

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//Routes for the express server

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

const adminRoute = require("./Express Routers/Auth/admin");

app.use("/v1/auth", loginRoute);
app.use("/v1/admin", adminRoute);
app.use("/v1/course", createCourse);
app.use("/v1/answer", createAnswer);
app.use("/v1/subject", createSubject);
app.use("/v1/qualification", createQualification);
app.use("/v1/studenteval", createStudentEval);
app.use("/v1/studentevalans", createStdEvalAnswer);
app.use("/v1/board", createBoard);
app.use("/v1/evaluation", createEvaluation);
app.use("/v1/question", createQuestion);
app.use("/v1/subBoard", createSubBoard);
app.use("/v1/topic", createTopic);
app.use("/v1/subTopic", createSubTopic);
app.use("/v1/Classes", createClasses);
app.use("/v1/resource", createResource);
app.use("/v1/earning", createEarning);
app.use("/v1/cms", createCMS);
app.use("/v1/faq", createFaq);
app.use("/v1/download", createDownload);
app.use("/v1/userCourse", UserCourse);
app.use("/v1/userTopic", UserTopic);
app.use("/v1/subcription", subscription);
app.use("/v1/userNote", userNote);
app.use("/v1/exam", exam);
app.use("/v1/timeline", timeline);
app.use("/v1/cart", cart);
app.use("/v1/userTimeline", userTimeline);

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});

// -------------------------------Closing the server----------------------------------------
