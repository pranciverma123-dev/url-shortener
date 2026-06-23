const User = require("../model/user");
const bcrypt = require("bcrypt");
const { setUser } = require("../services/auth");
// const crypto = require("crypto");


const redisClient = require("../config/redis");
const sendEmail = require("../utils/sendEmail");
// ================= SIGNUP =================
async function handleusersignup(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(409).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = setUser(user);

    res.cookie("uid", token, {
      httpOnly: true,
      secure: false, // production me true karna
    });

    return res.status(201).send("Signup successful");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Signup Failed");
  }
}

// ================= LOGIN =================
async function handleuserLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid Password");
    }

    const token = setUser(user);

    res.cookie("uid", token, {
      httpOnly: true,
      secure: false,
    });

    return res.send("Login Successful");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Login Failed");
  }
}

// ================= LOGOUT =================
async function handleuserLogout(req, res) {
  try {
    res.clearCookie("uid");
    return res.send("Logout Successful");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Logout Failed");
  }
}
const crypto = require("crypto");

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    // 👉 (normally email send hota hai, abhi response me bhej rahe)
    return res.json({
      message: "OTP sent successfully",
      otp: otp, // remove in production
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send("Error in forgot password");
  }
}


async function resetPassword(req, res){
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  await redisClient.del(email);

  res.json({ message: "Password reset successful" });
};

module.exports = {
  handleuserLogin,
  handleusersignup,
  handleuserLogout,
  resetPassword,
  forgotPassword,

};  
