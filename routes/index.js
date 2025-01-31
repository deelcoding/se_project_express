const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middleware/auth");


router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingRouter);


// Handling non-existent resources
router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Router not found" })
);

module.exports = router;
