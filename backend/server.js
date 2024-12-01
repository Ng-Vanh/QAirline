const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');

const FlightRoute = require('./routes/FlightRoute');
const AirportRoute = require('./routes/AirportRoute');
const BookingRoutes = require('./routes/BookingRoute');
const UserRoutes = require('./routes/UserRoute');
const PassengerRoutes = require('./routes/PassengerRoute');
const AircraftRoute = require('./routes/AircraftRoute');
const StatisticsRoute = require('./routes/StatisticsRoute')
const ContentRoute = require('./routes/ContentRoute')

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Airport API',
      version: '1.0.0',
      description: 'API Documentation for Airport management system',
    },
  },
  apis: ['./routes/*.js'], // Path to your route files
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas Connection URI
const dbURI = 'mongodb+srv://admin:admin@cluster0.33dyt9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/flights', FlightRoute);
app.use('/api/airports', AirportRoute)
app.use('/api/bookings', BookingRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/passengers', PassengerRoutes);
app.use('/api/aircrafts', AircraftRoute);
app.use('/api/statistics', StatisticsRoute);
app.use('/api/content', ContentRoute);

app.use((req, res, next) => {
  console.log('Incoming request body:', req.body);
  next();
});

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
