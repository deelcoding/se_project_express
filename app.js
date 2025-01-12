// Import necessary modules
const express = require("express");

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

// Connect to MongoDB server
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
