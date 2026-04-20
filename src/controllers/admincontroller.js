const User = require('../models/User');
const Booking = require('../models/Booking');
const GymClass = require('../models/GymClass');
const MembershipPlan = require('../models/MembershipPlan');

// @GET /api/admin/dashboard — Stats overview
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, activeMembers, totalClasses, totalBookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ 'membership.status': 'active' }),
      GymClass.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: 'confirmed' })
    ]);

    const recentUsers = await User.find({ role: 'user' }).sort('-createdAt').limit(5).select('name email createdAt membership');
    const recentBookings = await Booking.find().sort('-createdAt').limit(5)
      .populate('user', 'name email')
      .populate('gymClass', 'name schedule');

    res.json({
      success: true,
      stats: { totalUsers, activeMembers, totalClasses, totalBookings },
      recentUsers,
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/users — Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('membership.plan', 'name price').sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/users/:id/role — Change user role
exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
