const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const loanRoutes = require('./routes/loanRoutes');
const customerRoutes = require('./routes/customerRoutes');

app.use(bodyParser.json());
app.use('/loans', loanRoutes);
app.use('/customers', customerRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
