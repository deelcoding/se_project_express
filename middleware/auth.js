const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config"); // Adjust path to your config file
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET); // Verify the token
    req.user = payload; // Add token payload to the request object
    next(); // Pass control to the next middleware/route handler
  } catch (err) {
    console.error("Authorization error:", err.message);
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }
};

module.exports = auth;
