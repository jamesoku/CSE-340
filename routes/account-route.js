const express = require("express");
const router = new express.Router();
const Util = require("../utilities");
const accountCon = require("../controllers/accountsController");
const regValidate = require("../utilities/account-validation");
const baseCon = require("../controllers/baseController");

router.get(
  "/login",
  Util.checkJWTToken,
  Util.handleErrors(accountCon.buildLogin)
);

router.get(
  "/registration",
  Util.checkJWTToken,
  Util.handleErrors(accountCon.buildRegister)
);
router.get("/", Util.jwtAuth, Util.handleErrors(accountCon.buildManagement));
router.get("/logout", Util.clearCookie, Util.handleErrors(baseCon.buildHome));

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountCon.registerClient)
);

router.post(
  "/",
  regValidate.loginRules(),
  regValidate.checkloginData,
  Util.handleErrors(accountCon.loginClient)
);
// Process the login attempt
router.post("/login", (req, res) => {
  res.status(200).send("login process");
});
module.exports = router;
