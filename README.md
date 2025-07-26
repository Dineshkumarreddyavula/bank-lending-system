# 🏦 Agetware Bank Lending System

A backend system built using **Node.js**, **Express.js**, and **SQLite** to manage customer loans, payments, and account summaries. This project was developed as part of the **Agetware Internship Assignment**.

---

## 🔧 Features

- **LEND**: Issue new loans to customers.
- **PAYMENT**: Accept EMI and lump-sum payments.
- **LEDGER**: View payment history for a loan.
- **ACCOUNT OVERVIEW**: See loan summary per customer.

---

## 🧠 Utility Functions Included

- ✅ Caesar Cipher Encoder/Decoder
- ✅ Indian Currency Formatter
- ✅ Overlapping Range Merger
- ✅ House Sale Loss Minimizer

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/agetware-bank-system.git
cd agetware-bank-system


2. Install Dependencies

npm install

3. Start the Server

node index.js

🗂️ Project Structure

agetware-bank-system/
├── controllers/
│   └── loanController.js
├── db/
│   └── db.js
├── routes/
│   └── loanRoutes.js
│   └── customerRoutes.js
├── utils/
│   └── (optional utility scripts)
├── index.js
├── package.json
├── README.md


🧪 API Endpoints
| Endpoint                      | Method | Description                   |
| ----------------------------- | ------ | ----------------------------- |
| `/loans/lend`                 | POST   | Create a new loan             |
| `/loans/payment/:loanId`      | POST   | Make a payment for a loan     |
| `/loans/ledger/:loanId`       | GET    | Retrieve loan payment history |
| `/loans/overview/:customerId` | GET    | Get overview of all loans     |

📦 Sample LEND Request

{
  "customer_id": "abc123",
  "loan_amount": 100000,
  "loan_period_years": 2,
  "interest_rate_yearly": 10
}

🧰 Tech Stack

-> Node.js

->Express.js

->SQLite (can be replaced with PostgreSQL)

->UUID

->Body-Parser

📬 Notes
->Ensure db.js creates the required tables on first run.

->You can test the API using Postman or Hoppscotch.

->This is a backend-only project — frontend is not required for this assignment.