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

  if (!['client', 'user', 'admin'].includes(role)) {
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
  // #region debug-point B:get-all-cafes
  fetch("http://127.0.0.1:7777/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "inventory-not-reflecting",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "adminController.js:getAllCafes",
      msg: "[DEBUG] backend returning cafes to admin",
      data: {
        total: cafes.length,
        sample: cafes.slice(0, 3).map((cafe) => ({
          id: cafe._id,
          name: cafe.name,
          stock: cafe.stock,
          minimumStock: cafe.minimumStock
        }))
      },
      ts: Date.now()
    })
  }).catch(() => {});
  // #endregion
  res.status(200).json({ success: true, data: cafes });
});

export const getInventory = asyncHandler(async (req, res) => {
  const cafes = await Cafe.find().select('name brand origin price stock minimumStock available imageUrl');
  res.status(200).json({ success: true, data: cafes });
});

export const getLowStockCafes = asyncHandler(async (req, res) => {
  const cafes = await Cafe.find({
    $expr: { $lte: ['$stock', '$minimumStock'] }
  }).select('name brand origin price stock minimumStock available imageUrl');

  res.status(200).json({ success: true, data: cafes });
});

export const createCafe = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Error de validacion', errors: errors.array() });
  }

  // #region debug-point B:create-received
  fetch("http://127.0.0.1:7777/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "inventory-not-reflecting",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "adminController.js:createCafe",
      msg: "[DEBUG] backend received create payload",
      data: req.body,
      ts: Date.now()
    })
  }).catch(() => {});
  // #endregion
  const cafe = new Cafe(req.body);
  await cafe.save();
  // #region debug-point B:create-saved
  fetch("http://127.0.0.1:7777/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "inventory-not-reflecting",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "adminController.js:createCafe",
      msg: "[DEBUG] backend saved created cafe",
      data: {
        id: cafe._id,
        name: cafe.name,
        stock: cafe.stock,
        minimumStock: cafe.minimumStock,
        available: cafe.available
      },
      ts: Date.now()
    })
  }).catch(() => {});
  // #endregion
  res.status(201).json({ success: true, data: cafe });
});

export const updateCafe = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Error de validacion', errors: errors.array() });
  }

  const { id } = req.params;
  // #region debug-point B:update-received
  fetch("http://127.0.0.1:7777/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "inventory-not-reflecting",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "adminController.js:updateCafe",
      msg: "[DEBUG] backend received update payload",
      data: { id, payload: req.body },
      ts: Date.now()
    })
  }).catch(() => {});
  // #endregion
  const cafe = await Cafe.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Cafe no encontrado' });
  }
  // #region debug-point B:update-saved
  fetch("http://127.0.0.1:7777/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "inventory-not-reflecting",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "adminController.js:updateCafe",
      msg: "[DEBUG] backend updated cafe persisted",
      data: {
        id: cafe._id,
        name: cafe.name,
        stock: cafe.stock,
        minimumStock: cafe.minimumStock,
        available: cafe.available
      },
      ts: Date.now()
    })
  }).catch(() => {});
  // #endregion
  res.status(200).json({ success: true, data: cafe });
});

export const updateCafeInventory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Error de validacion', errors: errors.array() });
  }

  const { id } = req.params;
  const { stock, minimumStock } = req.body;

  const update = {};
  if (stock !== undefined) update.stock = stock;
  if (minimumStock !== undefined) update.minimumStock = minimumStock;

  if (!Object.keys(update).length) {
    return res.status(400).json({ success: false, message: 'No hay campos de inventario para actualizar' });
  }

  const cafe = await Cafe.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true });
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
