import User from "../models/User";

/**
 * Fetch user by ID
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} - User document
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User not found with ID: ${userId}`);
  }
  return user;
};

/**
 * Fetch user by email
 * @param {string} email - User's email
 * @returns {Promise<Object>} - User document
 */
export const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`User not found with email: ${email}`);
  }
  return user;
};

/**
 * Add recipe to user's favorites
 * @param {Object} user - User document
 * @param {string} recipeId - Recipe ID to add to favorites
 * @returns {Promise<void>}
 */
export const addFavoriteRecipe = async (user, recipeId) => {
  if (!user) {
    throw new Error("User object is null");
  }
  if (!user.favorites) {
    user.favorites = [];
  }
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
  if (!user) {
    throw new Error("User object is null");
  }
  if (!user.favorites) {
    return; // No favorites to remove
  }
  user.favorites = user.favorites.filter(
    (favoriteId) => favoriteId.toString() !== recipeId
  );
  await user.save();
};
