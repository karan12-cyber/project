// Basic example controller for gym routes

const getWelcome = (req, res) => {
  res.json({
    status: "ok",
    message: "Gym API is working",
  });
};

module.exports = {
  getWelcome,
};

