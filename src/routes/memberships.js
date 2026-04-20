const express = require('express');
const router = express.Router();
const { getPlans, createPlan, updatePlan, deletePlan, subscribe } = require('../controllers/membershipController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getPlans);
router.post('/', protect, adminOnly, createPlan);
router.put('/:id', protect, adminOnly, updatePlan);
router.delete('/:id', protect, adminOnly, deletePlan);
router.post('/subscribe', protect, subscribe);

module.exports = router;
