const Booking = require('../models/BookingModel');  // Assuming you have a Booking model
const User = require('../models/UserModel');  // Assuming you have a User model

exports.getStatistics = async (req, res) => {
  try {
    // Total number of bookings
    const totalBookings = await Booking.countDocuments();

    // Total revenue
    const revenue = await Booking.aggregate([
      { $group: { _id: null, revenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenue.length > 0 ? revenue[0].revenue : 0;

    // Total number of users (bookings can have users associated)
    const totalUsers = await User.countDocuments();

    // Optional: Get bookings per month for a chart
    // const bookingsPerMonth = await Booking.aggregate([
    //   {
    //     $group: {
    //       _id: { $month: '$createdAt' },  // Group by month
    //       totalBookings: { $sum: 1 },
    //       totalRevenue: { $sum: '$price' }
    //     }
    //   },
    //   { $sort: { '_id': 1 } }  // Sort by month
    // ]);

    return res.status(200).json({
      totalBookings,
      totalRevenue,
      totalUsers,
    //   bookingsPerMonth
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
