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

    const classificationSelect = await utilities.buildaddvehicleform();

    res.render("./inventory/management-view", {
      title: "Management",
      nav,
      classificationSelect,
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
    const classificationSelect = await utilities.buildaddvehicleform();
    res.status(201).render("./inventory/management-view.ejs", {
      title: "Management",
      nav,
      classificationSelect,
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

  res.render("./inventory/edit-vehicle", {
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
    const classificationSelect = await utilities.buildaddvehicleform();
    res.status(201).render("./inventory/management-view.ejs", {
      title: "Management",
      nav,
      classificationSelect,
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

/* ***************************
 *  Return Vehicles by Classification As JSON
 * ************************** */
invCont.getVehiclesJSON = async (req, res, next) => {
  console.log(req.params);
  const classification_id = parseInt(req.params.classification_id);
  const vehicleData = await invModel.getVehiclesByClassificationId(
    classification_id
  );
  if (vehicleData[0].inv_id) {
    return res.json(vehicleData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit vehicle view
 * ************************** */
invCont.editVehicleView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let vehicleData = await invModel.getVehicleByinvId(inv_id);
  vehicleData = vehicleData[0];
  const classificationSelect = await Util.buildaddvehicleform(
    vehicleData.classification_id
  );
  const vehicleName = `${vehicleData.inv_make} ${vehicleData.inv_model}`;
  res.render("./inventory/edit-vehicle", {
    title: "Edit " + vehicleName,
    nav,
    classificationSelect: classificationSelect,
    message: null,
    errors: null,
    inv_id: vehicleData.inv_id,
    inv_make: vehicleData.inv_make,
    inv_model: vehicleData.inv_model,
    inv_year: vehicleData.inv_year,
    inv_description: vehicleData.inv_description,
    inv_image: vehicleData.inv_image,
    inv_thumbnail: vehicleData.inv_thumbnail,
    inv_price: vehicleData.inv_price,
    inv_miles: vehicleData.inv_miles,
    inv_color: vehicleData.inv_color,
    classification_id: vehicleData.classification_id,
  });
};

/* ***************************
 *  Update Vehicle Data
 * ************************** */
invCont.updateVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateVehicle(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const vehicleName = updateResult.inv_make + " " + updateResult.inv_model;
    const classificationSelect = await utilities.buildaddvehicleform();
    res.status(201).render("inventory/management-view", {
      classificationSelect,
      title: "Vehicle Management",
      nav,
      message: `The ${vehicleName} was successfully updated.`,
      errors: null,
    });
  } else {
    const inv_id = inv_id;
    const classificationSelect = await utilities.buildaddvehicleform(
      classification_id
    );
    const vehicleName = `${inv_make} ${inv_model}`;
    res.status(501).render("inventory/edit-vehicle", {
      title: "Edit " + vehicleName,
      nav,
      classificationSelect,
      message: "Sorry, the insert failed.",
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete vehicle view
 * ************************** */
invCont.deleteVehicleView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let vehicleData = await invModel.getVehicleByinvId(inv_id);
  vehicleData = vehicleData[0];
  const classificationSelect = await Util.buildaddvehicleform(
    vehicleData.classification_id
  );
  const vehicleName = `${vehicleData.inv_make} ${vehicleData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Edit " + vehicleName,
    nav,
    classificationSelect: classificationSelect,
    message: null,
    errors: null,
    inv_id: vehicleData.inv_id,
    inv_make: vehicleData.inv_make,
    inv_model: vehicleData.inv_model,
    inv_year: vehicleData.inv_year,
    inv_description: vehicleData.inv_description,
    inv_image: vehicleData.inv_image,
    inv_thumbnail: vehicleData.inv_thumbnail,
    inv_price: vehicleData.inv_price,
    inv_miles: vehicleData.inv_miles,
    inv_color: vehicleData.inv_color,
    classification_id: vehicleData.classification_id,
    loggedin,
  });
};

/* ***************************
 *  Delete Vehicle Data
 * ************************** */
invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const invid = req.body.inv_id;
  console.log(invid);
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const deleteResult = await invModel.deleteVehicle(invid);
  console.log(deleteResult);
  if (deleteResult) {
    console.log("y01");
    const vehicleName = inv_make + " " + inv_model;
    const classificationSelect = await utilities.buildaddvehicleform(
      classification_id
    );
    res.status(201).render("inventory/management-view", {
      classificationSelect,
      title: "Vehicle Management",
      nav,
      message: `The ${vehicleName} was successfully deleted.`,
      errors: null,
    });
  } else {
    // const inv_id = inv_id;
    console.log("y02");
    const classificationSelect = await utilities.buildaddvehicleform(
      classification_id
    );
    const vehicleName = `${inv_make} ${inv_model}`;
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + vehicleName,
      nav,
      classificationSelect: classificationSelect,
      message: "Sorry, the delete failed.",
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};
module.exports = invCont;
