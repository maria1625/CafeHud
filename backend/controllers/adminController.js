import User from '../models/User.js';
import Cafe from '../models/Cafe.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { recalculateCafeRating } from './reviewController.js';
import { validationResult } from 'express-validator';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({ success: true, data: users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Rol invalido' });
  }

  const user = await User.findByIdAndUpdate(id, { role }, { returnDocument: 'after' }).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }

  res.status(200).json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
  res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
});

export const getAllCafes = asyncHandler(async (req, res) => {
  const cafes = await Cafe.find().populate('reviews');
  res.status(200).json({ success: true, data: cafes });
});

export const createCafe = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Error de validacion', errors: errors.array() });
  }

  const cafe = new Cafe(req.body);
  await cafe.save();
  res.status(201).json({ success: true, data: cafe });
});

export const updateCafe = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Error de validacion', errors: errors.array() });
  }

  const { id } = req.params;
  const cafe = await Cafe.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Cafe no encontrado' });
  }
  res.status(200).json({ success: true, data: cafe });
});

export const deleteCafe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cafe = await Cafe.findByIdAndDelete(id);
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Cafe no encontrado' });
  }

  await Review.deleteMany({ cafe: cafe._id });
  res.status(200).json({ success: true, message: 'Cafe eliminado correctamente' });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name email role')
    .populate('cafe', 'name brand imageUrl price');

  res.status(200).json({ success: true, data: reviews });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Resena no encontrada' });
  }

  await recalculateCafeRating(review.cafe);
  res.status(200).json({ success: true, message: 'Resena eliminada correctamente' });
});
