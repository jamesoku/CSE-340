const utilities = require("../utilities");
const Accmodel = require("../models/account-model");
const bcrypt = require("bcryptjs");
var ejs = require("ejs");

/* ****************************************
 *  Deliver login view
 **************************************** */
async function buildLogin(req, res, next) {
  let loginview = LoginView();
  let nav = await utilities.getNav();

  res.render("./clients/login.ejs", {
    title: "Login",
    nav,
    message: null,
    loginview,
    errors: null,
  });
}

/* ****************************************
 *  create login view
 **************************************** */

function LoginView() {
  let loginview = `<form id="loginForm" action="/client/loginuser" method="post">
  <label for="username">Username:</label>
  <input type="email" id="client_email" name="client_email" placeholder="Enter your Email" value= "<%- locals.client_email %>" required>

  <label for="password">Password:</label>
  <input type="password" id="client_password" name="client_password" placeholder="Enter your password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" required>
  <span class="error">Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span> 

  <input type="submit" value="Login">
  <p><a href="/client/registration">No account? Sign-up</a></p>
</form>`;
  return loginview;
}

/* ****************************************
 *  Deliver registration view
 **************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./clients/register.ejs", {
    title: "Register",
    nav,
    errors: null,
    message: null,
  });
}

/* ****************************************
 *  Process registration request
 **************************************** */
async function registerClient(req, res) {
  let nav = await utilities.getNav();
  const { client_firstname, client_lastname, client_email, client_password } =
    req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10);
  } catch (error) {
    res.status(500).render("clients/register", {
      title: "Registration",
      nav,
      message: "Sorry, there was an error processing the registration.",
      errors: null,
    });
  }

  const regResult = await Accmodel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    hashedPassword
  );
  // console.log(regResult);
  if (regResult) {
    const loginview = await LoginView();
    res.status(201).render("clients/login.ejs", {
      title: "Login",
      nav,
      message: `Congratulations, you\'re registered ${client_firstname}. Please log in.`,
      errors: null,
      loginview,
    });
  } else {
    const message = "Sorry, the registration failed.";
    // const registerView = await RegisterView();
    res.status(501).render("clients/register.ejs", {
      title: "Registration",
      nav,
      message,
      errors: null,
      // registerView,
    });
  }
}

module.exports = {
  buildLogin,
  LoginView,
  buildRegister,
  registerClient,
};
