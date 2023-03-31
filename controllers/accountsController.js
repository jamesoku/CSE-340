const utilities = require("../utilities");
const Accmodel = require("../models/account-model");
const bcrypt = require("bcryptjs");
var ejs = require("ejs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
///error
async function buildErr(req, res, next) {
  let loginview = LoginView();
  let nav = await utilities.getNav();

  res.render("./clients/login.ejs", {
    title: "Login",
    nav2,
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

///////

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  let client_firstname = req.clientData.client_firstname;
  let client_type = req.clientData.client_type;
  let client_id = req.clientData.client_id;
  res.render("./clients/AccountManagement.ejs", {
    title: "Account Management",
    nav,
    client_firstname,
    client_type,
    client_id,
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

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginClient(req, res) {
  let nav = await utilities.getNav();
  const { client_email, client_password } = req.body;
  const clientData = await Accmodel.getClientByEmail(client_email);
  if (!clientData) {
    const message = "Please check your credentials and try again.";
    res.status(400).render("/clients/login", {
      title: "Login",
      nav,
      message,
      errors: null,
      client_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(client_password, clientData.client_password)) {
      delete clientData.client_password;
      const accessToken = jwt.sign(
        clientData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true });
      return res.redirect("/client/");
    }
  } catch (error) {
    return res.status(403).send("Access Forbidden");
  }
}

async function accManagement(req, res, next) {
  const ClientID = parseInt(req.params.client_id);
  console.log(ClientID);
  const clientData = await Accmodel.getClientById(ClientID);
  console.log(clientData);
  let client_firstname = clientData.client_firstname;
  let client_lastname = clientData.client_lastname;
  let client_email = clientData.client_email;
  let client_id = ClientID;
  const nav = await utilities.getNav();
  res.render("./clients/Edit-acc", {
    title: "Edit Account",
    nav,
    client_id,
    client_lastname,
    client_firstname,
    client_email,
    errors: null,
    message: null,
  });
}
///updateclient
async function updateClient(req, res) {
  let nav = await utilities.getNav();

  const { client_firstname, client_lastname, client_email, client_id } =
    req.body;
  let clientData = await Accmodel.getClientById(client_id);
  const regResult = await Accmodel.updateClient(
    client_firstname,
    client_lastname,
    client_email,
    client_id
  );
  // console.log(regResult);
  if (regResult) {
    const loginview = await LoginView();
    res.status(201).render("clients/AccountManagement", {
      title: "Account Management",
      nav,
      message: `Congratulations, your information has been updated.`,
      errors: null,
      client_type: clientData.client_type,
      client_id,
      client_firstname,
    });
  } else {
    const message = "Sorry, the update failed.";
    // const registerView = await RegisterView();
    res.status(501).render("clients/Edit-acc", {
      title: "Edit Account",
      nav,
      client_id,
      client_lastname,
      client_firstname,
      client_email,
      message,
      errors: null,
      // registerView,
    });
  }
}

async function updatePass(req, res) {
  let nav = await utilities.getNav();
  const { client_password, client_id } = req.body;
  let clientData = await Accmodel.getClientById(client_id);
  // Hash the password before storing
  let hashedPassword;
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10);
  } catch (error) {
    res.status(500).render("clients/AccountManagement", {
      title: "Account Management",
      nav,
      message: "Sorry, there was an error processing the Password.",
      errors: null,
      client_type: clientData.client_type,
      client_id,
      client_firstname,
    });
  }

  const regResult = await Accmodel.updatePass(hashedPassword, client_id);
  // console.log(regResult);
  if (regResult) {
    const loginview = await LoginView();
    res.status(201).render("clients/AccountManagement", {
      title: "Account Management",
      nav,
      message: `Congratulations, your Password has been updated. Please log out and verify`,
      errors: null,
      client_type: clientData.client_type,
      client_id,
      client_firstname: clientData.client_firstname,
      client_lastname: clientData.client_lastname,
      client_email: clientData.client_email,
    });
  } else {
    const message = "Sorry, the update failed.";
    // const registerView = await RegisterView();
    res.status(501).render("clients/Edit-acc", {
      title: "Edit Account",
      nav,
      client_id,
      client_firstname: clientData.client_firstname,
      client_lastname: clientData.client_lastname,
      client_email: clientData.client_email,
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
  loginClient,
  buildManagement,
  buildErr,
  accManagement,
  updateClient,
  updatePass,
};
