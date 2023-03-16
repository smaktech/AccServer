const multer = require("multer");

const FileStorageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public");
	},

	fileFilter: function (req, file, cb) {
		//It would be checked farther.
		// if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
		// 	return cb("File must be an image.");
		// }
		cb(undefined, true);
	},
	filename: (req, file, cb) => {
		cb(null, "videos/" + Date.now() + "---" + file.originalname);
	},
});

const upload = multer({
	storage: FileStorageEngine,
});

module.exports = upload;
