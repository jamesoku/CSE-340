const invModel = require("../models/inventory-model");
const Util = {};

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

Util.getbuildvehicle = async function (req, res, next) {
  let data = await invModel.getVehicleByinvId;
  vehicle = Util.buildvehicle(data);
  return vehicle;
};

module.exports = Util;
