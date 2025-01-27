const express = require("express");
const {
  getAllUsers,
  getCurrentUser,
  createUser,
  login,
  updateUser,
} = require("../controllers/users");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/users", auth, getAllUsers);
router.get("/users/me", auth, getCurrentUser);
router.post("/users", createUser);
router.post("/signup", createUser);
router.post("/signin", login);
router.patch("/users/me", auth, updateUser);

module.exports = router;
