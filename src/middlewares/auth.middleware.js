import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, _, next) => {
  const isAdminHeader = req.headers['x-admin']

  if (isAdminHeader && isAdminHeader === 'true') {
    return next()
  }

  throw new ApiError(403, "Only admin can perform this action");
};
