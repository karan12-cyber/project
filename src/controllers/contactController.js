const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

// @POST /api/contact
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const contact = await Contact.create({ name, email, phone, subject, message });

    // Auto-reply to user
    try {
      await sendEmail({
        to: email,
        subject: 'We received your message!',
        html: `<h2>Hi ${name},</h2><p>Thanks for reaching out! We'll get back to you within 24 hours.</p><p><strong>Your message:</strong></p><p>${message}</p>`
      });
    } catch (emailErr) {
      console.log('Email not sent (check .env config):', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Message sent successfully', contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/contact — Admin: Get all enquiries
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/contact/:id — Admin: Update status
exports.updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/contact/:id — Admin
exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
