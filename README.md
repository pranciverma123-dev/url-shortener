# URL Shortener Application

## Project Overview

This is a full-stack URL Shortener application built using the MERN stack. It allows users to shorten long URLs, manage them, track analytics, and generate QR codes. The system also includes authentication, protected routes, Redis caching, and Swagger API documentation.

The project follows a modular architecture with separate frontend and backend layers for scalability and maintainability.

---

## Features

### Authentication System
- User registration and login
- Password reset functionality
- Protected routes for authenticated users
- Session handling for secure access

### URL Management
- Create shortened URLs from long URLs
- Custom alias support for URLs
- Update existing URLs
- Delete URLs
- Enable and disable URLs

### Analytics
- Track total clicks for each URL
- View detailed analytics per URL
- User-specific URL tracking
- Real-time click updates

### Additional Features
- QR code generation for shortened URLs
- User dashboard to manage all URLs
- Redis caching for performance optimization
- Swagger API documentation for backend APIs

---

## Tech Stack

### Frontend
- React.js
- React Router DOM
- JavaScript (ES6+)
- CSS

### Backend
- Node.js
- Express.js
- MVC architecture

### Database
- MongoDB

### Tools and Libraries
- Redis (caching and optimization)
- Swagger (API documentation)
- dotenv (environment configuration)

---


---

## System Architecture

The application is built using a client-server architecture:

- Frontend handles user interface and routing
- Backend manages API requests and business logic
- MongoDB stores user and URL data
- Redis is used for caching frequently accessed data
- Swagger provides API documentation and testing interface

---

## API Features

- User authentication APIs
- URL creation and management APIs
- Redirect handling for short URLs
- Analytics tracking APIs
- URL status management (enable/disable/delete)

---


