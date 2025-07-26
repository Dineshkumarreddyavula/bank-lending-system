const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');

// Simple Interest: I = P * N * (R / 100)
function calculateSimpleInterest(P, N, R) {
  return P * N * (R / 100);
}

exports.createLoan = (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;
  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const interest = calculateSimpleInterest(loan_amount, loan_period_years, interest_rate_yearly);
  const total_amount = loan_amount + interest;
  const total_months = loan_period_years * 12;
  const monthly_emi = parseFloat((total_amount / total_months).toFixed(2));

  const loan_id = uuidv4();

  const insertLoan = `
    INSERT INTO Loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
  `;
  db.run(insertLoan, [loan_id, customer_id, loan_amount, total_amount, interest_rate_yearly, loan_period_years, monthly_emi], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(201).json({
      loan_id,
      customer_id,
      total_amount_payable: total_amount,
      monthly_emi
    });
  });
};

exports.recordPayment = (req, res) => {
  const loanId = req.params.loanId;
  const { amount, payment_type } = req.body;

  const getLoan = `SELECT * FROM Loans WHERE loan_id = ?`;
  db.get(getLoan, [loanId], (err, loan) => {
    if (err || !loan) return res.status(404).json({ message: 'Loan not found' });

    const insertPayment = `
      INSERT INTO Payments (payment_id, loan_id, amount, payment_type, payment_date)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const payment_id = uuidv4();
    db.run(insertPayment, [payment_id, loanId, amount, payment_type], function (err) {
      if (err) return res.status(500).json({ message: 'Database error on payment' });

      const getTotalPaid = `SELECT SUM(amount) as paid FROM Payments WHERE loan_id = ?`;
      db.get(getTotalPaid, [loanId], (err, result) => {
        const amount_paid = result?.paid || 0;
        const remaining_balance = parseFloat((loan.total_amount - amount_paid).toFixed(2));
        const emis_left = Math.ceil(remaining_balance / loan.monthly_emi);

        return res.status(200).json({
          payment_id,
          loan_id: loanId,
          message: 'Payment recorded successfully.',
          remaining_balance,
          emis_left
        });
      });
    });
  });
};

exports.getLedger = (req, res) => {
  const loanId = req.params.loanId;

  const getLoan = `SELECT * FROM Loans WHERE loan_id = ?`;
  db.get(getLoan, [loanId], (err, loan) => {
    if (err || !loan) return res.status(404).json({ message: 'Loan not found' });

    const getPayments = `SELECT payment_id as transaction_id, payment_date as date, amount, payment_type as type FROM Payments WHERE loan_id = ?`;
    db.all(getPayments, [loanId], (err, transactions) => {
      if (err) return res.status(500).json({ message: 'Error fetching transactions' });

      const totalPaidQuery = `SELECT SUM(amount) as paid FROM Payments WHERE loan_id = ?`;
      db.get(totalPaidQuery, [loanId], (err, result) => {
        const amount_paid = result?.paid || 0;
        const balance_amount = parseFloat((loan.total_amount - amount_paid).toFixed(2));
        const emis_left = Math.ceil(balance_amount / loan.monthly_emi);

        return res.status(200).json({
          loan_id: loan.loan_id,
          customer_id: loan.customer_id,
          principal: loan.principal_amount,
          total_amount: loan.total_amount,
          monthly_emi: loan.monthly_emi,
          amount_paid,
          balance_amount,
          emis_left,
          transactions
        });
      });
    });
  });
};

exports.getAccountOverview = (req, res) => {
  const customerId = req.params.customerId;

  const getLoans = `SELECT * FROM Loans WHERE customer_id = ?`;
  db.all(getLoans, [customerId], (err, loans) => {
    if (err || loans.length === 0) return res.status(404).json({ message: 'No loans found' });

    const getPayments = `SELECT loan_id, SUM(amount) as paid FROM Payments WHERE loan_id IN (${loans.map(() => '?').join(',')}) GROUP BY loan_id`;
    const loanIds = loans.map(loan => loan.loan_id);

    db.all(getPayments, loanIds, (err, payments) => {
      const paidMap = {};
      (payments || []).forEach(p => paidMap[p.loan_id] = p.paid);

      const loansOverview = loans.map(loan => {
        const interest = calculateSimpleInterest(loan.principal_amount, loan.loan_period_years, loan.interest_rate);
        const amount_paid = paidMap[loan.loan_id] || 0;
        const emis_left = Math.ceil((loan.total_amount - amount_paid) / loan.monthly_emi);

        return {
          loan_id: loan.loan_id,
          principal: loan.principal_amount,
          total_amount: loan.total_amount,
          total_interest: interest,
          emi_amount: loan.monthly_emi,
          amount_paid,
          emis_left
        };
      });

      res.status(200).json({
        customer_id: customerId,
        total_loans: loans.length,
        loans: loansOverview
      });
    });
  });
};
exports.lendLoan = async (req, res) => {
    try {
        const { customerId, principal, years, rate } = req.body;

        const interest = principal * years * rate / 100;
        const totalAmount = principal + interest;
        const emi = Math.ceil(totalAmount / (years * 12));

        // Save to database...
        const loan = await Loan.create({
            customerId,
            principal,
            interest,
            totalAmount,
            emi,
            years,
        });

        res.json({
            message: 'Loan created successfully',
            loanId: loan.id,
            totalAmount,
            emi
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

