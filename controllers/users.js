const { User } = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// GET /users
const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// GET /users by ID
const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.name = "NotFoundError";
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Error creating user" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Error creating user" });
      }
      return res.status(SERVER_ERROR).send({ message: "Error creating user" });
    });
};

// POST users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name) {
    return res.status(BAD_REQUEST).send({ message: "Name is required" });
  }

  console.log("Creating user with:", { name, avatar });

  return User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error("Error creating user");
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Error creating user" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

// Export controllers
module.exports = { getAllUsers, getUserById, createUser };
