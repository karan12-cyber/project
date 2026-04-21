const express = require('express');
const router = express.Router();
const { getClasses, getClass, createClass, updateClass, deleteClass, bookClass, cancelBooking, myBookings } = require('../controllers/classController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getClasses);
router.get('/my-bookings', protect, myBookings);
router.get('/:id', getClass);
router.post('/', protect, adminOnly, createClass);
router.put('/:id', protect, adminOnly, updateClass);
router.delete('/:id', protect, adminOnly, deleteClass);
router.post('/:id/book', protect, bookClass);
router.put('/bookings/:bookingId/cancel', protect, cancelBooking);

module.exports = router;
