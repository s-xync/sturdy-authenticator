const mongoose = require("mongoose");

const userSessionSchema = mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  }
});

const UserSession = (module.exports = mongoose.model(
  "UserSession",
  userSessionSchema
));
