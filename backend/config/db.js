const mongoose = require('mongoose');
const { startScheduler } = require('../controllers/SchedulerController');

const dbURI = 'mongodb+srv://admin:admin@cluster0.33dyt9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let bucket;
let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB Atlas via shared config');

    bucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'uploads',
    });

    console.log('GridFSBucket initialized');
    isConnected = true;

    startScheduler();

    ///////////////////////////////////////////
    console.log('Successfully started backend');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Get the GridFSBucket
const getBucket = () => {
  if (!isConnected) {
    throw new Error('MongoDB is not connected. Call connectDB first.');
  }
  return bucket;
};


module.exports = {
  dbURI,
  connectDB,
  getBucket,
};
