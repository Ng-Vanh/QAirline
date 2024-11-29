const express = require('express');
const mongoose = require('mongoose');
const app = express();

const FlightRoutes = require('./routes/FlightRoute');

const cors = require('cors');
app.use(cors());

// MongoDB Atlas Connection URI
const dbURI = 'mongodb+srv://admin:admin@cluster0.33dyt9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use('/api/flights', FlightRoutes);
// Connect to MongoDB Atlas using Mongoose
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

const PORT = process.env.PORT || 5000;
// Your routes and server setup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
