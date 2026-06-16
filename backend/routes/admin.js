import express from 'express';
import { body } from 'express-validator';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCafes,
  getInventory,
  getLowStockCafes,
  createCafe,
  updateCafe,
  updateCafeInventory,
  deleteCafe,
  getAllReviews,
  deleteReview
} from '../controllers/adminController.js';

const router = express.Router();

const cafeValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('brand').trim().notEmpty().withMessage('La marca es obligatoria'),
  body('description').trim().notEmpty().withMessage('La descripcion es obligatoria'),
  body('origin').trim().notEmpty().withMessage('El origen es obligatorio'),
  body('roast').trim().isIn(['Claro', 'Medio', 'Oscuro']).withMessage('Tueste invalido'),
  body('price').isFloat({ min: 0 }).withMessage('Precio invalido'),
  body('imageUrl').trim().notEmpty().withMessage('La imagen es obligatoria'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock invalido'),
  body('minimumStock').optional().isInt({ min: 0 }).withMessage('Stock minimo invalido'),
  body('available').optional().isBoolean().withMessage('Disponibilidad invalida')
];

const inventoryValidation = [
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock invalido'),
  body('minimumStock').optional().isInt({ min: 0 }).withMessage('Stock minimo invalido')
];

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(requireAdmin);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Cafe management
router.get('/cafes', getAllCafes);
router.post('/cafes', cafeValidation, createCafe);
router.put('/cafes/:id', cafeValidation, updateCafe);
router.patch('/cafes/:id/inventory', inventoryValidation, updateCafeInventory);
router.delete('/cafes/:id', deleteCafe);

// Inventory module
router.get('/inventory', getInventory);
router.get('/inventory/low-stock', getLowStockCafes);

// Review management
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;
