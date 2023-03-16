const express = require("express");
const router = express.Router();
const { Admin } = require("../../models/Auth");
const adminValidator = require("../../Validators/adminValidator");
const verifyPass = require("../../utils/verifyPassword");
const generateJWT = require("../../utils/generateJWT");
const hashPassword = require("../../utils/passwordHash");
const upload = require("../../middlewares/multer");
const fs = require("fs");

//admin login

router.post("/signupAdmin", async (req, res) => {
	//req credentials
	const { name, email, password, phoneNumber, school } = req.body;

	//validations

	const resultFromJoi = await adminValidator(
		"name email password phoneNumber school",
		req.body
	);
	if (!resultFromJoi) {
		res.status(400).json({
			status: false,
			message: "Invalid Credential Details",
			email: "Email must be email",
			name: "name must be atleast 3 characters long",
			passswod: "Password must be 8 characters Long",
		});
	} else {
		//checking if user already exists
		try {
			const userFind = await Admin.findOne({ email: email });
			if (userFind) {
				res.status(403).json({
					status: false,
					message: "Admin Already Present!!",
				});
			} else {
				//generatng hash for the password

				const { generateSalt, generateHash } = await hashPassword(password);
				if (!generateHash) {
					res.status(500).json({
						status: false,
						message: "Password is not Hashed",
					});
				} else {
					//creating the user

					const newUser = await new Admin({
						name: name,
						email: email,
						password: generateHash,
						salt: generateSalt,
						typeUser: 0,
						phoneNumber: phoneNumber,
						school: school,
					});
					if (!newUser) {
						res.status(500).json({
							stautus: false,
							message: "User not Created",
						});
					} else {
						//will save the user in the databae and return the response withh the jwt token

						await newUser.save();

						res.status(200).json({
							status: true,
							message: "Admin Is Created!",
							name: newUser.name,
							email: newUser.email,
							phoneNumber: newUser.phoneNumber,
							school: newUser.school,
							referral: newUser.referral,
							accessToken: generateJWT(newUser),
						});
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
});

//login api for the admin

router.post("/loginAdmin", async (req, res) => {
	const { email, password } = req.body;

	const data = { email, password };

	//validating the data using resultfrom joi

	const resultFromJoi = adminValidator("email password", data);

	if (!resultFromJoi) {
		//if the result is false
		res.status(400).json({
			status: false,
			message: "Invalid Credential Details",
			Note: "email must be email and password must be 8 characters long",
		});
	} else {
		//if the result is true
		try {
			//find the user with the request email if it exists then return user not found

			const admin = await Admin.findOne({
				$and: [{ email: email }, { typeUser: 0 }],
			});
			if (!admin) {
				res.status(404).json({
					status: false,
					error: "email",
					message: "The email address entered does not match our records",
				});
			} else {
				//else verify the password
				const passVerifier = await verifyPass(password, admin.password);

				if (!passVerifier) {
					//if it ggives the error then will return error
					res.status(401).json({
						status: false,
						error: "Password",
						message: "The email address and password do not match",
					});
				} else {
					//Generating JWT token
					const newJWT = await generateJWT(admin);
					if (!newJWT) {
						//if JWT fails then error
						res.status(500).json({
							status: false,
							message: "JWT Not Created",
						});
					} else {
						//return the success response
						res.status(200).json({
							status: true,
							message: "Login Successful",
							accessToken: newJWT,
							user: admin,
						});
					}
				}
			}
		} catch (error) {
			//will catch error if present

			console.log(error);
		}
	}
});

//update Password admin
router.post("/updatePasswordAdmin", async (req, res) => {
	const { email, password, newPassword } = req.body;

	const data = { email, newPassword };

	//validation

	const verifier = adminValidator("email newPassword", data);

	if (!verifier) {
		//if false then throws validation error
		res.status(400).json({
			status: false,
			message: "Invalid Cedential Details",
			email: "email must be an email",
		});
	} else {
		//finds the user checks the password and updates there password
		try {
			const user = await Admin.findOne({ email: email });
			if (!user || user.typeUser != 0) {
				res.status(404).json({
					status: false,
					message: "User not Found",
				});
			} else {
				//verifying the password

				const verify = await verifyPass(password, user.password);

				if (!verify) {
					res.status(200).json({
						status: false,
						message: "Invalid Password",
					});
				} else {
					//Generating hash for the password
					const { generateSalt, generateHash } = await hashPassword(
						newPassword
					);
					if (!generateHash) {
						//throws an error if not hash not created
						res.status(500).json({
							status: false,
							message: "Hash Not Created",
						});
					} else {
						//updates the password
						try {
							const updatePassword = await Admin.updateMany(
								{ email: email },
								{
									password: generateHash,
									salt: generateSalt,
								}
							);

							if (!updatePassword) {
								res.status(500).json({
									status: false,
									message: "Password is not updated!!",
								});
							} else {
								//returns the true response true
								res.status(200).json({
									status: true,
									message: "Password is Updated Successfully",
								});
							}
						} catch (error) {
							console.log(error);
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
});

//update name of the user

router.put("/updateNameAdmin/:userID", async (req, res) => {
	const { name } = req.body; //getting name through the request

	try {
		//fnding if user id exists

		const userFind = await Admin.findOne({ _id: req.params.userID });
		if (!userFind || userFind.typeUser != 0) {
			//throes error if fails to find
			res.status(404).json({
				status: false,
				message: "User not Found",
			});
		} else {
			//else updates the user
			const updateUser = await Admin.updateMany(
				{ _id: req.params.userID },
				{
					name: name,
				}
			);

			res.status(200).json({
				status: true,
				message: "Name Updated Successfully",
			});
		}
	} catch (error) {
		console.log(error);
	}
});

//upload Profile Image

router.put(
	"/addProfileAdmin/:userID",
	upload.single("imageProfile"),
	async (req, res) => {
		console.log(req.file);

		try {
			const user = await Admin.findOne({ _id: req.params.userID });

			if (!user || user.typeUser != 0) {
				res.status(404).json({
					status: false,
					message: "Admin Not Found",
				});
			} else {
				try {
					fs.unlinkSync(user.profileImage);
				} catch (error) {
					console.log(error);
				}
				try {
					const userUpdate = await Admin.updateMany(
						{ _id: req.params.userID },
						{
							profileImage: req.file.filename,
						}
					);

					res.status(200).json({
						status: true,
						message: "Profile Updated!!",
						imagePath: req.file.filename,
					});
				} catch (error) {
					console.log(error);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
);
router.post("/changeUserStatus/:userID", async (req, res) => {
	const { isActive } = req.body;
	try {
		const user = await Admin.updateOne(
			{ _id: req.params.userID },
			{
				isActive: isActive,
			}
		);

		res.status(200).json({
			status: true,
			message: "User is updated",
			isActive: isActive,
		});
	} catch (error) {
		console.log(error);
	}
});

//delete User By ID

router.delete("/deleteUser/:userID", async (req, res) => {
	try {
		const user = await Admin.findOne({ _id: req.params.userID });
		if (!user) {
			res.status(404).json({
				status: false,
				message: "User not found",
			});
		} else {
			const deletUser = await Admin.findOneAndDelete({
				_id: req.params.userID,
			});
			if (!deletUser) {
				res.status(500).json({
					status: false,
					message: "user is not Deleted",
				});
			} else {
				res.status(200).json({
					status: true,
					message: "User is deleted Successfully",
					userID: req.params.userID,
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
