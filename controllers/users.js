const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

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

// GET current user
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error({ message: "User not found" });
      error.name = "NotFoundError";
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "NotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// POST users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name, email, and password are required" });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      // Exclude password before sending response
      const userObject = user.toObject();
      delete userObject.password;

      res.send(userObject);
    })
    .catch((err) => {
      console.error("Error creating user:", err);

      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }

      res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// PATCH /users/me — update profile
const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id; // Retrieve the current user's ID from the auth middleware

  if (!name && !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "At least one field (name or avatar) is required" });
  }

  User.findByIdAndUpdate(
    userId,
    { name, avatar }, // Update only the name and avatar fields
    {
      new: true, // Return the updated document
      runValidators: true, // Run validation rules defined in the schema
    }
  )
    // .orFail(() => {
    //   const error = new Error("User not found");
    //   error.name = "NotFoundError";
    //   throw error;
    // })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      console.error("Error updating user:", err);

      if (err.name === "NotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Validation failed", details: err.message });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// POST /login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error("Authentication error:", err.message);
      res.status(UNAUTHORIZED).send({ message: "Incorrect email or password" });
    });
};

// Export controllers
module.exports = { getAllUsers, getCurrentUser, createUser, login, updateUser };
