const invModel = require("../models/inventory-model");
const Util = require("../utilities");
const utilities = require("../utilities");

const invCont = {};

invCont.buildByClassification = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  //   console.log(classificationId);
  //data gets everything in the data base
  let data = await invModel.getVehiclesByClassificationId(classificationId);
  let nav = await utilities.getNav();
  // console.log(data);
  const className = data[0].classification_name;
  // console.log("yo", className);
  res.render("./inventory/classification-view", {
    title: className + " vehicles",
    nav,
    message: null,
    data,
  });
};

invCont.buildVehicle = async function (req, res, next) {
  const invID = req.params.inv_id;
  let nav = await utilities.getNav();
  let data = await invModel.getVehicleByinvId(invID);

  const vehicleView = Util.buildvehicle(data[0]);

  res.render("./inventory/vehicle-detail.ejs", {
    title: data[0].inv_make + " " + data[0].inv_model,
    nav,
    message: null,
    view: vehicleView,
  });
};
module.exports = invCont;
