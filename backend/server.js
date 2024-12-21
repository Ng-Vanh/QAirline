const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Swagger Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Airport API',
      version: '1.0.0',
      description: 'API Documentation for Airport management system',
    },
  },
  apis: ['./routes/**/*.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const FlightRoute = require('./routes/FlightRoute');
const AirportRoute = require('./routes/AirportRoute');
const BookingRoutes = require('./routes/BookingRoute');
const UserRoutes = require('./routes/UserRoute');
const PassengerRoutes = require('./routes/PassengerRoute');
const AircraftRoute = require('./routes/AircraftRoute');
const StatisticsRoute = require('./routes/StatisticsRoute');
const ContentRoute = require('./routes/ContentRoute');
const FileRoute = require('./routes/FileRoute');
const SchedulerRoutes = require('./routes/SchedulerRoute');

connectDB();

// Use Routes
app.use('/api/flights', FlightRoute);
app.use('/api/airports', AirportRoute);
app.use('/api/bookings', BookingRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/passengers', PassengerRoutes);
app.use('/api/aircrafts', AircraftRoute);
app.use('/api/statistics', StatisticsRoute);
app.use('/api/content', ContentRoute);
app.use('/scheduler', SchedulerRoutes);
app.use('/api/files', FileRoute);

// Middleware for Debugging
app.use((req, res, next) => {
  console.log('Incoming request body:', req.body);
  next();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
