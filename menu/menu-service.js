const express = require('express');
const mongoose = require("mongoose");
const app = express();
const port = 3000;

mongoose
  .connect("mongodb+srv://i222702:MuneebCode%4069@cluster1.wptez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1/orders")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const menuSchema = new mongoose.Schema({
  menuId: { type: String, required: true, unique: true },
  price: Number,
  stock: Number,
});
const Menu = mongoose.model('Menu', menuSchema);
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await Menu.find({});
    const availableItems = menuItems.filter(item => item.stock > 0);
    res.json({
       availableItems,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(port, () => {
  console.log(`Menu service listening at http://localhost:${port}`);
});
