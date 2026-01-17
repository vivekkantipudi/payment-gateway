# Multi-Service Payment Gateway System

A robust, containerized Fintech solution providing a full-stack payment processing engine. This system supports merchant management, secure order creation, public checkout for customers, and real-time transaction analytics.

## Features

* **Merchant Dashboard**: Real-time tracking of total volume, success rates, and transaction history.
* **Public Checkout**: A customer-facing interface for processing payments via UPI and Cards.
* **Secure API**: Merchant endpoints protected via X-Api-Key and X-Api-Secret validation.
* **Async Processing**: Simulates real-world bank delays (5–10s) with deterministic success/failure logic.
* **Built-in Validation**: Implements the Luhn Algorithm for card validation and Regex for VPA checks.

## Architecture

The system is built as a microservices architecture managed by Docker Compose:

* **API (Port 8000)**: Node.js Express backend.
* **Dashboard (Port 3000)**: React-based merchant analytics interface.
* **Checkout (Port 3001)**: React-based customer payment portal.
* **Database**: PostgreSQL for persistent storage of orders and payments.
# Project Structure
```bash
payment-gateway/
│
├── docker-compose.yml     
├── README.md              
├── .env.example           
│
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── PaymentGatewayApplication.*
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── config/
│   │   └── resources/schema.sql   
│
├── frontend/              
│   ├── Dockerfile
│   └── src/pages/Login.jsx, Dashboard.jsx, Transactions.jsx
│
└── checkout-page/         
    ├── Dockerfile
    └── src/pages/Checkout.jsx, Success.jsx, Failure.jsx
```



## Setup and Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/vivekkantipudi/payment-gateway
    cd payment-gateway
    ```

2.  **Environment Configuration**:
    Ensure the `.env` file exists in the root directory with the following variables:
    ```env
    DATABASE_URL=postgresql://gateway_user:gateway_pass@postgres:5432/payment_gateway
    PORT=8000
    TEST_MODE=false
    ```

3.  **Launch the System**:
    ```bash
    docker-compose up --build -d
    ```

## Testing the Flow

### 1. Merchant Authentication
Login to the Dashboard at `http://localhost:3000/login`.
* **Test Email**: `test@example.com`
* **Credentials**: Use the pre-seeded API Key `key_test_abc123` and Secret `secret_test_xyz789` displayed on the dashboard.

### 2. End-to-End Transaction (CLI)
Create a new order via the Merchant API:
```bash
curl -X POST http://localhost:8000/api/v1/orders \
-H "X-Api-Key: key_test_abc123" \
-H "X-Api-Secret: secret_test_xyz789" \
-H "Content-Type: application/json" \
-d '{"amount": 50000, "currency": "INR", "receipt": "rec_001"}'
