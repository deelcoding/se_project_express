// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");

// Initialize the Express app
const app = express();

app.use(bodyParser.json());

app.use(cors());

// Set the port from the environment or default to 3001
const { PORT = 3001 } = process.env;

// Basic route for testing
app.get("/", (res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Use Router
const routes = require("./routes");

app.use(express.json());
app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

// Routes
app.use(routes);

// Protected routes
app.get("/protected-data", (req, res) => {
  res.send({ message: `Hello, user ${req.user._id}! You are authorized.` });
});

// Connect to MongoDB server
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
