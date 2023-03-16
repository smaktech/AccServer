const multer = require("multer");
const path = require("path");

const FileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },

  fileFilter: function (req, file, cb) {
    console.log(file);
    if (path.extname(file.originalname) !== ".zip") {
      return cb(new Error("Only zip files are allowed"));
    }

    cb(null, true);
  },
  filename: (req, file, cb) => {
    cb(null, "exams/" + Date.now() + "---" + file.originalname);
  },
});

const upload = multer({
  storage: FileStorageEngine,
});

module.exports = upload;
