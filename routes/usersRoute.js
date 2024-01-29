const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  update,
  delete: deleteUser,
} = require("../controllers/usersController");
const tryCatch = require("../utils/tryCatch");
const passport = require("passport");
const Joi = require("joi");
const validateRequest = require("../middleware/validateRequest");

const registerSchema = Joi.object({
  name: Joi.string().required().max(12),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(5),
});
router.post("/register", validateRequest(registerSchema), tryCatch(register));
const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
router.post("/login", validateRequest(loginSchema), tryCatch(login));
const updateSchema = Joi.object({
  name: Joi.string().max(12),
  email: Joi.string().email(),
  oldPassword: Joi.string().min(5),
  newPassword: Joi.string().min(5),
});
router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  validateRequest(updateSchema),
  tryCatch(update)
);
router.get(
  "/youruser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => res.json(req.user)
);
router.post("/logout", tryCatch(logout));
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  tryCatch(deleteUser)
);

// google oauth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.cookie("jwt", req.user, {
      httpOnly: true,
      maxAge: 60000 * 60 * 24 * 90,
      sameSite: "strict",
    });
    res.redirect(`${process.env.GOOGLE_SUCCESS_URL}/${req.user}`);
  }
);
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("Protected route !");
  }
);

module.exports = router;
