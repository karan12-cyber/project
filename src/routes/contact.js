const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContactStatus, deleteContact } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id', protect, adminOnly, updateContactStatus);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
