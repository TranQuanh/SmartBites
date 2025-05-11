const express = require("express");
const router = express.Router();
const Recipe = require("../../model/recipe.model");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find()
      .select("recipe_id recipe_name image_url filter.cook")
      .limit(limit)
      .skip(skip)
      .lean();

    const formattedRecipes = recipes.map((recipe) => ({
      id: recipe.recipe_id,
      image: recipe.image_url,
      recipe_name: recipe.recipe_name,
      cook: recipe.filter.cook,
    }));

    const totalRecipes = await Recipe.countDocuments();
    const hasMore = skip + recipes.length < totalRecipes;

    console.log(`Page: ${page}, Limit: ${limit}, Skip: ${skip}, Total: ${totalRecipes}, Found: ${recipes.length}, HasMore: ${hasMore}`);
    res.status(200).json({
      recipes: formattedRecipes,
      hasMore,
    });
  } catch (error) {
    console.error("Error retrieving recipes:", error.stack);
    res.status(500).json({ message: "Error retrieving recipes", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    if (isNaN(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe_id" });
    }
    console.log("Querying recipe_id:", recipeId, "Type:", typeof recipeId);
    const recipe = await Recipe.findOne({ recipe_id: recipeId });
    if (!recipe) {
      console.log("No recipe found for recipe_id:", recipeId);
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error retrieving recipe:", error.stack);
    res.status(500).json({ message: "Error retrieving recipe", error: error.message });
  }
});

module.exports = router;