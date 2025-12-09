import connection from "../../config/db.config.js";

// --------------------------------------------------
// Create New Department
// --------------------------------------------------
export const createDepartmentService = async (payload) => {
  try {
    const sql = `
      INSERT INTO department (department_name, department_description)
      VALUES (?, ?)
    `;

    const result = await connection.query(sql, [
      payload.department_name,
      payload.department_description,
    ]);

    return {
      id: result.insertId,
      department_name: payload.department_name,
      department_description: payload.department_description,
    };
  } catch (error) {
    console.error("Error in createDepartmentService:", error);
    throw error;
  }
};
// --------------------------------------------------
// Get All Departments
// --------------------------------------------------
export const getAllDepartmentsService = async () => {
  try {
    const sql = `
      SELECT id, department_name, department_description, created_at
      FROM department
      WHERE deleted_at IS NULL
      ORDER BY id DESC
    `;
    const rows = await connection.query(sql);
    return rows;
  } catch (error) {
    console.error("Error in getDepartmentsService:", error);
    throw error;
  }
};
// --------------------------------------------------
// Get Department By ID
// --------------------------------------------------
export const getDepartmentByIdService = async (id) => {
  try {
    const sql = `
      SELECT id, department_name, department_description, created_at
      FROM department
      WHERE id = ? AND deleted_at IS NULL
      LIMIT 1
    `;
    const rows = await connection.query(sql, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error in getDepartmentByIdService:", error);
    throw error;
  }
};
// -------------------------------
// Get department by name (exact)
// -------------------------------
export const getDepartmentByNameService = async (department_name) => {
  try {
    const sql = `
      SELECT id, department_name, department_description, created_at, updated_at
      FROM department
      WHERE department_name = ? 
        AND deleted_at IS NULL
      LIMIT 1
    `;

    const rows = await connection.query(sql, [department_name]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error in getDepartmentByNameService:", error);
    throw error;
  }
};

// --------------------------------------------------
// Update Department
// --------------------------------------------------
export const updateDepartmentService = async (id, payload) => {
  try {
    const sql = `
      UPDATE department
      SET department_name = ?, department_description = ?
      WHERE id = ? AND deleted_at IS NULL
    `;

    const result = await connection.query(sql, [
      payload.department_name,
      payload.department_description,
      id,
    ]);

    if (result.affectedRows === 0) return null;

    return await getDepartmentByIdService(id);
  } catch (error) {
    console.error("Error in updateDepartmentService:", error);

    if (error.code === "ER_DUP_ENTRY") {
      const dup = new Error("Duplicate department name.");
      dup.code = "DUPLICATE_NAME";
      throw dup;
    }

    throw error;
  }
};

// --------------------------------------------------
// Delete Department
// --------------------------------------------------
export const deleteDepartmentService = async (id) => {
  try {
    const sql = `
      UPDATE department
      SET deleted_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
    `;

    const result = await connection.query(sql, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in deleteDepartmentService:", error);
    throw error;
  }
};
