const jwt = require("jsonwebtoken");

const tokengent = (user) => {
  return jwt.sign({ id: user.id }, process.env.SEC, { expiresIn: "40m" });
};
module.exports = tokengent;
