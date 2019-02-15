const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const randomatic = require("randomatic");

const User = require("../models/user.js");
const UserSession = require("../models/userSession");
const ForgotPasswordSession = require("../models/forgotPasswordSession");

const saltRounds = 10;
const secretLength = 20;
// json web token expires after
const jwtExpiresIn = "1d"; // 1 day
// forgot password jwt expires after
const fptExpiresIn = "1h"; // 1 hour

const authenticationRouter = express.Router();

/**
 * POST signup
 * POST signin
 * GET session
 * POST logout
 * POST forgotpassword
 * POST resetpassword
 */

// POST PUBLIC_URL/api/authentication/signup
authenticationRouter.post(
  "/signup",
  [
    // name must have atleast 2 characters
    check("name").isLength({ min: 2 }),
    // email must be of email format
    check("email").isEmail(),
    // password must have atleast 6 characters
    check("password").isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errorString = "";
      errors.array().forEach((item, index) => {
        errorString = errorString.concat(" " + item.param);
      });
      // returns which values have been violated
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: "Check" + errorString
      });
    }

    let { name, email, password } = req.body;
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    email = email.toLowerCase();
    // convert the password into a hash
    const passwordHash = bcrypt
      .hash(password, saltRounds)
      .then(passwordHash => {
        // checking if the email already exists in the database
        const query = {
          email: email
        };
        User.find(query, (err, users) => {
          if (err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: "Internal server error"
            });
          } else if (users.length != 0) {
            // same email exists in the database
            return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
              success: false,
              message: "Email already exists"
            });
          } else {
            // create the user
            const newUser = { name, email, passwordHash };
            User.create(newUser, (err, user) => {
              if (err) {
                console.log(err);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: "Internal server error"
                });
              } else {
                return res.status(HttpStatus.OK).json({
                  success: true,
                  message: "User successfully created"
                });
                /**
                 * client can redirect to signin page
                 */
              }
            });
          }
        });
      })
      .catch(err => {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal server error"
        });
      });
  }
);

// POST PUBLIC_URL/api/authentication/signin
authenticationRouter.post(
  "/signin",
  [
    // email must exist
    check("email").exists(),
    // password must exist
    check("password").exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errorString = "";
      errors.array().forEach((item, index) => {
        errorString = errorString.concat(" " + item.param);
      });
      // returns which values have been violated
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: "Check" + errorString
      });
    }

    const { email, password } = req.body;
    const query = {
      email
    };
    User.find(query, (err, users) => {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal server error"
        });
      } else if (users.length != 1) {
        // email does not exist
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Email incorrect"
        });
      } else {
        const { name, email, passwordHash } = users[0];
        bcrypt
          .compare(password, passwordHash)
          .then(result => {
            if (result) {
              // correct password
              // create a secret which is a random string
              const secret = randomatic("*", secretLength);
              jwt.sign(
                { name, email },
                secret,
                { expiresIn: jwtExpiresIn },
                (err, token) => {
                  if (err) {
                    console.log(err);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                      success: false,
                      message: "Internal server error"
                    });
                  } else {
                    //save the token and the secret to database
                    const newUserSession = { token, secret };
                    UserSession.create(newUserSession, (err, userSession) => {
                      if (err) {
                        console.log(err);
                        return res
                          .status(HttpStatus.INTERNAL_SERVER_ERROR)
                          .json({
                            success: false,
                            message: "Internal server error"
                          });
                      } else {
                        return res.status(HttpStatus.OK).json({
                          success: true,
                          message: "User successfully signed in",
                          jsonwebtoken: token,
                          userDetails: {
                            name,
                            email
                          }
                        });
                        /**
                         * client will get the user details
                         * client will get the json web token(jwt)
                         * client can save the jwt to the localStorage
                         * client can request the protected routes using jwt
                         * client has to attach the jwt to request headers
                         * client can maintain the session using jwt
                         */
                      }
                    });
                  }
                }
              );
            } else {
              // wrong password
              return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: "Password incorrect"
              });
            }
          })
          .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: "Internal server error"
            });
          });
      }
    });
  }
);

function verifyToken(req, res, next) {
  // check if token exists and attach it to request object directly
  // client will attach the jwt to request headers
  const authHeader = req.headers["authorization"];
  if (typeof authHeader !== "undefined") {
    const auth = authHeader.split(" ");
    req.token = auth[1];
    // call next middleware
    next();
  } else {
    // authorization header not defined
    return res.status(HttpStatus.FORBIDDEN).json({
      success: false,
      message: "Authorization header undefined"
    });
  }
}

// GET PUBLIC_URL/api/authentication/session
authenticationRouter.get("/session", verifyToken, (req, res) => {
  const { token } = req;
  const query = {
    token
  };
  UserSession.find(query, (err, userSessions) => {
    if (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error"
      });
    } else if (userSessions.length != 1) {
      // session does not exist
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "Session not found"
      });
      /**
       * client can clear the token saved in localStorage
       * client can redirect to login page for new session creation
       */
    } else {
      const { secret } = userSessions[0];
      jwt.verify(token, secret, (err, authData) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            // token expired
            // remove the session from the database
            UserSession.find(query)
              .remove()
              .exec();
            return res.status(HttpStatus.FORBIDDEN).json({
              success: false,
              message: "Session expired"
            });
            /**
             * client can clear the token saved in localStorage
             * client can redirect to login page for new session creation
             */
          } else {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: "Internal server error"
            });
          }
        } else {
          const { name, email } = authData;
          return res.status(HttpStatus.OK).json({
            success: true,
            message: "Session retrieved",
            userDetails: {
              name,
              email
            }
          });
        }
      });
    }
  });
});

// POST PUBLIC_URL/api/authentication/logout
authenticationRouter.post("/logout", verifyToken, (req, res) => {
  const { token } = req;
  const query = {
    token
  };
  UserSession.find(query).remove(err => {
    if (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error"
      });
    } else {
      // deleted session
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User successfully logged out"
      });
      /**
       * client can clear the token saved in localStorage
       * client can redirect to login page for new session creation
       */
    }
  });
});

// POST PUBLIC_URL/api/authentication/forgotpassword
authenticationRouter.post(
  "/forgotpassword",
  [
    // email must exist
    check("email").exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errorString = "";
      errors.array().forEach((item, index) => {
        errorString = errorString.concat(" " + item.param);
      });
      // returns which values have been violated
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: "Check" + errorString
      });
    }

    const { email } = req.body;
    const query = {
      email
    };
    User.find(query, (err, users) => {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal server error"
        });
      } else if (users.length != 1) {
        // email does not exist
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Email incorrect"
        });
      } else {
        const { name, email } = users[0];
        // create a secret which is a random string
        const secret = randomatic("*", secretLength);
        jwt.sign(
          { email },
          secret,
          { expiresIn: fptExpiresIn },
          (err, token) => {
            if (err) {
              console.log(err);
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error"
              });
            } else {
              //save the token and the secret to database
              const newFpSession = { token, secret };
              ForgotPasswordSession.create(newFpSession, (err, fpSession) => {
                if (err) {
                  console.log(err);
                  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error"
                  });
                } else {
                  // this process should generally be email based
                  // we can use mailgun api to directly send email with a link
                  // we do it manually for now
                  return res.status(HttpStatus.OK).json({
                    success: true,
                    message: "Forgot password session created successfully",
                    fpToken: token
                  });
                  /**
                   * server can send an email to the user with forgot password token
                   * user can visit the link to reset password
                   * forgot password token will be used to authenticate reset password
                   */
                }
              });
            }
          }
        );
      }
    });
  }
);

module.exports = authenticationRouter;
