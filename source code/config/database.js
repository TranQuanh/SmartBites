const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/recipe_database');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};