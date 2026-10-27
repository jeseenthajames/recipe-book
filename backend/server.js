const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Recipe = require("./Recipe");

const js_app = express();

js_app.use(cors());
js_app.use(express.json());

// Test route
js_app.get("/", (req, res) => {
res.send("Recipe Book API is running!");
});

// CREATE: Add a recipe
js_app.post("/api/recipes", async (req, res) => {
try {
const js_recipe = await Recipe.create(req.body);
res.status(201).json(js_recipe);
} catch (js_error) {
res.status(400).json({ message: js_error.message });
}
});

// READ: Get all recipes
js_app.get("/api/recipes", async (req, res) => {
try {
const js_recipes = await Recipe.find().sort({ createdAt: -1 });
res.json(js_recipes);
} catch (js_error) {
res.status(500).json({ message: js_error.message });
}
});

// READ: Get one recipe by ID
js_app.get("/api/recipes/:id", async (req, res) => {
try {
const js_recipe = await Recipe.findById(req.params.id);


if (!js_recipe) {
  return res.status(404).json({ message: "Recipe not found" });
}

res.json(js_recipe);


} catch (js_error) {
res.status(400).json({ message: "Invalid recipe ID" });
}
});

// UPDATE: Edit a recipe
js_app.put("/api/recipes/:id", async (req, res) => {
try {
const js_recipe = await Recipe.findByIdAndUpdate(
req.params.id,
req.body,
{
new: true,
runValidators: true
}
);


if (!js_recipe) {
  return res.status(404).json({ message: "Recipe not found" });
}

res.json(js_recipe);


} catch (js_error) {
res.status(400).json({ message: js_error.message });
}
});

// DELETE: Remove a recipe
js_app.delete("/api/recipes/:id", async (req, res) => {
try {
const js_recipe = await Recipe.findByIdAndDelete(req.params.id);

if (!js_recipe) {
  return res.status(404).json({ message: "Recipe not found" });
}

res.json({ message: "Recipe deleted successfully" });


} catch (js_error) {
res.status(400).json({ message: "Invalid recipe ID" });
}
});

// Connect to MongoDB and start server
const js_startServer = async () => {
try {
await mongoose.connect(process.env.MONGODB_URI);
console.log("MongoDB connected successfully!");


const js_port = process.env.PORT || 5000;

js_app.listen(js_port, () => {
  console.log(`Server running at http://localhost:${js_port}`);
});


} catch (js_error) {
console.error("MongoDB connection failed:", js_error.message);
process.exit(1);
}
};

js_startServer();
