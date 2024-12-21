const Booking = require('../models/BookingModel');
const User = require('../models/UserModel');

exports.getStatistics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const revenue = await Booking.aggregate([
      { $group: { _id: null, revenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenue.length > 0 ? revenue[0].revenue : 0;

    const totalUsers = await User.countDocuments();

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
