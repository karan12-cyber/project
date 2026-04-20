const GymClass = require('../models/GymClass');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @GET /api/classes
exports.getClasses = async (req, res) => {
  try {
    const { category, difficulty, day } = req.query;
    let filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (day) filter['schedule.day'] = day;

    const classes = await GymClass.find(filter).populate('trainer', 'name profileImage specializations');
    res.json({ success: true, count: classes.length, classes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/classes/:id
exports.getClass = async (req, res) => {
  try {
    const gymClass = await GymClass.findById(req.params.id).populate('trainer');
    if (!gymClass) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, gymClass });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/classes — Admin
exports.createClass = async (req, res) => {
  try {
    const gymClass = await GymClass.create(req.body);
    res.status(201).json({ success: true, gymClass });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/classes/:id — Admin
exports.updateClass = async (req, res) => {
  try {
    const gymClass = await GymClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gymClass) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, gymClass });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/classes/:id — Admin
exports.deleteClass = async (req, res) => {
  try {
    await GymClass.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Class removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/classes/:id/book — User books a class
exports.bookClass = async (req, res) => {
  try {
    const gymClass = await GymClass.findById(req.params.id);
    if (!gymClass) return res.status(404).json({ success: false, message: 'Class not found' });
    if (gymClass.enrolledCount >= gymClass.capacity)
      return res.status(400).json({ success: false, message: 'Class is fully booked' });

    const alreadyBooked = await Booking.findOne({ user: req.user._id, gymClass: req.params.id, status: 'confirmed' });
    if (alreadyBooked) return res.status(400).json({ success: false, message: 'Already booked this class' });

    const booking = await Booking.create({ user: req.user._id, gymClass: req.params.id });
    await GymClass.findByIdAndUpdate(req.params.id, { $inc: { enrolledCount: 1 } });
    await User.findByIdAndUpdate(req.user._id, { $push: { bookings: booking._id } });

    res.status(201).json({ success: true, message: 'Class booked successfully', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/classes/bookings/:bookingId/cancel — User cancels booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    booking.status = 'cancelled';
    await booking.save();
    await GymClass.findByIdAndUpdate(booking.gymClass, { $inc: { enrolledCount: -1 } });

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/classes/my-bookings — User's bookings
exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'gymClass', populate: { path: 'trainer', select: 'name' } })
      .sort('-createdAt');
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
