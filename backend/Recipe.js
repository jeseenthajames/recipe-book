const mongoose = require("mongoose");

const js_recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Recipe name is required"],
      trim: true,
      maxlength: 100
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snack",
        "Dessert",
        "Other"
      ]
    },

    ingredients: {
      type: String,
      required: [true, "Ingredients are required"],
      trim: true
    },

    steps: {
      type: String,
      required: [true, "Preparation steps are required"],
      trim: true
    },

    cookingTime: {
      type: Number,
      required: [true, "Cooking time is required"],
      min: [1, "Cooking time must be at least 1 minute"],
      validate: {
        validator: Number.isInteger,
        message: "Cooking time must be a whole number"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Recipe", js_recipeSchema);