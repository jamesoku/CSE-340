const utilities = require("./");
const { body, validationResult } = require("express-validator");
const validate = {};
const AccCont = require("../controllers/accountsController");
const accountModel = require("../models/account-model");
var ejs = require("ejs");

/*  **********************************
 *  login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
    // .custom(async (client_email) => {
    //   const emailExists = await accountModel.checkExistingEmail(client_email);
    //   if (emailExists) {
    //     throw new Error("Email exists. Please login or use different email");
    //   }
    // }),

    // password is required and must be strong password
    body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.checkloginData = async (req, res, next) => {
  const { client_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let loginview = await AccCont.LoginView();

    res.render("../views/clients/login", {
      errors,
      message: null,
      title: "Login",
      nav,
      client_email,
      loginview,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Registration Data Validation Rules
 * **********************************/
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email) => {
        const emailExists = await accountModel.checkExistingEmail(client_email);
        if (emailExists) {
          throw new Error("Email exists. Please login or use different email");
        }
      }),

    // password is required and must be strong password
    body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/***********************************
 *  Check data and return errors or continue to registration
 * ********************************* */

validate.checkRegData = async (req, res, next) => {
  const { client_firstname, client_lastname, client_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    // let registerView = await AccCont.RegisterView();

    res.render("../views/clients/register", {
      errors,
      message: null,
      title: "Registration",
      nav,
      client_firstname,
      client_lastname,
      client_email,
      // registerView,
    });
    return;
  }
  next();
};

module.exports = validate;
