const invModel = require("../models/inventory-model");
const Util = require("../utilities");
const utilities = require("../utilities");

const invCont = {};

invCont.buildByClassification = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  // console.log(classificationId);
  //data gets everything in the data base
  let data = await invModel.getVehiclesByClassificationId(classificationId);

  let nav = await utilities.getNav();
  // console.log(data);
  let className = data[0].classification_name;
  // console.log(className);
  res.render("./inventory/classification-view", {
    title: className + " vehicles",
    nav,
    message: null,
    data,
    loggedin,
  });
};

invCont.buildManagement = async function (req, res, next) {
  if (
    req.clientData.client_type == "Employee" ||
    req.clientData.client_type == "Admin"
  ) {
    let nav = await utilities.getNav();

    res.render("./inventory/management-view", {
      title: "Management",
      nav,
      message: null,
    });
  } else {
    return res.redirect("/client/");
  }
};

invCont.newclassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  // let newclassform = utilities.buildaddClassform();

  res.render("./inventory/add-classification", {
    title: "Add new classification",
    nav,
    message: null,
    errors: null,
  });
};

invCont.registerClassform = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await invModel.registerNewclassification(
    classification_name
  );
  // console.log(regResult);
  if (regResult) {
    let nav = await utilities.getNav();
    res.status(201).render("./inventory/management-view.ejs", {
      title: "Management",
      nav,
      message: `Congratulations, you registered ${classification_name}.`,
      errors: null,
    });
  } else {
    const message = "Sorry, the registration failed.";
    let newclassform = utilities.buildaddClassform();
    let nav = await utilities.getNav();
    res.status(501).render("./inventory/add-classification.ejs", {
      title: "Add new classification",
      nav,
      message,
      errors: null,
      newclassform,
    });
  }
};

invCont.newvehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classList = await utilities.buildaddvehicleform(null);

  res.render("./inventory/add-vehicle", {
    title: "Add new vehicle",
    nav,
    message: null,
    classList,
    errors: null,
  });
};

invCont.registervehicle = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const regResult = await invModel.registerNewvehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );
  console.log(regResult);
  if (regResult) {
    let nav = await utilities.getNav();
    res.status(201).render("./inventory/management-view.ejs", {
      title: "Management",
      nav,
      message: `Congratulations, you registered ${inv_make} ${inv_model}.`,
      errors: null,
    });
  } else {
    const message = "Sorry, the registration failed.";
    let classList = utilities.buildaddvehicleform();
    let nav = await utilities.getNav();
    res.status(501).render("./inventory/add-vehicle.ejs", {
      title: "Add new Vehicle",
      nav,
      message,
      errors: null,
      classList,
    });
  }
};

invCont.buildVehicle = async function (req, res, next) {
  //The inventory id of the selected vehicle
  const invID = req.params.inv_id;

  //gets  the nav bar
  let nav = await utilities.getNav();

  //gets vehicle info from the database
  let data = await invModel.getVehicleByinvId(invID);

  //builds the Html vehicle view
  const vehicleView = Util.buildvehicle(data[0]);

  res.render("./inventory/vehicle-detail.ejs", {
    title: data[0].inv_make + " " + data[0].inv_model,
    nav,
    message: null,
    view: vehicleView,
  });
};
module.exports = invCont;
