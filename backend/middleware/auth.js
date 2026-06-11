import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';

const getTokenFromRequest = (req) => {
  const headerToken = req.headers.authorization?.split(' ')[1];
  if (headerToken) return headerToken;
  return req.cookies?.auth_token;
};

export const verifyToken = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'No estas autenticado' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalido o expirado' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Autenticacion requerida' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'No tienes permisos para esta accion' });
  }
  next();
};

export const requireAdmin = requireRole('admin');
export const requireClient = requireRole('user', 'admin');
