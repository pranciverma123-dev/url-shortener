const jwt = require("jsonwebtoken");

const secret = "pranci$@12";

function setUser(user) {
  return jwt.sign(
    {
      uid: user._id.toString(), // ✅ FIXED
      email: user.email,
    },
    secret,
    { expiresIn: "5h" }
  );
}

function getUser(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

module.exports = { setUser, getUser };