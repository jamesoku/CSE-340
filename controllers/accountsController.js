const utilities = require("../utilities");
const Accmodel = require("../models/account-model");
/* ****************************************
 *  Deliver login view
 **************************************** */
async function buildLogin(req, res, next) {
  let loginview = await LoginView();
  let nav = await utilities.getNav();
  res.render("./clients/login.ejs", {
    title: "Login",
    nav,
    message: null,
    loginview,
  });
}

/* ****************************************
 *  create login view
 **************************************** */

function LoginView() {
  let loginview = `<form>
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" placeholder="Enter your username">

  <label for="password">Password:</label>
  <input type="password" id="password" name="password" placeholder="Enter your password">

  <input type="submit" value="Login">
  <p><a href="/client/registration">No account? Sign-up</a></p>
</form>`;

  return loginview;
}

/* ****************************************
 *  Deliver registration view
 **************************************** */
async function buildRegister(req, res, next) {
  let registerView = await RegisterView();
  let nav = await utilities.getNav();
  res.render("./clients/register.ejs", {
    title: "Register",
    nav,
    errors: null,
    message: null,
    registerView,
  });
}

function RegisterView() {
  let registerView = `<form action="/client/register" method="post">
  <label for="firstname">First Name<span class="required"></span></label>
  <input type="text" id="firstname" name="client_firstname" placeholder="Enter your first name" required>
  <label for="lastname">Last Name<span class="required"></span></label>
  <input type="text" id="lastname" name="client_lastname" placeholder="Enter your last name" required>
  <label for="email">Email Address<span class="required"></span></label>
  <input type="email" id="email" name="client_email" placeholder="Enter your email address" required>
  <label for="password">Password<span class="required"></span></label>
  <div>
    <input type="password" id="password" name="client_password" placeholder="Enter your password" required minlength="12">
  </div>
  <button type="submit">Register</button>
</form>`;

  return registerView;
}

/* ****************************************
 *  Process registration request
 **************************************** */
async function registerClient(req, res) {
  let nav = await utilities.getNav();
  const { client_firstname, client_lastname, client_email, client_password } =
    req.body;

  const regResult = await Accmodel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    client_password
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
    const registerView = await RegisterView();
    res.status(501).render("clients/register.ejs", {
      title: "Registration",
      nav,
      message,
      errors: null,
      registerView
    });
  }
}

module.exports = {
  buildLogin,
  RegisterView,
  LoginView,
  buildRegister,
  registerClient,
};
