const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config"); // Adjust path to your config file
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
    }
    req.user = payload;
    next();
  });
};

module.exports = auth;
