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
    return data.rows;
  } catch (error) {
    console.error("getVehicleByinv_Id error" + error);
  }
}
//

module.exports = {
  getClassifications,
  getVehiclesByClassificationId,
  getVehicleByinvId,
};
