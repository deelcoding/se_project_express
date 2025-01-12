const router = require("express").Router();

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/clothingItems", clothingRouter);

module.exports = router;
