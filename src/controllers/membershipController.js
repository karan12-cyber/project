const MembershipPlan = require('../models/MembershipPlan');
const User = require('../models/User');

// @GET /api/memberships — Get all active plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true });
    res.json({ success: true, count: plans.length, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/memberships — Admin: Create plan
exports.createPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create(req.body);
    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/memberships/:id — Admin: Update plan
exports.updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/memberships/:id — Admin: Delete plan
exports.deletePlan = async (req, res) => {
  try {
    await MembershipPlan.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Plan deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/memberships/subscribe — User subscribes to a plan
exports.subscribe = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await MembershipPlan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const user = await User.findByIdAndUpdate(req.user._id, {
      membership: { plan: planId, startDate, endDate, status: 'active' }
    }, { new: true }).populate('membership.plan');

    res.json({ success: true, message: `Subscribed to ${plan.name} plan`, membership: user.membership });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
