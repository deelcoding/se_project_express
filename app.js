// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();

// Initialize the Express app
const app = express();
// Set the port from the environment or default to 3001
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(requestLogger);
// Routes
app.use("/", routes);

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

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
