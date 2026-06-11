import express from 'express';
import { body } from 'express-validator';
import {
  addReview,
  createCafe,
  deleteCafe,
  getAllCafes,
  getCafeById,
  updateCafe,
  voteCafe
} from '../controllers/cafeController.js';
import { requireAdmin, verifyToken } from '../middleware/auth.js';

const router = express.Router();

const cafeValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('brand').trim().notEmpty().withMessage('La marca es obligatoria'),
  body('description').trim().notEmpty().withMessage('La descripcion es obligatoria'),
  body('origin').trim().notEmpty().withMessage('El origen es obligatorio'),
  body('roast').trim().isIn(['Claro', 'Medio', 'Oscuro']).withMessage('Tueste invalido'),
  body('price').isFloat({ min: 0 }).withMessage('Precio invalido'),
  body('imageUrl').trim().notEmpty().withMessage('La imagen es obligatoria')
];

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Calificacion invalida'),
  body('comment').trim().notEmpty().withMessage('El comentario es obligatorio')
];

router.get('/', getAllCafes);
router.get('/:id', getCafeById);
router.post('/', verifyToken, requireAdmin, cafeValidation, createCafe);
router.put('/:id', verifyToken, requireAdmin, cafeValidation, updateCafe);
router.delete('/:id', verifyToken, requireAdmin, deleteCafe);
router.post('/:id/vote', verifyToken, voteCafe);
router.post('/:id/reviews', verifyToken, reviewValidation, addReview);

export default router;
