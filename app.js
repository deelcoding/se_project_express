// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes");

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

// Use Router
app.use(express.json());

// Authorization
app.use((req, res, next) => {
  req.user = {
    _id: "6784127d451ad46c7ce89cb8",
  };
  next();
});

app.use("/", mainRouter);

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
