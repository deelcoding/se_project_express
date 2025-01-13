// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
// const mainRouter = require("./routes");
const {errors} = require("./utils/errors")

// Initialize the Express app
const app = express();

// Set the port from the environment or default to 3001
const { PORT = 3001 } = process.env;

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Authorization
app.use((req, res, next) => {
  req.user = {
    _id: "678441f62227b913f6f85ea7",
  };
  next();
});

// Use Router
const routes = require("./routes");
app.use(express.json());

// Routes
app.use(routes);

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
