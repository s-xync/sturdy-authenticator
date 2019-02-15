const mongoose = require("mongoose");

const forgotPasswordSessionSchema = mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  }
});

const ForgotPasswordSession = (module.exports = mongoose.model(
  "ForgotPasswordSession",
  forgotPasswordSessionSchema
));
