const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/helpers");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.value);
  const userExists = await User.findOne({ email });
  if (userExists && userExists.googleId) {
    throw new Error("This email is already registered with Google !");
  } else if (userExists) {
    throw new Error("This email is already registered !");
  }
  const user = await User.create({
    name,
    email,
    password: hashPassword(password),
  });
  user.password = undefined;
  const token = generateTokenAndSetCookie(user._id, res);

  res.status(200).json({
    token,
    user,
  });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, googleId: null });
  if (!user) throw new Error("User not found !");
  if (!comparePassword(password, user.password))
    throw new Error("Wrong password !");
  user.password = undefined;
  const token = generateTokenAndSetCookie(user._id, res);

  res.status(200).json({
    token,
    user,
  });
};

module.exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports.update = async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;
  const userToModify = await User.findById(req.user._id);

  if (email != userToModify.email) {
    const checkForEmail = await User.findOne({ email }).select("email");

    if (checkForEmail) {
      throw new Error("User with this email already exists !");
    }
  }

  userToModify.name = name || userToModify.name;
  userToModify.email = email || userToModify.email;

  if (newPassword) {
    const isValid = comparePassword(oldPassword, userToModify.password);
    if (isValid) {
      userToModify.password = hashPassword(newPassword);
      await userToModify.save();
      return res.status(200).json({ message: "Password updated successfully" });
    }
    throw new Error("Wrong password !");
  }
  const user = await userToModify.save();
  user.password = undefined;

  return res
    .status(200)
    .json({ message: "Profile updated successfully", user });
};

module.exports.delete = async (req, res) => {
  await User.deleteOne({ _id: req.user._id });
  return res.status(200).send("User deleted successfully !");
};
