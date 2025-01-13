const router = require("express").Router();
const { getAllUsers, getUserById, createUser } = require("../controllers/users");

// Routes
router.get("/", getAllUsers);
router.get("/:userId", getUserById);
router.post("/", createUser);

// Export router
module.exports = router;
