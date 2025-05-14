# TuniBalance

TuniBalance is a comprehensive financial management system designed to help businesses track transactions, manage revenues, generate financial reports, and analyze financial performance.

![TuniBalance Logo](client/public/assets/img/logo.webp)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [AI Prediction Service](#ai-prediction-service)
- [Contributing](#contributing)
- [Keywords](#keywords)
- [License](#license)

## Overview

TuniBalance is a full-stack application that provides businesses with tools to manage their financial operations efficiently. The application includes features for transaction management, revenue tracking, invoice management, financial reporting, and user management with different roles and permissions.

## Features

- **User Management**
  - Authentication and authorization
  - Different user roles (admin, business owner, comptable)
  - Profile management
  - Friend requests and messaging

- **Transaction Management**
  - Create, view, and filter financial transactions
  - Track expenses and income
  - Categorize transactions

- **Revenue Tracking**
  - Visualize revenue over time periods
  - Generate revenue reports
  - Analyze revenue trends

- **Financial Reporting**
  - Generate income statements
  - Balance sheets
  - Financial KPIs and metrics

- **Invoice Management**
  - Create and manage invoices for clients
  - Track invoice status and payments
  - Generate PDF invoices

- **Calendar and Appointments**
  - Schedule and manage appointments
  - Business calendar

- **AI Predictions**
  - Predict future financial trends
  - Risk analysis
  - Financial recommendations

## Tech Stack

### Frontend
- React 19
- Vite
- Redux Toolkit for state management
- Redux Persist for local storage
- React Router for navigation
- Tailwind CSS for styling
- Chart.js and Recharts for data visualization
- Axios for API requests
- Socket.io for real-time features

### Backend
- NestJS framework
- MongoDB with Mongoose
- JWT for authentication
- WebSockets for real-time communication
- PDF generation with PDFKit
- Excel export with ExcelJS
- Email notifications

### AI Prediction Service
- Python
- TensorFlow/scikit-learn for machine learning models
- Flask API for predictions

## Project Structure

```
TuniBalance/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store and slices
│   │   ├── routes/         # Route components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Backend NestJS application
│   ├── src/                # Source code
│   │   ├── auth/           # Authentication module
│   │   ├── facture/        # Invoice module
│   │   ├── journal/        # Journal module
│   │   ├── transactions/   # Transactions module
│   │   ├── user/           # User module
│   │   └── main.ts         # Application entry point
│   ├── package.json        # Backend dependencies
│   └── nest-cli.json       # NestJS configuration
│
├── Dockerfile              # Docker configuration
├── Jenkinsfile             # Jenkins CI/CD pipeline
└── README.md               # Project documentation
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB
- Python 3.8+ (for AI prediction service)

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run start:dev
```

### Using Docker
```bash
# Build and run with Docker
docker-compose up --build
```

## Usage

### User Roles

1. **Admin**
   - Manage users
   - View business owners
   - System configuration

2. **Business Owner**
   - Dashboard with financial overview
   - Manage transactions and invoices
   - View financial reports
   - Schedule appointments

3. **Comptable (Accountant)**
   - Manage transactions
   - Generate financial reports
   - Track revenue and expenses

### Key Workflows

1. **Transaction Management**
   - Create new transactions
   - Filter and search transactions
   - View transaction details

2. **Revenue Tracking**
   - Select date range for revenue analysis
   - View revenue charts and statistics
   - Export revenue reports

3. **Financial Reporting**
   - Generate income statements
   - View balance sheets
   - Analyze financial KPIs

## API Documentation

The backend API provides endpoints for all application features. Key endpoints include:

- `/auth` - Authentication endpoints
- `/users` - User management
- `/transactions` - Transaction management
- `/facture` - Invoice management
- `/journal` - Journal entries
- `/bilan` - Balance sheet

For detailed API documentation, run the server and visit `/api-docs`.

## AI Prediction Service

TuniBalance includes an AI prediction service that provides financial forecasting and recommendations:

- Prediction of future revenue and expenses
- Risk analysis for financial decisions
- Personalized financial recommendations

To use the AI service, start the Python API:

```bash
# Windows
start_api.bat

# Linux/Mac
chmod +x start_api.sh
./start_api.sh
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Keywords

TuniBalance incorporates the following key technologies and concepts:

- **Financial Management System** - Complete solution for business financial operations
- **Accounting Software** - Track transactions, generate reports, and manage invoices
- **Business Intelligence** - Data visualization and financial analytics
- **MERN Stack** - MongoDB, Express (NestJS), React, Node.js
- **Machine Learning Finance** - AI-powered financial predictions and recommendations
- **Financial Dashboard** - Interactive visualization of financial data
- **Invoice Management System** - Create, track, and manage client invoices
- **Financial Reporting Tool** - Generate income statements and balance sheets
- **User Role Management** - Admin, business owner, and accountant access levels
- **Real-time Financial Updates** - WebSocket integration for live data
- **Responsive Financial Application** - Works on desktop and mobile devices
- **Secure Authentication** - JWT-based user authentication and authorization
- **Financial Data Export** - PDF and Excel export capabilities
- **Appointment Scheduling** - Business calendar management
- **Docker Containerization** - Easy deployment with Docker
- **CI/CD Pipeline** - Continuous integration with Jenkins

## License

This project is licensed under the [MIT License](LICENSE).
