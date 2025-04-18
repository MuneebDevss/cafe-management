const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3004;
app.use(bodyParser.json());
mongoose
  .connect("mongodb+srv://i222702:MuneebCode%4069@cluster1.wptez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1/inventory")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
const itemSchema = new mongoose.Schema({
  menuId: { type: String, required: true, unique: true },
  price: Number,
  stock: Number,
});
const Item = mongoose.model('Item', itemSchema);
app.post('/update', async (req, res) => {
  const { updates } = req.body; 
  try {
    const updateResults = [];
    for (const update of updates) {
      const { menuId, price, stock } = update;
      if (!menuId) {
        updateResults.push({ menuId, status: 'failed}'});
        continue;}
      const item = await Item.findOne({ menuId });
      if (!item) {
        updateResults.push({ menuId, status: 'failed'});
        continue;}
      if (price !== undefined) item.price = price;
      if (stock !== undefined) item.stock = stock;
      await item.save();
      updateResults.push({ menuId, status: 'success' });
    }

    res.json({ results: updateResults });
  } catch (error) {
    console.error('Error updating items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(port, () => {
  console.log(`Inventory service listening at http://localhost:${port}`);
});
