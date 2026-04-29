# Loan Management System

A full-stack Loan Management System designed to streamline the complete lending lifecycle — from borrower onboarding and eligibility checks to loan approval, disbursement, repayment collection, and closure.

This project simulates a real-world internal lending workflow used by financial institutions and lending companies.

---

# Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

# Core Features

## Borrower Portal

Borrowers can manage their loan journey through a dedicated self-service portal.

### Includes:
- User Registration & Login
- Personal Details Submission
- BRE (Business Rule Engine) Eligibility Check
- Salary Slip Upload (PDF / JPG / PNG)
- Loan Application
- Loan History & Status Tracking

---

## Internal Operations Dashboard

Role-based dashboards for internal teams to manage loan processing efficiently.

### Modules:

### Sales Team
- View new borrower leads
- Search prospective customers

### Sanction Team
- Review loan applications
- Approve or reject loans
- Add rejection reasons

### Disbursement Team
- Release approved loan funds
- Track sanctioned loans

### Collection Team
- Record repayments
- Validate UTR references
- Track outstanding balances
- Auto-close fully paid loans

---

# User Roles

The system supports role-based access control.

- Admin
- Sales
- Sanction
- Disbursement
- Collection
- Borrower

---

# Business Rule Engine (BRE)

Loan eligibility is validated using backend business rules.

An application is rejected if:

- Age is below 23 or above 50
- Monthly salary is below ₹25,000
- PAN format is invalid
- Applicant is unemployed

---

# Loan Calculation

Simple Interest is calculated dynamically.

```text
SI = (P × R × T) / (365 × 100)
```
Where:

- P = Principal Amount
- R = Interest Rate (12% p.a.)
- T = Tenure in Days
 Total Repayment = Principal + Interest

# Project Setup
### Clone Repository
 ```bash
    git clone <your-repository-url>
    cd project-folder
```
### Backend Setup
 ```bash
    cd backend
    npm install 
    npm run dev
 ```
### Frontend Setup
 ```bash
    cd frontend
    npm install
    npm run dev
 ```
### Seed Demo Accounts

 Create demo users for testing:
 ```bash
    cd backend
    npm run seed
 ```
### Demo Login Credentials
 Password for All Accounts
 ```bash
 Password@123
```
 Users:
```bash
    admin@lms.com
    sales@lms.com
    sanction@lms.com
    disbursement@lms.com
    collection@lms.com
    borrower@lms.com
```

## Key Highlights
- Full-stack production-style architecture
- Clean modular backend structure
- Role-based dashboards
- Real-world lending workflow
- JWT secure authentication
- File upload handling
- Loan lifecycle automation