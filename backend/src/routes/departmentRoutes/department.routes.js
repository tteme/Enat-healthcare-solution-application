// src/routes/department.routes.js

import express from "express";

import {
  getAllDepartmentsController,
  getDepartmentByIdController,
  createDepartmentController,
  updateDepartmentController,
  deleteDepartmentController,
} from "../../controllers/departmentControllers/department.controllers.js";

import { authn, authz } from "../../middlewares/department.middleware.js";
import { departmentIdValidator } from "../../validation/department.validation.js";

const router = express.Router();

// Public
router.get("/departments", getAllDepartmentsController);
router.get("/departments/:department_id", departmentIdValidator, getDepartmentByIdController);

// Admin Only
router.post("/departments", authn, authz([1]), createDepartmentController);
router.patch("/departments/:department_id", authn, authz([1]),departmentIdValidator, updateDepartmentController);
router.delete("/departments/:department_id", authn, authz([1]),departmentIdValidator, deleteDepartmentController);

export default router;
