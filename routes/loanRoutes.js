const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController'); // check this path carefully

// Now this should work
router.post('/lend', loanController.createLoan);
router.post('/payment/:loanId', loanController.recordPayment);
router.get('/ledger/:loanId', loanController.getLedger);
router.get('/overview/:customerId', loanController.getAccountOverview);

module.exports = router;
