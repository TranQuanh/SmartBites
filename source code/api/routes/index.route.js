const recipeRouter = require('./recipe.route');

module.exports = (app) => {
    app.use("/api/recipes",recipeRouter);
};