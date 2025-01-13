const router = require("express").Router();
const errors = require("../utils/errors");
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingRouter);

// Handling non-existent resources
router.use((req, res) => {
  errors.NOT_FOUND.send({ message: "Router not found" });
});

module.exports = router;
