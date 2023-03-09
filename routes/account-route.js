const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountCon = require("../controllers/accountsController");
const regValidate = require("../utilities/account-validation");
const baseCon = require("../controllers/baseController");

router.get("/login", utilities.checkJWTToken, accountCon.buildLogin);
router.get("/registration", utilities.checkJWTToken, accountCon.buildRegister);
router.get("/", utilities.jwtAuth, accountCon.buildManagement);
router.get("/logout", utilities.clearCookie, baseCon.buildHome);

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountCon.registerClient
);

router.post(
  "/",
  regValidate.loginRules(),
  regValidate.checkloginData,
  accountCon.loginClient
);
// Process the login attempt
router.post("/login", (req, res) => {
  res.status(200).send("login process");
});
module.exports = router;
