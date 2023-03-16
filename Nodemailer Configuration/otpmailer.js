const nodemailer = require("nodemailer");
const fs = require("fs");

const hbs = require("nodemailer-express-handlebars");

module.exports = (mail, otp) => {
	const main = async () => {
		// async..await is not allowed in global scope, must use a wrapper

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "barbertest035164@gmail.com",
				pass: "Sidharth@2000",
			},
		});

		// transporter.use('compile',hbs({
		//     viewEngine: 'express-handlebars',
		//     viewPath: './views'
		// }))

		var mailSidhath = "Academy App";

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: "barbertest035164@gmail.com", // sender address
			to: mail, // list of receivers
			subject: "Test Series App", // Subject line
			// text: "OTP", // plain text body
			html:
				"<h2>Validation Link for account verification is </h2>" +
				"<p style='font-weight:bold;'>" +
				otp +
				"</p>", // html body

			// template: ''
		});

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	};
	main();
};
