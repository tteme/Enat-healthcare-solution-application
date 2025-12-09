import jwt from "jsonwebtoken";

const jwtSecretKey = process.env.JWT_SECRET_KEY;

/**
 * Authentication Middleware
 * Verifies the JWT token and attaches the decoded user data to req.user
 */
export const authn = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token format: "Bearer eyJhbGciOi..."
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "You are not authorized, Please sign in.",
    });
  }

  try {
    // Verify token
    const decodedAccessToken = jwt.verify(token, jwtSecretKey);

    // Attach decoded user data (id, role_id, email, etc.)
    req.user = decodedAccessToken;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Token is invalid or has expired, Please sign in.",
    });
  }
};

/**
 * Authorization Middleware
 * Checks if the logged-in user's role_id matches the allowed roles
 *
 * @param {number[]} allowedRoles - Array of allowed role IDs
 */
export const authz = (allowedRoles) => {
  return (req, res, next) => {
    const { role_id } = req.user;

    if (!allowedRoles.includes(role_id)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission.",
      });
    }

    next();
  };
};
