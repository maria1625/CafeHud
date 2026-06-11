import express from 'express';
import { body } from 'express-validator';
import {
  deleteReview,
  getAllReviews,
  getMyReviews,
  getReviewById,
  updateReview
} from '../controllers/reviewController.js';
import { requireAdmin, verifyToken } from '../middleware/auth.js';

const router = express.Router();

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Calificacion invalida'),
  body('comment').trim().notEmpty().withMessage('El comentario es obligatorio')
];

router.use(verifyToken);
router.get('/mine', getMyReviews);
router.get('/', requireAdmin, getAllReviews);
router.get('/:id', getReviewById);
router.put('/:id', reviewValidation, updateReview);
router.delete('/:id', deleteReview);

export default router;
