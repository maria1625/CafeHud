import { asyncHandler } from '../middleware/errorHandler.js';

export const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

export const rootInfo = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CaféHub Premium API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/auth/me',
      '/api/v1/cafes',
      '/api/v1/favorites',
      '/api/v1/admin/users'
    ]
  });
});
