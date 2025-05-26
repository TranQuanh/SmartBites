const express = require("express");
const router = express.Router();
const Recipe = require("../../model/recipe.model");
const path = require("path");
const { spawn } = require("child_process");
const modelPyPath = path.resolve(__dirname, "../../model/model.py");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.q) {
      filter.recipe_name = { $regex: req.query.q, $options: "i" };
    }
    if (req.query.cook) {
      // handle cook time ranges
      if (req.query.cook.includes('-')) {
        const [min, max] = req.query.cook.split('-').map(Number);
        filter["filter.cook"] = { $gte: min, $lte: max };
      } else if (req.query.cook.endsWith('+')) {
        filter["filter.cook"] = { $gte: parseInt(req.query.cook) };
      } else {
        filter["filter.cook"] = parseInt(req.query.cook);
      }
    }
    if (req.query.ingredients) {
      if (req.query.ingredients.includes('-')) {
        const [min, max] = req.query.ingredients.split('-').map(Number);
        filter["filter.ingredients"] = { $gte: min, $lte: max };
      } else if (req.query.ingredients.endsWith('+')) {
        filter["filter.ingredients"] = { $gte: parseInt(req.query.ingredients) };
      } else {
        filter["filter.ingredients"] = parseInt(req.query.ingredients);
      }
    }
    if (req.query.calories) {
      if (req.query.calories.includes('-')) {
        const [min, max] = req.query.calories.split('-').map(Number);
        filter["filter.calories"] = { $gte: min, $lte: max };
      } else if (req.query.calories.endsWith('+')) {
        filter["filter.calories"] = { $gte: parseInt(req.query.calories) };
      } else {
        filter["filter.calories"] = parseInt(req.query.calories);
      }
    }

    // Thêm hỗ trợ lấy theo nhiều id
    if (req.query.ids) {
      const ids = req.query.ids.split(",").map(Number).filter(Boolean);
      const recipes = await Recipe.find({ recipe_id: { $in: ids } })
        .select("recipe_id recipe_name image_url filter.cook")
        .lean();
      const formattedRecipes = recipes.map((recipe) => ({
        id: recipe.recipe_id,
        image: recipe.image_url,
        recipe_name: recipe.recipe_name,
        cook: recipe.filter.cook,
      }));
      return res.status(200).json({ recipes: formattedRecipes, hasMore: false });
    }

    const recipes = await Recipe.find(filter)
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

    const totalRecipes = await Recipe.countDocuments(filter);
    const hasMore = skip + recipes.length < totalRecipes;

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

router.post("/recommendation", async (req, res) => {
  try {
    const {
      calories,
      fat,
      carbohydrates,
      protein,
      cholesterol,
      sodium,
      fiber,
      ingredients
    } = req.body;

    // Đảm bảo các giá trị là string (tránh undefined/null)
    const args = [
      calories || "0",
      fat || "0",
      carbohydrates || "0",
      protein || "0",
      cholesterol || "0",
      sodium || "0",
      fiber || "0",
      ingredients || ""
    ];

    // Đường dẫn python trong venv
    const pythonPath = "D:/Worker/SmartBytes/source code/new_venv/Scripts/python.exe"; // Windows
    // Nếu dùng Linux/Mac: const pythonPath = "/path/to/new_venv/bin/python";

    const py = spawn(pythonPath, [
      modelPyPath,
      ...args
    ]);

    let result = "";
    let errorResult = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorResult += data.toString();
      console.error("Python error:", data.toString());
    });

    py.on("close", async (code) => {
      try {
        // Nếu python trả về lỗi, trả lỗi cho FE
        if (errorResult) {
          return res.status(500).json({ message: "Python error", error: errorResult });
        }
        // Nếu kết quả rỗng hoặc không phải JSON, trả lỗi
        if (!result || !result.trim().startsWith("[")) {
          return res.status(500).json({ message: "Model output invalid", output: result });
        }
        let recommendations;
        try {
          recommendations = JSON.parse(result);
        } catch (e) {
          return res.status(500).json({ message: "JSON parse error", output: result });
        }
        if (!Array.isArray(recommendations) || recommendations.length === 0) {
          return res.status(200).json({ recipes: [] });
        }
        const ids = recommendations.map(r => r.recipe_id);

        // Lấy 3 recipe từ DB
        const recipes = await Recipe.find({ recipe_id: { $in: ids } })
          .select("recipe_id recipe_name image_url filter.cook")
          .lean();

        // Map đúng thứ tự
        const formatted = ids.map(id => {
          const r = recipes.find(x => x.recipe_id === id);
          return r
            ? {
                id: r.recipe_id,
                image: r.image_url,
                recipe_name: r.recipe_name,
                cook: r.filter.cook,
              }
            : null;
        }).filter(Boolean);

        res.status(200).json({ recipes: formatted });
      } catch (err) {
        res.status(500).json({ message: "Error parsing recommendations", error: err.message, raw: result });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error in recommendation", error: error.message });
  }
});

module.exports = router;