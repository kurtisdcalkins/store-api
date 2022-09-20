require("dotenv").config();
//  Async errors
require("express-async-errors");

// Require and instantiate express
const express = require("express");
const app = express();

// Require in the connection to the database function and the router
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

// Require in the middleware for the errors
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/not-found");

//  Middleware
app.use(express.json());

// Routes
// There is no front-end, so the route will display what's sent here
app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">Product Route</a>');
});

app.use("/api/v1/products", productsRouter);

// Products route
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Port
const port = process.env.PORT || 3000;

// Connect to server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

// Start server
start();
