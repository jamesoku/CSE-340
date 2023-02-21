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

Util.buildaddClassform = function () {
  let view = `<form action="/inv/sendclass" method="post">
  <h3> Name may not contain a space or special character of any kind </h3>
  <label for="classification_name">Add Classification:</label><br>
  <input type="text" id="classification_name" name="classification_name" pattern="[a-zA-Z]+" required><br>
  <button type="submit">Add Classification</button>
</form>`;
  return view;
};

Util.buildaddvehicleform = async function () {
  let options = "";
  let data = await invModel.getClassifications();

  data.rows.forEach((row) => {
    options += `<option value="${row.classification_id}">${row.classification_name}</option> `;
  });
  // console.log(data.rows);

  let view = `<form action="/inv/sendvehicle" method="post">
  <label for="classification_id">Classification:</label><br>
  <select id="classification_id" name="classification_id" required>
  <option value="">Choose a classification</option>
    ${options}
  </select><br><br>
  
  <label for="inv_make">Make:</label><br>
  <input type="text" id="inv_make" name="inv_make" required><br><br>
  
  <label for="inv_model">Model:</label><br>
  <input type="text" id="inv_model" name="inv_model" required><br>
  
  <label for="inv_description">Description:</label><br>
  <textarea id="inv_description" name="inv_description" required></textarea><br>
  
  <label for="inv_image">Image Path:</label>
  <input type="text" id="inv_image" name="inv_image" value="/images/vehicles/no-image.png" required><br>
  
  <label for="inv_thumbnail">Thumbnail Path:</label><br>
  <input type="text" id="inv_thumbnail" name="inv_thumbnail" value="/images/vehicles/no-image.png" required><br>
  
  <label for="inv_price">Price:</label><br>
  <input type="text" id="inv_price" name="inv_price" required><br>
  
  <label for="inv_year">Year:</label><br>
  <input type="text" id="inv_year" name="inv_year" required><br>
  
  <label for="inv_miles">Miles:</label><br>
  <input type="text" id="inv_miles" name="inv_miles" required><br>
  
  <label for="inv_color">Color:</label><br>
  <input type="text" id="inv_color" name="inv_color" required><br>

  
  
  <input type="submit" value="Submit">
</form>
`;
  return view;
};

Util.getbuildvehicle = async function (req, res, next) {
  let data = await invModel.getVehicleByinvId;
  vehicle = Util.buildvehicle(data);
  return vehicle;
};

module.exports = Util;
