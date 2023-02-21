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
module.exports = {
  getClassifications,
  getVehiclesByClassificationId,
  getVehicleByinvId,
  registerNewclassification,
  registerNewvehicle,
};
