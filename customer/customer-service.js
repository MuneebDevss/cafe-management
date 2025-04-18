const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;
app.use(bodyParser.json());
mongoose
  .connect("mongodb+srv://i222702:MuneebCode%4069@cluster1.wptez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1/customers")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  loyaltyPoints: { type: Number, default: 0 },
});
const User = mongoose.model('User', userSchema);
app.get('/user/points', async (req, res) => {
  const  {userId}  = req.query;
  if (!userId) {
    return res.status(400).json({error:'Please provide userId'});
  }
try {
    const user = await User.findOne(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });}
res.json({ userId: user.userId, name: user.name, email: user.email, loyaltyPoints: user.loyaltyPoints });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({error:'Internal server error'});
  }
});

app.post('/user/points', async (req, res) => {
  const { userId, email, amountSpent } = req.body;
  if ((!userId && !email) || amountSpent <= 0) {
    return res.status(400).json({ error: 'Please provide userId or email and a valid amountSpent' });
  }
try {
    const query = userId ? { userId } : { email };
    let user = await User.findOne(query);
    if (!user) {
      res.status(404).json({ error:'User not found'});
      }
    user.loyaltyPoints += amountSpent;
    await user.save();
    res.json({ message: 'Loyalty points updated', loyaltyPoints: user.loyaltyPoints });
  } catch (error) {
    console.error('Error updating loyalty points:', error);
    res.status(500).json({error:'Internal server error' });
  }
});
app.listen(port, () => {
  console.log("Customer service listening at http://localhost:",port);
});
