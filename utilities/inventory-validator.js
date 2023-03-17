const utilities = require("./");
const { body, validationResult } = require("express-validator");
const validateinv = {};
const AccCont = require("../controllers/accountsController");
const accountModel = require("../models/account-model");

validateinv.classificationRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("classification_name")
      .trim()
      .escape()
      .matches(/^[A-Za-z]+$/)
      .withMessage("Please provide a valid classification name."),
  ];
};

validateinv.checkclassData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    // let newclassform = utilities.buildaddClassform();

    res.render("../views/inventory/add-classification", {
      errors,
      message: null,
      title: "Add new classification",
      nav,
      classification_name,
      
    });
    return;
  }
  next();
};


validateinv.vehicleRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("classification_id")
      .toInt()
      .isInt({ min: 1 })
      .withMessage("Classification is required"),

    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make name."),

    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid Model name."),

    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid Description."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid image path."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid Thumbnail path."),

    body("inv_price")
      .trim()
      .escape()
      .isDecimal()
      .withMessage("Please provide a valid price."),

    body("inv_year")
      .trim()
      .escape()
      .matches(/^[0-9]{4}$/)
      .withMessage("Please provide a valid year."),

    body("inv_miles")
      .trim()
      .escape()
      .isDecimal()
      .withMessage("Please provide a valid milage count."),

    body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid colour."),
  ];
};

validateinv.checkvehicleData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    // let registerView = await AccCont.RegisterView();
    let classList = await utilities.buildaddvehicleform();

    res.render("../views/inventory/add-vehicle", {
      errors,
      message: null,
      title: "Add new classification",
      nav,
      classList,
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
      // newclassform,
    });
    return;
  }
  next();
};

module.exports = validateinv;
