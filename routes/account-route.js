const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountCon = require("../controllers/accountsController");

router.get("/login", accountCon.buildLogin);
router.get("/registration", accountCon.buildRegister);
router.post('/register', accountCon.registerClient)
module.exports = router;
