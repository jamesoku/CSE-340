const pool = require("../database");

async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

async function getVehiclesByClassificationId(classificationId) {
  try {
    const data = await pool.query(
      "select * From public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classificationId]
    );
    // console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.error("getclassificationbyid error" + error);
  }
}

async function getVehicleByinvId(invId) {
  try {
    const data = await pool.query(
      "select * From public.inventory WHERE inv_id = $1",
      [invId]
    );
    // console.log(data.rows);
    // console.log("get info");
    return data.rows;
  } catch (error) {
    console.error("getVehicleByinv_Id error" + error);
  }
}
//
async function registerNewclassification(classification_name) {
  try {
    const sql =
      "INSERT INTO classification(classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

async function registerNewvehicle(
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
) {
  try {
    const sql =
      "INSERT INTO inventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING *";
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Update Vehicle Data
 * ************************** */
async function updateVehicle(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
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
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Vehicle Data
 * ************************** */
async function deleteVehicle(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("model error: " + error);
  }
}
module.exports = {
  updateVehicle,
  getClassifications,
  getVehiclesByClassificationId,
  getVehicleByinvId,
  registerNewclassification,
  registerNewvehicle,
  deleteVehicle,
};
