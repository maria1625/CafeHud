import User from '../models/User.js';
import Cafe from '../models/Cafe.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }

  const favorites = user.favorites.map((cafe) => cafe._id.toString());
  res.status(200).json({ success: true, data: favorites });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const cafe = await Cafe.findById(req.params.id);
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Cafe no encontrado' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }

  const cafeObjectId = cafe._id;
  const exists = user.favorites.some((favoriteId) => favoriteId.toString() === cafeObjectId.toString());

  if (exists) {
    user.favorites = user.favorites.filter((favoriteId) => favoriteId.toString() !== cafeObjectId.toString());
  } else {
    user.favorites.push(cafeObjectId);
  }

  await user.save();
  const favorites = user.favorites.map((favorite) => favorite.toString());
  res.status(200).json({ success: true, data: favorites });
});
