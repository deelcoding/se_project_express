const express = require("express");
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
