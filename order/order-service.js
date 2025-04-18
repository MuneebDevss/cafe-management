const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;
app.use(bodyParser.json());
mongoose
  .connect("mongodb+srv://i222702:MuneebCode%4069@cluster1.wptez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1/orders")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
const orderSchema = new mongoose.Schema({
  customerId: {type: String, required: true},
  items: {type: Map, of: Number, required: true},
  total: Number,
  date: { type: Date},
});
const Order = mongoose.model('Order', orderSchema);
app.post('/orders', async (req, res) => {
  const { customerId, items } = req.body;
  try {
    const customerResponse = await axios.get('http://localhost:3001/user/points', {
      params: { userId: customerId },
    });
    if (!customerResponse.data) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    const menuResponse = await axios.get('http://localhost:3000/menu');
    const menuItems = menuResponse.data.menu;
    let total = 0;
    for (const [itemId, quantity] of Object.entries(items)) {
      const menuItem = menuItems.find(mi => mi.menuId === itemId);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item ${itemId} not found` });
      }
      if (menuItem.stock < quantity) {
        return res.status(400).json({ error: `Insufficient stock for item ${itemId}` });
      }
      total += menuItem.price * quantity;
    }
    const order = new Order({
      customerId,
      items,
      total,
    });
    await order.save();
    await axios.post('http://localhost:3001/user/points', {
      userId: customerId,
      amountSpent: total,
    });

    const updates = items.map(([menuId, quantity]) => ({
      menuId,
      stock: -quantity, 
    }));
    await axios.post('http://localhost:3004/update', { updates });

    res.json({ message: 'Order placed successfully', orderId: order._id, total });
  } catch (error) {
    console.error('Error processing order:', error.message);
    if (error.response && error.response.data) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(port, () => {
  console.log(`Order service listening at http://localhost:${port}`);
});
