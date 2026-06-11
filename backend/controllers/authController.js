import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { config } from '../config/environment.js';

const createToken = (user) => jwt.sign(
  { id: user._id, name: user.name, email: user.email, role: user.role },
  config.jwtSecret,
  { expiresIn: config.jwtExpiresIn }
);

const sendTokenCookie = (res, token) => {
  const secure = config.nodeEnv === 'production';
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  points: user.points,
  favorites: user.favorites
});

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validacion',
      errors: errors.array()
    });
  }

  const { email, name, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'El usuario ya existe'
    });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await User.create({
    email,
    name,
    password: hashedPassword,
    role: 'user',
    points: 0
  });

  const token = createToken(user);
  sendTokenCookie(res, token);

  res.status(201).json({
    success: true,
    message: 'Registro exitoso',
    data: {
      user: sanitizeUser(user)
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validacion',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales invalidas'
    });
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales invalidas'
    });
  }

  const token = createToken(user);
  sendTokenCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Inicio de sesion exitoso',
    data: {
      user: sanitizeUser(user)
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
  res.status(200).json({ success: true, data: { user: sanitizeUser(user) } });
});

export const logout = asyncHandler(async (req, res) => {
  const secure = config.nodeEnv === 'production';
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax'
  });
  res.status(200).json({ success: true, message: 'Sesion cerrada correctamente' });
});
