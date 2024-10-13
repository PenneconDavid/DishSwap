import User from "../models/User";

/**
 * Fetch user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - User document
 */
export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Add recipe to user's favorites
 * @param {Object} user - User document
 * @param {string} recipeId - Recipe ID to add to favorites
 * @returns {Promise<void>}
 */
export const addFavoriteRecipe = async (user, recipeId) => {
  if (!user.favorites.includes(recipeId)) {
    user.favorites.push(recipeId);
    await user.save();
  }
};

/**
 * Remove recipe from user's favorites
 * @param {Object} user - User document
 * @param {string} recipeId - Recipe ID to remove from favorites
 * @returns {Promise<void>}
 */
export const removeFavoriteRecipe = async (user, recipeId) => {
  user.favorites = user.favorites.filter(
    (favoriteId) => favoriteId.toString() !== recipeId
  );
  await user.save();
};
