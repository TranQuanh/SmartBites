const express = require('express');
const router = express.Router();
const Recipe = require('../../model/recipe.model'); 


router.get("/", async (req, res) => {
    try {
      // Lấy query parameters cho phân trang
      const page = parseInt(req.query.page) || 1; // Trang mặc định là 1
      const limit = parseInt(req.query.limit) || 10; // Giới hạn 10 document
      const skip = (page - 1) * limit;
  
      // Truy vấn với limit, select và lean
      const recipes = await Recipe.find()
        .select('recipe_id recipe_name average_rating image_url ingredients') // Chỉ lấy các trường cần thiết
        .limit(limit) // Giới hạn số document
        .skip(skip) // Bỏ qua document của các trang trước
        .lean(); // Trả về plain JavaScript object
  
      console.log(`Found ${recipes.length} recipes`); // Log để debug
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Error retrieving recipes:', error.stack); // Log lỗi chi tiết
      res.status(500).json({ message: "Error retrieving recipes", error: error.message });
    }
  });


router.get("/:id", async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id); // Chuyển chuỗi thành số
    if (isNaN(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe_id" });
    }
    console.log('Querying recipe_id:', recipeId, 'Type:', typeof recipeId);
    const recipe = await Recipe.findOne({ recipe_id: recipeId }); // Truy vấn với số
    // console.log('Query result:', recipe);
    if (!recipe) {
      console.log('No recipe found for recipe_id:', recipeId);
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe); // Trả về toàn bộ tài liệu
  } catch (error) {
    console.error('Error retrieving recipe:', error.stack);
    res.status(500).json({ message: "Error retrieving recipe", error: error.message });
  }
});

module.exports = router;