# Project Title

A  full-stack web application with a React frontend and Django REST Framework backend with the Power of AI.
<!-- ![ecommerce](image.png)-->
[![Render Ping](https://github.com/anantacoder/ecommerce/actions/workflows/ecommerce.yml/badge.svg)](https://github.com/anantacoder/ecommerce/actions/workflows/ecommerce.yml)

![image](https://github.com/user-attachments/assets/8a5d12bf-8935-4dfe-bcc0-a36bf3ea2385)

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

* [Prerequisites](#prerequisites)
* [Backend Setup](#backend-setup)
* [Frontend Setup](#frontend-setup)
* [Environment Variables](#environment-variables)
* [Running the App](#running-the-app)
* [API Endpoints](#api-endpoints)
* [Project Structure](#project-structure)
* [License](#license)

## Features

* User authentication with JWT (signup, login, logout)
* Email verification and OTP support
* Product & category listing
* Shopping cart functionality
* Payment integration (Razorpay/Juspay)
* AI-powered chatbot (Google Gemini)

## Tech Stack

* **Frontend:** React, Redux, React Router DOM
* **Backend:** Django, Django REST Framework, Simple JWT
* **Database:** PostgreSQL (Supabase)
* **Email:** Gmail SMTP
* **Payments:** Razorpay or Juspay
* **Chatbot:** Google Gemini API

## Getting Started

### Prerequisites

* Node.js & npm
* Python 3.8+

### Backend Setup

1. Create & activate virtual environment:

   ```bash
   python3 -m venv env
   source env/bin/activate  # Windows: env\Scripts\activate
   ```
2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables in `.env` (see below).
4. Apply migrations:

   ```bash
   python manage.py migrate
   ```
5. Create superuser:

   ```bash
   python manage.py createsuperuser
   ```
6. Run development server:

   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm start
   ```

## Environment Variables

| Variable              | Description                            |
| --------------------- | -------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string           |
| `EMAIL_HOST_USER`     | SMTP email address                     |
| `EMAIL_HOST_PASSWORD` | SMTP app password                      |
| `SECRET_KEY`          | Django secret key                      |
| `FRONTEND_URL`        | URL of the React app  |
| `RAZORPAY_KEY_ID`     | Razorpay API key ID                    |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret                    |
| `GEMINI_API_KEY`      | Google Gemini API key                  |

## Running the App

* Backend: [http://localhost:8000](http://localhost:8000)
* Frontend: [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| POST   | `/api/auth/signup/`             | User registration                |
| POST   | `/api/auth/login/`              | Obtain JWT tokens                |
| POST   | `/api/auth/logout/`             | Blacklist refresh token (logout) |
| GET    | `/api/auth/verify-email/`       | Email link verification          |
| POST   | `/api/auth/verify-otp/`         | OTP verification                 |
| GET    | `/api/store/products/`          | List products                    |
| GET    | `/api/store/categories/`        | List categories                  |
| GET    | `/api/store/cart/`              | Retrieve user's cart             |
| POST   | `/api/store/cart/add/`          | Add item to cart                 |
| POST   | `/api/payments/create-order/`   | Create payment order             |
| POST   | `/api/support/chatbot/message/` | Send message to chatbot          |

## Project Structure

```
backend/              # Django project
├── accounts/         # Auth app
├── store/            # Products & cart app
├── payments/         # Payments app
├── support/          # Chatbot app
├── backend/          # Django settings & URLs
└── manage.py
frontend/             # React project
├── src/
│   ├── components/   # Reusable UI components
│   ├── features/     # Feature folders (auth, cart, etc.)
│   ├── app/          # Redux store
│   └── App.js        # Main router setup
└── package.json
```

## License

This project is licensed under the MIT License.
