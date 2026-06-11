import { validationResult } from 'express-validator';
import Cafe from '../models/Cafe.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { recalculateCafeRating } from './reviewController.js';

export const getAllCafes = asyncHandler(async (req, res) => {
  const cafes = await Cafe.find().populate({
    path: 'reviews',
    populate: { path: 'user', select: 'name email role' }
  });

  res.status(200).json({
    success: true,
    data: cafes
  });
});

export const getCafeById = asyncHandler(async (req, res) => {
  const cafe = await Cafe.findById(req.params.id).populate({
    path: 'reviews',
    populate: { path: 'user', select: 'name email role' }
  });

  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Cafe no encontrado' });
  }

  res.status(200).json({ success: true, data: cafe });
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

  const cafe = await Cafe.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Cafe no encontrado' });
  }

  res.status(200).json({ success: true, data: cafe });
});

export const deleteCafe = asyncHandler(async (req, res) => {
  const cafe = await Cafe.findByIdAndDelete(req.params.id);
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Cafe no encontrado' });
  }

  await Review.deleteMany({ cafe: cafe._id });
  res.status(200).json({ success: true, message: 'Cafe eliminado correctamente' });
});

export const voteCafe = asyncHandler(async (req, res) => {
  const cafe = await Cafe.findById(req.params.id);
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Cafe no encontrado' });
  }

  cafe.votes += 1;
  cafe.rating = Number(Math.min(5, Number((cafe.rating + 0.01).toFixed(1))).toFixed(1));
  await cafe.save();

  res.status(200).json({ success: true, data: cafe });
});

export const addReview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Error de validacion', errors: errors.array() });
  }

  const { rating, comment } = req.body;
  const cafe = await Cafe.findById(req.params.id);
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Cafe no encontrado' });
  }

  await Review.create({
    userName: req.user.name,
    rating,
    comment,
    cafe: cafe._id,
    user: req.user.id
  });

  await recalculateCafeRating(cafe._id);

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $inc: { points: 10 } },
    { returnDocument: 'after' }
  ).select('-password');

  const updatedCafe = await Cafe.findById(req.params.id).populate({
    path: 'reviews',
    populate: { path: 'user', select: 'name email role' }
  });

  res.status(201).json({ success: true, data: { cafe: updatedCafe, user: updatedUser } });
});
