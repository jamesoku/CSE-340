const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Constructs the nav HTML unordered list
Util.buildNav = function (data) {
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title = "See our inventory of ' +
      row.classification_name +
      'vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

// This builds the site nav
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  nav = Util.buildNav(data);
  return nav;
};

Util.buildvehicle = function (data) {
  let view = `<h1>${data.inv_year} ${data.inv_make} ${data.inv_model}</h1>
  <div class="split">
  <div>
  <img src="${data.inv_image}" alt="">
  </div>
  <div>
  <h2>${data.inv_make} ${data.inv_model} Details</h2>
  <ul>
  <li>Price: $${data.inv_price
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</li>
  <li>Description: ${data.inv_description}</li>
  <li>Color: ${data.inv_color}</li>
  <li>Miles: ${data.inv_miles.toLocaleString("en-US")}</li>
  </ul>
  </div>
  </div>`;

  return view;
};

// Util.buildaddClassform = function () {
//   let view = `<form action="/inv/sendclass" method="post">
//   <h3> NAME MUST BE ALPHABETICAL CHARACTERS ONLY </h3>
//   <label for="classification_name">Add Classification:</label>
//   <input type="text" id="classification_name" name="classification_name" pattern="^[A-Za-z]+$" required><br>
//   <button type="submit">Add Classification</button>
// </form>`;
//   return view;
// };

Util.buildaddvehicleform = async function (classification_id = null) {
  let options = "";
  let data = await invModel.getClassifications();

  let classificationList = `<select name= "classification_id"  id="classification_id" required>`;
  classificationList += "<option value = '' >Choose a Classification</option>";

  data.rows.forEach((row) => {
    classificationList += '<option value=" ' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += "selected";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });

  classificationList += "</select>";

  //   let view = `<form action="/inv/sendvehicle" method="post">
  //   <label for="classification_id">Classification:</label><br>
  //   ${classificationList}

  //   <label for="inv_make">Make:</label><br>
  //   <input type="text" id="inv_make" name="inv_make" minlength="3" placeholder="Min of 3 characters" required><br><br>

  //   <label for="inv_model">Model:</label><br>
  //   <input type="text" id="inv_model" name="inv_model" minlength="3" placeholder="Min of 3 characters" required><br>

  //   <label for="inv_description">Description:</label><br>
  //   <textarea id="inv_description" name="inv_description" minlength="1" required></textarea><br>

  //   <label for="inv_image">Image Path:</label>
  //   <input type="text" id="inv_image" name="inv_image" value="/images/vehicles/no-image.png" required><br>

  //   <label for="inv_thumbnail">Thumbnail Path:</label><br>
  //   <input type="text" id="inv_thumbnail" name="inv_thumbnail" value="/images/vehicles/no-image.png" required><br>

  //   <label for="inv_price">Price:</label><br>
  //   <input type="number" id="inv_price" name="inv_price" placeholder="decimal or integer" required><br>

  //   <label for="inv_year">Year:</label><br>
  //   <input type="number" id="inv_year" name="inv_year" placeholder="4-digit year" pattern ="^[0-9]{4}$" required><br>

  //   <label for="inv_miles">Miles:</label><br>
  //   <input type="number" id="inv_miles" name="inv_miles" placeholder="digit only" required><br>

  //   <label for="inv_color">Color:</label><br>
  //   <input type="text" id="inv_color" name="inv_color" required><br>

  //   <input type="submit" value="Submit">
  // </form>
  // `;
  return classificationList;
};

Util.getbuildvehicle = async function (req, res, next) {
  let data = await invModel.getVehicleByinvId;
  vehicle = Util.buildvehicle(data);
  return vehicle;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err) {
    if (err) {
      loggedin = false;
      // return res.status(403).redirect("/client/login");
      return next();
    }
    loggedin = true;
    return next();
  });
};

/* ****************************************
 *  Authorize JWT Token
 * ************************************ */
Util.jwtAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    const clientData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.clientData = clientData;
    loggedin = true;
    next();
  } catch (error) {
    console.log("yo");
    res.clearCookie("jwt", { httpOnly: true });
    loggedin = false;
    return res.status(403).redirect("/client/login");
  }
};


/* ****************************************
 *  Authorize JWT Token
 * ************************************ */
Util.clearCookie = (req, res, next) => {
  res.clearCookie('jwt');
  loggedin = false
  next()

  
}
module.exports = Util;
