const Trainer = require('../models/Trainer');

// @GET /api/trainers
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({ isActive: true });
    res.json({ success: true, count: trainers.length, trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/trainers/:id
exports.getTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    res.json({ success: true, trainer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/trainers — Admin
exports.createTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json({ success: true, trainer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/trainers/:id — Admin
exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    res.json({ success: true, trainer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/trainers/:id — Admin
exports.deleteTrainer = async (req, res) => {
  try {
    await Trainer.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Trainer removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
