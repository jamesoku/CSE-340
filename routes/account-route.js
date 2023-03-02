const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountCon = require("../controllers/accountsController");
const regValidate = require("../utilities/account-validation");

router.get("/login", accountCon.buildLogin);
router.get("/registration", accountCon.buildRegister);

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountCon.registerClient
);

router.post("/loginuser", regValidate.loginRules(), regValidate.checkloginData);
// Process the login attempt
router.post("/login", (req, res) => {
  res.status(200).send("login process");
});
module.exports = router;
