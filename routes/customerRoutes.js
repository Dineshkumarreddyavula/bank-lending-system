const express = require('express');
const router = express.Router();
const { createCustomer, getAllCustomers } = require('../controllers/customerController');

// Create a customer
router.post('/create', createCustomer);

// Get all customers (optional utility endpoint)
router.get('/', getAllCustomers);

module.exports = router;
