import { body, param, validationResult } from "express-validator";

/**
 * @constant createDepartmentValidator
 * @description Validates department creation requests.
 * Ensures required fields are provided and valid.
 */
export const createDepartmentValidator = [
  body("department_name")
    .trim()
    .notEmpty()
    .withMessage("Department name is required.")
    .isLength({ max: 100 })
    .withMessage("Department name must not exceed 100 characters."),

  body("department_description")
    .trim()
    .notEmpty()
    .withMessage("Department description is required.")
    .isLength({ max: 255 })
    .withMessage("Department description must not exceed 255 characters."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: errorMessages.join(". "),
      });
    }
    next();
  },
];

/**
 * @constant departmentIdValidator
 * @description Validates department ID in params.
 */
export const departmentIdValidator = [
  param("department_id")
    .isInt({ min: 1 })
    .withMessage("Department ID must be a valid integer."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: errorMessages.join(". "),
      });
    }
    next();
  },
];

/**
 * @constant updateDepartmentValidator
 * @description Validates department update requests.
 */
export const updateDepartmentValidator = [
  param("department_id")
    .isInt({ min: 1 })
    .withMessage("Department ID must be a valid integer."),

  body("department_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Department name cannot be empty.")
    .isLength({ max: 100 })
    .withMessage("Department name must not exceed 100 characters."),

  body("department_description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Department description cannot be empty.")
    .isLength({ max: 255 })
    .withMessage("Department description must not exceed 255 characters."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: errorMessages.join(". "),
      });
    }
    next();
  },
];
