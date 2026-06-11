import { validationResult } from 'express-validator';
import Cafe from '../models/Cafe.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const recalculateCafeRating = async (cafeId) => {
  const reviews = await Review.find({ cafe: cafeId });
  const votes = reviews.length;
  const rating = votes
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / votes).toFixed(1))
    : 0;

  await Cafe.findByIdAndUpdate(cafeId, {
    reviews: reviews.map((review) => review._id),
    rating,
    votes
  });
};

const canManageReview = (user, review) => {
  if (user.role === 'admin') return true;
  return review.user?.toString() === user.id;
};

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name email role points')
    .populate('cafe', 'name brand imageUrl price');

  res.status(200).json({ success: true, data: reviews });
});

export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate('cafe', 'name brand imageUrl price')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: reviews });
});

export const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name email role')
    .populate('cafe', 'name brand imageUrl price');

  if (!review) {
    return res.status(404).json({ success: false, message: 'Resena no encontrada' });
  }

  if (!canManageReview(req.user, review)) {
    return res.status(403).json({ success: false, message: 'No tienes permisos para ver esta resena' });
  }

  res.status(200).json({ success: true, data: review });
});

export const updateReview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Error de validacion', errors: errors.array() });
  }

  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Resena no encontrada' });
  }

  if (!canManageReview(req.user, review)) {
    return res.status(403).json({ success: false, message: 'No tienes permisos para editar esta resena' });
  }

  review.rating = req.body.rating;
  review.comment = req.body.comment;
  await review.save();
  await recalculateCafeRating(review.cafe);

  const updatedReview = await Review.findById(review._id)
    .populate('user', 'name email role')
    .populate('cafe', 'name brand imageUrl price');

  res.status(200).json({ success: true, data: updatedReview });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Resena no encontrada' });
  }

  if (!canManageReview(req.user, review)) {
    return res.status(403).json({ success: false, message: 'No tienes permisos para eliminar esta resena' });
  }

  const cafeId = review.cafe;
  await Review.findByIdAndDelete(review._id);
  await recalculateCafeRating(cafeId);

  res.status(200).json({ success: true, message: 'Resena eliminada correctamente' });
});

export { recalculateCafeRating };
