const mongoose = require('mongoose');

const nutrientSchema = new mongoose.Schema({
  hasCompleteData: { type: Boolean, default: false },
  name: { type: String },
  amount: { type: Number },
  percentDailyValue: { type: String },
  displayValue: { type: String },
  unit: { type: String }
});

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  followersCount: { type: Number, default: 0 },
  madeRecipesCount: { type: Number, default: 0 },
  favoritesCount: { type: Number, default: 0 },
  dateLastModified: { type: String },
  text: { type: String },
  followingCount: { type: Number, default: 0 }
});

const recipeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  recipe_id: { type: Number, required: true },
  recipe_name: { type: String, required: true },
  average_rating: { type: Number, default: 0 },
  image_url: { type: String },
  review_count: { type: Number, default: 0 },
  ingredients: [{ type: String }],
  cooking_directions: [{ type: String }],
  nutritions: {
    niacin: nutrientSchema,
    sugars: nutrientSchema,
    sodium: nutrientSchema,
    carbohydrates: nutrientSchema,
    vitaminB6: nutrientSchema,
    calories: nutrientSchema,
    thiamin: nutrientSchema,
    fat: nutrientSchema,
    folate: nutrientSchema,
    caloriesFromFat: nutrientSchema,
    calcium: nutrientSchema,
    fiber: nutrientSchema,
    magnesium: nutrientSchema,
    iron: nutrientSchema,
    cholesterol: nutrientSchema,
    protein: nutrientSchema,
    vitaminA: nutrientSchema,
    potassium: nutrientSchema,
    saturatedFat: nutrientSchema,
    vitaminC: nutrientSchema
  },
  reviews: { type: Map, of: reviewSchema }
});

const Recipe = mongoose.model('Recipe', recipeSchema, 'recipes');
module.exports = Recipe;