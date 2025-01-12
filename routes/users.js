const router = require("express").Router();
const { getAllUsers, getUser, createUser } = require("../controllers/users");

// Routes
router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

// Export router
module.exports = router;
