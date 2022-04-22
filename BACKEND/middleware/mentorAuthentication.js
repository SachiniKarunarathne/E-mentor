const config = require("config");
const jwt = require("jsonwebtoken");
const { models } = require("mongoose");

module.exports = (req,res,next) => {
  const token = req.header('mentor-authentication-token');
  const decoded= jwt.verify(
    token,
    config.get('jsonWebTokenSecret')
  );
  console.log(decoded);
  req.mentor = decoded.mentor;
  next();
}