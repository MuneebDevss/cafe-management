const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3005;
app.use(bodyParser.json());
mongoose
  .connect("mongodb+srv://i222702:MuneebCode%4069@cluster1.wptez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1/payments")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
const transactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now },
});
const Transaction = mongoose.model('Transaction', transactionSchema);
app.post('/payment', async (req, res) => {
  const {orderId, customerId, amount} = req.body;
  try {
    const orderResponse = await axios.get(`http://localhost:3002/orders/${orderId}`);
    if (!orderResponse.data || !orderResponse.data.total) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const orderTotal = orderResponse.data.total;
    if (amount !== orderTotal) {
      return res.status(400).json({ error: 'Payment amount does not match order total' });
    }
    const transaction = new Transaction({
      orderId,
      customerId,
      amount,
      status: 'Confirmed',
    });
    await transaction.save();
    res.json({ message: 'Payment processed successfully', transactionId: transaction._id });
  } catch (error) {
    console.error('Error processing payment:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(port, () => {
  console.log(`Payment service listening at http://localhost:${port}`);
});
