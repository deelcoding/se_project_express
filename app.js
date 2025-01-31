// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/index");
const helmet = require("helmet");

// Initialize the Express app
const app = express();
// Set the port from the environment or default to 3001
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(helmet());
app.use(express.json());
// Routes
app.use("/", routes);

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
