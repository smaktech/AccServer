const express = require("express");
const { Admin } = require("../../models/Auth");
const AdminValidator = require("../../Validators/adminValidator");
const resumeAuth = require("../Auth/getUsers");
const crypto = require("crypto");
const upload = require("../../middlewares/multer");
const jwt = require("jsonwebtoken");

const generateJWT = require("../../utils/generateJWT");
const verifyPass = require("../../utils/verifyPassword");
const hashPassword = require("../../utils/passwordHash");
const { socialLogin } = require("../../models/socialLogin");
const otpAlgorithm = require("../../otpAlgorithm/otp");
const mailer = require("../../Nodemailer Configuration/otpmailer");
const mailthis = require("../../Nodemailer Configuration/nodemailer");
const adminValidator = require("../../Validators/adminValidator");

const { hash, genSalt } = require("bcrypt");
const fs = require('fs');

const nodemailer = require("../../Nodemailer Configuration/otpmailer");
const otp = require("../../otpAlgorithm/otp");
const adminPart = require("./admin");

const passwordHash = require("../../utils/passwordHash");

const router = express.Router();

//login Api for the academy app

router.post("/login", async (req, res) => {
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

      const admin = await Admin.findOne({ email: email });
      if (!admin) {
        res.status(404).json({
          status: false,
          message: "User not Found",
        });
      } else {
        //else verify the password
        const passVerifier = await verifyPass(password, admin.password);

        if (!passVerifier) {
          //if it ggives the error then will return error
          res.status(401).json({
            status: false,
            message: "Invalid Username or password",
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

//social Login Api for the acedmy app
router.post("/socialLogin", async (req, res) => {
  //request fields
  const { name, email, phoneNumber, school, loginType } = req.body;
  const data = { phoneNumber, school };

  //validation of hte request body

  const resultFromJoi = await adminValidator(" phoneNumber school", data);

  if (!resultFromJoi) {
    //return error if validation fails
    res.status(401).json({
      status: false,
      message: "Invalid Credential Details",
    });
  } else {
    try {
      //will create the new user for the user. We need no passwords because evrrything will be get validated as it is social login

      const user = await socialLogin.findOne({ email: email });
      if (user) {
        //if user already present then will return login successful

        res.status(200).json({
          status: true,
          message: "Login Successfull!",
          accessToken: generateJWT(user),
        });
      } else {
        // generate the new user and add it to the db
        const newUser = await new socialLogin({
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          school: school,
          loginType: loginType,
        });

        if (!newUser) {
          //if there is some error in the code then it throws an error
          res.status(500).json({
            status: false,
            message: "Social Login Not created!!",
          });
        } else {
          //user gets saved in the database and the true response is returned
          await newUser.save();
          res.status(200).json({
            status: true,
            message: "Signup Successful!!",
            accessToken: generateJWT(newUser),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
});

//update Password api for the academy app
router.post("/updatePassword", async (req, res) => {
  const { email, newPassword } = req.body;

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
      if (!user) {
        res.status(404).json({
          status: false,
          message: "User not Found",
        });
      } else {
        //verifying the password

        //Generating hash for the password
        const { generateSalt, generateHash } = await hashPassword(newPassword);
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
    } catch (error) {
      console.log(error);
    }
  }
});

//update Name User
router.put("/updateNameUser/:userID", async (req, res) => {
  const { name } = req.body; //getting name through the request

  try {
    //fnding if user id exists

    const userFind = await Admin.findOne({ _id: req.params.userID });
    if (!userFind || userFind.typeUser != 2) {
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
        message: "Name Uodated Successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/updatePasswordUser", async (req, res) => {
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
      if (!user || user.typeUser != 2) {
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

//decrypt access Token
router.post('/decryptJWT', async (req, res)=>
{
  const token = req.body.accessToken;

    
    const publicKey = fs.readFileSync("JWT_keys/public.key"); //will read the public key viewing the token

    
    

    try {
      const decrypt = await jwt.verify(token, publicKey); //decrypting the token using the keys
  
      if (!decrypt) {
        res.status(200).json(
          {
            status: false,
            message: "Decryption Error"
          }
        )
      } else {


        res.status(200).json(
          {
            status: true,
            data: decrypt
          }
        )

      }
    } catch (error) {
      throw new Error(`Dycription ERROR : ${error}`);
      res.send(error);
    }
    
    


      
  
      
    
    
    
 
})

//signup API

router.post("/signupTest", async (req, res) => {
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
          message: "User Already Present!!",
        });
      } else {
        //generatng hash for the password

        const { generateSalt, generateHash } = await passwordHash(password);
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
            typeUser: 2,
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
              message: "User Is Created!",
              name: newUser.name,
              email: newUser.email,
              phoneNumber: newUser.phoneNumber,
              school: newUser.school,
              referral: newUser.referral,
              accessToken: generateJWT(newUser),
              user: newUser,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
});

//forgot Password APi
router.post("/sendOTP", async (req, res) => {
  //Getting the user mail
  const { email } = req.body;

  try {
    //checking if mail exists
    const user = await Admin.findOne({ email: email });
    if (!user) {
      //if not user throw an error
      res.status(404).json({
        status: false,
        message: "User Not Found",
      });
    } else {
      //if user present generate otp and send to the mail

      const token = crypto.randomBytes(32).toString("hex");

      if (!token) {
        //if there is no token generated then it will throw internal server error
        res.status(500).json({
          status: false,
          message: "User Token Not Created",
        });
      } else {
        //adding the otp to the the requested users database
        const otpUpdate = await Admin.updateMany(
          { _id: user._id },
          {
            tokenAuth: {
              token: token,
              time: Date.now(),
            },
          },
          {
            runValidators: true,
            new: true,
          }
        );

        const link = `${process.env.BASE_URL}password-reset/${user._id}/${token}`;

        await mailthis(email, link);
        //returning the response that the mail is sent to the registered mail id
        res.status(200).json({
          status: true,
          message: "OTP is sent to the registered mail ID",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

//upload Profile Image

router.put(
  "/addProfileUser/:userID",
  upload.single("imageProfile"),
  async (req, res) => {
    console.log(req.file);

    try {
      const user = await Admin.findOne({ _id: req.params.userID });

      if (!user || user.typeUser != 2) {
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

router.post("/password-reset/:userID/:token", async (req, res) => {
  const { newPassword } = req.body;
  //getting the users info
  try {
    const user = await Admin.findOne({
      _id: req.params.userID,
      "tokenAuth.token": req.params.token,
    });
    if (!user) {
      //if not user
      res.status(404).json({
        status: false,
        message: "User Not Found",
      });
    } else {
      //checking the time constraints
      if (Date.now() - user.tokenAuth.time > 9000000) {
        //if not enough time
        res.status(410).json({
          status: false,
          message: "OTP Expired!!",
        });
      } else {
        //if otp is present in the database then it will be treated as verified

        if (req.params.token === user.tokenAuth.token) {
          const { generateHash, generateSalt } = await hashPassword(
            newPassword
          );
          if (!generateHash) {
            res.status(500).json({
              status: false,
              message: "Hash Not Generated",
            });
          } else {
            const userUpdatePassword = await Admin.updateMany(
              { _id: req.params.userID },
              {
                password: generateHash,
                salt: generateSalt,
                tokenAuth: {},
              }
            );
            res.status(200).json({
              status: true,
              message: "Password is Updated Successfully",
              id: user._id,
            });
          }
        } else {
          //else will return false
          res.status(401).json({
            status: false,
            message: "OTP Not verified",
            id: user._id,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/adminSignup", async (req, res) => {
  const { email, password, userName } = req.body;

  const data = { email, password, userName };
  const resultFromJoi = adminValidator("email password userName", data);

  if (!resultFromJoi) {
    res.status(400).json({
      status: false,
      message: "Invalid Credential Details",
      NOTE: "email must be email and password must be 8 characters long",
    });
  } else {
    try {
      const admin = await Admin.findOne({
        email: email,
      });
      if (admin) {
        res.status(403).json({
          status: false,
          message: "User ALready Exists",
        });
      } else {
        const { generateHash, generateSalt } = await hashPassword(password);

        if (!generateHash) {
          res.status(500).json({
            status: false,
            message: "Hash not generated!!",
          });
        } else {
          const user = await new Admin({
            userName: userName,
            email: email,
            password: generateHash,
            salt: generateSalt,
            typeUser: 0,
          });

          if (!user) {
            res.status(500).json({
              status: false,
              message: "User not Created",
            });
          } else {
            const wallet = await new Wallet({
              userID: user._id,
            });
            if (!wallet) {
              res.status(500).json({
                status: false,
                message: "Wallet Not Created!!",
              });
            } else {
              const referral = await new Referral({
                userID: user._id,
                email: user.email,
                referralCode: referralCode(),
              });
              await referral.save();

              await wallet.save();
              await user.save();

              res.status(200).json({
                status: true,
                message: "Signup Successful!!",
                accessToken: generateJWT(user),
                admin: user,
              });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
});
router.put("/changeStatus/:userID", async (req, res) => {
  const { status } = req.body;

  try {
    const user = await Admin.findOne({ _id: req.params.userID });
    if (!user) {
      res.status(200).json({
        status: false,
        message: "User Not Found",
      });
    } else {
      try {
        const statusUpdate = await Admin.updateOne(
          { _id: req.params.userID },
          {
            isActive: status,
          }
        );

        const statusReferral = await Referral.updateOne(
          { userID: req.params.userID },
          {
            isActive: status,
          }
        );
        if (status === "false") {
          res.status(200).json({
            status: true,
            message: "User Is Disabled!!",
            details: user,
          });
        } else {
          res.status(200).json({
            status: true,
            message: "User is Enabled!",
            details: user,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.use(resumeAuth); //getting the users
router.use(adminPart); //getting the user part

module.exports = router;
