// src/controllers/departmentControllers/department.controllers.js

import {
  createDepartmentValidator,
  updateDepartmentValidator,
} from "../../validation/department.validation.js";

import {
  getDepartmentByNameService,
  getDepartmentByIdService,
  getAllDepartmentsService,
  createDepartmentService,
  updateDepartmentService,
  deleteDepartmentService,
} from "../../services/departmentService/department.services.js";

// Helper: Format Yup errors into array
const formatYupErrors = (e) => {
  return e.inner?.map((err) => err.message) || [e.message];
};

/* ======================================================
   1. CREATE DEPARTMENT
====================================================== */
export const createDepartmentController = async (req, res) => {
  try {
    const { department_name, department_description } = req.body;

    const existing = await getDepartmentByNameService(department_name);

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "A department with this name already exists.",
      });
    }

    const department = await createDepartmentService({
      department_name,
      department_description,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: { department },
    });
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};



/* ======================================================
   2. GET ALL DEPARTMENTS
====================================================== */
export const getAllDepartmentsController = async (req, res) => {
  try {
    const departments = await getAllDepartmentsService();

    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully.",
      data: {
        departments,
      },
    });
  } catch (error) {
    console.error("Error in getDepartments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments.",
      error: error.message,
    });
  }
};

/* ======================================================
   3. GET DEPARTMENT BY ID
====================================================== */
export const getDepartmentByIdController = async (req, res) => {
  try {
    const { department_id } = req.params;

    if (isNaN(department_id)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Provided parameter is invalid.",
      });
    }

    const department = await getDepartmentByIdService(department_id);

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The department you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department retrieved successfully.",
      data: { department },
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
/* ======================================================
   4. UPDATE DEPARTMENT
====================================================== */
export const updateDepartmentController = async (req, res) => {
  try {
    const { department_id } = req.params;

    if (isNaN(department_id)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Provided parameter is invalid.",
      });
    }

    await updateDepartmentValidator.validate(req.body, {
      abortEarly: false,
    });

    const updated = await updateDepartmentService(department_id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The department you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: { department: updated },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: formatYupErrors(error),
      });
    }

    if (error.code === "DUPLICATE_NAME") {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "A department with this name already exists.",
      });
    }

    console.error("Error updating department:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/* ======================================================
   5. DELETE DEPARTMENT (SOFT DELETE)
====================================================== */
export const deleteDepartmentController = async (req, res) => {
  try {
    const { department_id } = req.params;

    if (isNaN(department_id)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Provided parameter is invalid.",
      });
    }

    const deleted = await deleteDepartmentService(department_id);

    if (deleted === "REFERENCED") {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "Department is referenced by one or more doctors.",
      });
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The department you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
