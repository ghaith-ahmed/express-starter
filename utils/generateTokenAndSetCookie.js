const jwt = require("jsonwebtoken");

module.exports = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "90d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 60000 * 60 * 24 * 90,
    sameSite: "strict",
  });

  return token;
};
