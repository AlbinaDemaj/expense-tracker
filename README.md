#  Expense Tracker — Selego Technical Assessment

Full-stack app (React + Node.js/Express + MongoDB) to track expenses by category, show totals, and trigger an email alert when the total spending exceeds a budget limit.

---

##  Features
-  Create and manage categories  
-  Add and delete expenses (amount, description, category)  
-  View totals and per-category summary (`GET /api/expenses/summary`)  
-  Budget alert banner (triggers email when over limit)  
-  Clean REST API with consistent `{ ok, data } | { ok, error }` responses  
-  Environment variables handled securely via `.env`

---

## 🛠️ Tech Stack
**Frontend:** React, Axios  
**Backend:** Node.js, Express, Mongoose, Nodemailer  
**Database:** MongoDB Atlas  
**Email Integration:** Brevo SMTP (or Gmail SMTP as fallback)

---

##  Run Locally

###  Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your MongoDB URI and optional email config
npm run dev

###  Frontend
cd ../frontend
npm install
cp .env.example .env   # REACT_APP_API_URL=http://localhost:5000
npm start


 API Endpoints
Method	Endpoint	Description
GET	/api/categories	Get all categories
POST	/api/categories	Create new category
GET	/api/expenses	Get all expenses
POST	/api/expenses	Add new expense
DELETE	/api/expenses/:id	Delete expense
GET	/api/expenses/summary	Get total & per-category totals
Email Service

The email logic is implemented in:
backend/services/emailService.js

To activate real email alerts, set your Brevo (Sendinblue) SMTP credentials inside your .env:

BREVO_SMTP_USER=your_smtp_login
BREVO_SMTP_PASS=your_smtp_password
EMAIL_FROM=your_verified_sender@domain.com
EMAIL_TO=recipient@example.com
BUDGET_LIMIT=1000


If the credentials are missing, the app gracefully skips email sending and logs:

“Email not configured — skipping alert.”

Data Models
Category Schema
{
  name: String,
  createdAt: Date
}

Expense Schema
{
  categoryId: ObjectId,   // Reference to Category
  amount: Number,
  description: String,
  createdAt: Date
}


Categories and expenses are stored in separate collections — flat, not nested.

 Design & Code Decisions

Clean architecture with separate folders for models, routes, and services

“One route = one job” principle

Early return pattern used in all controllers

Consistent and descriptive API responses

Flat schema design for clarity and scalability

Budget alert triggers when total crosses the limit for the first time

Error handling ensures backend never crashes even if email fails

 Testing Steps

Run backend → npm run dev

Run frontend → npm start

Add a few categories and expenses

When total exceeds $1000, banner turns red and email logic triggers

Delete an expense and verify totals update live

 Time & Challenges

Total time spent: ≈ 3.5 hours

Backend: ~2h

Frontend: ~1h

Styling & polish: ~0.5h

Challenges:

SMTP key creation on Brevo temporarily unavailable
→ handled gracefully with fallback + clear documentation in README

 Project Structure
expense-tracker/
├── backend/
│   ├── models/
│   │   ├── Category.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── categories.js
│   │   └── expenses.js
│   ├── services/
│   │   └── emailService.js
│   ├── server.js
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── styles.css
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env.example
└── README.md

 Submission Notes

This project fulfills all Selego Technical Assessment requirements:

Functional full-stack CRUD app

Clean REST API

MongoDB data persistence

Optional email integration via Brevo SMTP

Modern React UI

Proper .env separation & documentation

 Example .env Files
backend/.env.example
PORT=5000
MONGO_URI=your_mongodb_connection_string_with_dbname
CORS_ORIGIN=http://localhost:3000
BUDGET_LIMIT=1000

# Optional email config
BREVO_SMTP_USER=
BREVO_SMTP_PASS=
EMAIL_FROM=
EMAIL_TO=

frontend/.env.example
REACT_APP_API_URL=http://localhost:5000
REACT_APP_BUDGET_LIMIT=1000


 Author: Albina Demaj
 Email: demajalbina3@gmail.com

🌐 Portfolio: https://albinademajportfolio.netlify.app/

“Focus on clean functionality over perfection — simplicity done right.”