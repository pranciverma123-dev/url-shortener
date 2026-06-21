const express = require("express");
const router = express.Router();

const {
 handleusersignup,
  handleuserLogin,
  handleuserLogout,
  resetPassword,
  forgotPassword
} = require("../controller/user");

router.post("/signup", handleusersignup);

router.post("/login", handleuserLogin);

router.post("/logout", handleuserLogout);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password",resetPassword);
module.exports = router;