// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validator");
const Util = require("../utilities");
const accountCon = require("../controllers/accountsController");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  Util.checkJWTToken,
  invController.buildByClassification
);

// connects the classification view to the vehicle view
router.get(
  "/detail/:inv_id",
  Util.checkJWTToken,
  Util.handleErrors(invController.buildVehicle)
);

router.get("/Err", Util.checkJWTToken, Util.handleErrors(accountCon.buildErr));

router.get("/", Util.jwtAuth, Util.handleErrors(invController.buildManagement));

router.get(
  "/add-classification",
  Util.handleErrors(invController.newclassification)
);

router.get("/add-vehicle", Util.handleErrors(invController.newvehicle));

router.post(
  "/sendclass",
  invValidate.classificationRules(),
  invValidate.checkclassData,
  Util.handleErrors(invController.registerClassform)
);

router.post(
  "/sendvehicle",
  invValidate.vehicleRules(),
  invValidate.checkvehicleData,
  Util.handleErrors(invController.registervehicle)
);

module.exports = router;
