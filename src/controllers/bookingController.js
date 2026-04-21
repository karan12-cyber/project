const Booking = require("../models/Booking");
const Class = require("../models/Class");
const User = require("../models/User");

// @route POST /api/bookings  (Protected)
exports.createBooking = async (req, res) => {
  try {
    const { classId, date, notes } = req.body;

    const gymClass = await Class.findById(classId);
    if (!gymClass) return res.status(404).json({ success: false, message: "Class not found" });

    if (gymClass.enrolled >= gymClass.capacity) {
      return res.status(400).json({ success: false, message: "Class is fully booked" });
    }

    // Check for duplicate booking
    const existing = await Booking.findOne({ user: req.user.id, class: classId, date, status: { $ne: "cancelled" } });
    if (existing) return res.status(400).json({ success: false, message: "You already booked this class on this date" });

    const booking = await Booking.create({ user: req.user.id, class: classId, date, notes });

    // Increment enrolled count & add to user's bookings
    await Class.findByIdAndUpdate(classId, { $inc: { enrolled: 1 } });
    await User.findByIdAndUpdate(req.user.id, { $push: { bookings: booking._id } });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/bookings/my  (Protected)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("class", "name schedule trainer image category")
      .sort({ date: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/bookings/:id/cancel  (Protected)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.status === "cancelled") return res.status(400).json({ success: false, message: "Already cancelled" });

    booking.status = "cancelled";
    await booking.save();

    await Class.findByIdAndUpdate(booking.class, { $inc: { enrolled: -1 } });

    res.json({ success: true, message: "Booking cancelled", data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/bookings  (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("class", "name category")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
