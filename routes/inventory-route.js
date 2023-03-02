// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validator");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);
// connects the classification view to the vehicle view
router.get("/detail/:inv_id", invController.buildVehicle);
router.get("/", invController.buildManagement);
router.get("/add-classification", invController.newclassification);
router.get("/add-vehicle", invController.newvehicle);

router.post(
  "/sendclass",
  invValidate.classificationRules(),
  invValidate.checkclassData,
  invController.registerClassform
);

router.post(
  "/sendvehicle",
  invValidate.vehicleRules(),
  invValidate.checkvehicleData,
  invController.registervehicle
);

module.exports = router;
