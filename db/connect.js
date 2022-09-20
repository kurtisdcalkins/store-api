const mongoose = require("mongoose");

// Function to connect to the mongoDB database
const connectDB = (url) => {
  return mongoose.connect(url, {
    // These are to remove the exceptions in the terminal
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
