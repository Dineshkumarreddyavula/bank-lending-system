const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');

exports.createCustomer = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Customer name is required' });

  const customer_id = uuidv4();

  const query = `
    INSERT INTO Customers (customer_id, name)
    VALUES (?, ?)
  `;
  db.run(query, [customer_id, name], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Database error' });
    }
    return res.status(201).json({ customer_id, name });
  });
};

exports.getAllCustomers = (req, res) => {
  db.all(`SELECT * FROM Customers`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching customers' });
    res.status(200).json({ customers: rows });
  });
};
