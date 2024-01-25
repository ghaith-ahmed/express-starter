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

router.post("/register", tryCatch(register));
router.post("/login", tryCatch(login));
router.post("/logout", tryCatch(logout));
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  tryCatch(deleteUser)
);
router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  tryCatch(update)
);
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
    res.sendStatus(200);
  }
);
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
