const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const HttpStatus = require("http-status-codes");

const app = express();

// load environment variables from the given file
dotenv.config({ path: ".env.development.local" });

// connect mongoose to mongodb
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sturdy-authenticator";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true });

// allow cross origin resource sharing from any origin
app.use(cors());

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// logs all requests to the console
app.use((req, res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});

// listen to requests
app.set("port", process.env.PORT || 4000);
process.title = "node-app";
const server = app.listen(app.get("port"), () => {
  console.log(`Server started on port ${app.get("port")}`);
  console.log(`Process Id: ${process.pid}`);
  console.log(`Process Name: ${process.title}`);
});

// ***********************************************************************
// routes for authenticate api
const authenticationRouter = require("./routes/authentication");
app.use("/api/authentication", authenticationRouter);
// ***********************************************************************

// if not matched with any of the above end points
app.get("*", (req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "Error : Invalid end-point"
  });
});

app.post("*", (req, res) => {
  res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
    success: false,
    message: "Error : Invalid end-point"
  });
});

app.put("*", (req, res) => {
  res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
    success: false,
    message: "Error : Invalid end-point"
  });
});

app.delete("*", (req, res) => {
  res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
    success: false,
    message: "Error : Invalid end-point"
  });
});
