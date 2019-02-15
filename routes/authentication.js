const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const HttpStatus = require("http-status-codes");

const authenticationRouter = express.Router();

/**
 * POST signup
 * POST login
 * POST forget
 * POST reset
 */

module.exports = authenticationRouter;
