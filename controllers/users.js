const User = require("../models/user");

// GET /users
const getAllUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error("No Users Found");
      error.name = "NotFoundError";
      throw error;
    })
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error retrieving users", error: err.message });
    });
};

// GET /users by ID
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.name = "NotFoundError";
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .json({ message: "Error creating user", error: err.message });
      } else if (err.name === "CastError") {
        return res
          .status(400)
          .json({ message: "Error creating user", error: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error creating user", error: err.message });
    });
};

// POST users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  console.log("Creating user with:", { name, avatar });

  User.create({ name, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      console.error("Error creating user:", err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Error creating user", error: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error creating user", error: err.message });
    });
};

// Export controllers
module.exports = { getAllUsers, getUser, createUser };
