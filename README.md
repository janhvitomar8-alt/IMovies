# IMovies — Movie Ticket Booking System

**A Full-Stack Web Application for Online Movie Ticket Booking**

**Project Repository:** [github.com/janhvitomar8-alt/IMovies](https://github.com/janhvitomar8-alt/IMovies)

---

## Abstract

IMovies is a full-stack web application developed to simplify the process of browsing movies and booking cinema tickets through an interactive web interface. The system integrates a React-based frontend with a Node.js and Express backend, using MongoDB for persistent data storage.

The application provides user authentication, movie browsing, seat selection, booking confirmation, and a dedicated section for viewing bookings. Its modular architecture separates the client-side interface from backend services, supporting maintainability and future expansion.

This project demonstrates the practical implementation of full-stack web development concepts, RESTful API integration, database connectivity, and authentication-based access control.

## 1. Introduction

Online movie ticket booking systems provide a convenient alternative to traditional, counter-based ticket reservations. They allow users to explore available movies, select a show, choose seats, and manage their booking information through a digital platform.

IMovies was developed to demonstrate how these capabilities can be implemented using modern web technologies. The system combines an interactive user interface with backend APIs and a database to support the core movie-booking workflow.

## 2. Problem Statement

Traditional ticket booking can require users to visit a cinema or depend on separate booking services to obtain movie and show information. A digital booking interface can make this process more convenient and accessible.

The objective of IMovies is to provide a centralized web application through which users can browse movies, select seats, submit booking details, and view their bookings.

## 3. Project Objectives

The primary objectives of the project are:

- To develop a responsive and user-friendly movie browsing interface.
- To implement user registration and login functionality.
- To provide movie details and a seat-selection interface.
- To implement booking creation through backend APIs.
- To store booking information in a MongoDB database.
- To provide a dedicated interface for viewing user bookings.
- To demonstrate integration between frontend, backend, and database components.
- To apply authentication and basic security practices in a full-stack application.

## 4. Scope of the Project

The current project focuses on the core workflow of a movie ticket booking application.

**Included functionality**
- User registration and authentication.
- Movie browsing and movie details.
- Show selection and seat selection.
- Booking submission and confirmation.
- Retrieval and display of user bookings.
- Backend API integration and database persistence.

**Current implementation note:** The payment interface uses a simulated payment flow. Integration with a real payment gateway, live cinema inventory, and actual ticket issuance would require additional development.

## 5. Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React.js | Component-based user interface |
| Build tool | Vite | Frontend development and build process |
| Programming language | JavaScript | Application logic |
| Styling | CSS | Layout and visual presentation |
| Backend runtime | Node.js | Server-side execution |
| Backend framework | Express.js | HTTP routes and API services |
| Database | MongoDB | Persistent data storage |
| ODM | Mongoose | MongoDB models and data operations |
| Authentication | JSON Web Tokens (JWT) | Token-based authentication |
| Version control | Git | Source code version management |
| Code hosting | GitHub | Repository hosting and collaboration |

## 6. System Architecture

IMovies follows a client–server architecture with three primary layers.

### 6.1 Presentation Layer

The React frontend provides the user interface for browsing movies, viewing details, selecting seats, completing the booking flow, and accessing the My Bookings section.

### 6.2 Application Layer

The Node.js and Express backend processes HTTP requests, validates booking details, verifies authentication tokens for protected routes, and coordinates database operations.

### 6.3 Data Layer

MongoDB stores application data. Mongoose provides the model-based interface used by the backend to interact with the database.

### Architecture Flow

```text
+-----------------------------+
|          User               |
+-----------------------------+
              |
              v
+-----------------------------+
| React.js + Vite Frontend    |
| Movie UI, Seats, Bookings   |
+-----------------------------+
              |
              | HTTP / REST API
              v
+-----------------------------+
| Node.js + Express Backend   |
| Routes, Validation, Auth    |
+-----------------------------+
              |
              | Mongoose
              v
+-----------------------------+
|       MongoDB Database      |
| Users and Booking Records   |
+-----------------------------+
```

## 7. Functional Modules

### 7.1 User Authentication Module

Provides user registration and login functionality. Authentication tokens are used to authorize access to protected booking operations.

### 7.2 Movie Browsing Module

Displays movie information and allows users to open individual movie details before proceeding to ticket selection.

### 7.3 Seat Selection Module

Provides an interface for selecting seats for a chosen show. The selected seats contribute to the booking details and calculated ticket amount.

### 7.4 Booking Management Module

Submits booking information to the backend, including movie details, show date, show time, selected seats, and total amount. The backend validates the request and creates a booking record.

### 7.5 My Bookings Module

Provides an interface for viewing booking information associated with the user. The backend includes an authenticated endpoint for retrieving the logged-in user's bookings.

### 7.6 Database Integration Module

Uses MongoDB and Mongoose to persist application records and retrieve stored booking information.

## 8. Booking Workflow

The primary booking workflow follows these steps:

1. The user opens the application and browses the available movie listings.
2. The user selects a movie and views its details.
3. The user proceeds to the ticket booking interface.
4. The user selects a show date, show time, and preferred seats.
5. The application calculates the total booking amount.
6. The user proceeds through the simulated payment interface.
7. The frontend submits the booking details to the Express backend.
8. The backend validates the request and verifies the user's authentication token.
9. The booking is stored in MongoDB.
10. The application displays the booking confirmation and updates the My Bookings interface.

## 9. Backend API Overview

The backend exposes REST-style endpoints for authentication and booking operations.

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Verify backend availability |
| `/api/bookings` | POST | Create an authenticated booking |
| `/api/bookings/my` | GET | Retrieve the authenticated user's bookings |

The application also mounts authentication routes under `/api/auth`. Individual authentication endpoints depend on the implementation in the authentication route file.

### Booking Request Data

The booking creation endpoint accepts the following information:

- `movieId` — identifier of the selected movie.
- `movieTitle` — title of the movie.
- `showDate` — selected show date.
- `showTime` — selected show time.
- `seats` — list of selected seat identifiers.
- `totalAmount` — total booking amount.

A valid authentication token must be included in the request's `Authorization` header.

## 10. Database Design

MongoDB is used as the application's database.

The booking workflow stores information including:

- User reference.
- Movie identifier and title.
- Show date and time.
- Selected seats.
- Total amount.
- Booking reference.
- Creation and update timestamps, where configured by the model.

User information is maintained through the authentication system. The exact schema fields, constraints, and relationships are defined by the application's Mongoose models.

## 11. Security Considerations

The application incorporates basic security measures for authenticated booking operations:

- JWT-based authentication for protected booking endpoints.
- Server-side validation of required booking fields.
- Validation of seat lists and booking amounts.
- Separation of environment-specific configuration from application source code.
- Git ignore rules for environment files and dependency directories.

Production deployment should additionally include secure secret management, HTTPS, appropriate CORS restrictions, rate limiting, and stronger booking and payment validation.

## 12. Installation and Execution

### Prerequisites

- Node.js and npm.
- Git.
- A MongoDB database, such as MongoDB Atlas.

### Step 1: Clone the repository

```bash
git clone https://github.com/janhvitomar8-alt/IMovies.git
cd IMovies
```

### Step 2: Install backend dependencies

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory with the required configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Replace the example values with your own credentials. Do not commit the `.env` file to GitHub.

Start the backend using the development script configured in `server/package.json`:

```bash
npm run dev
```

### Step 3: Install frontend dependencies

Open a second terminal from the project root:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local development URL printed by Vite in the terminal.

## 13. Testing and Verification

The following functional checks are relevant to the current implementation:

- Verify that the backend starts and connects to MongoDB.
- Verify registration and login functionality.
- Confirm that protected booking requests require authentication.
- Validate booking requests with missing or invalid fields.
- Confirm that valid booking requests return a successful creation response.
- Verify that booking records persist in MongoDB.
- Verify that the My Bookings interface displays the user's booking information.

These checks describe the project's verification criteria; comprehensive automated test coverage should be added separately.

## 14. Limitations

The current implementation focuses on the core application workflow. Potential limitations include:

- Payment processing is simulated rather than connected to a real payment provider.
- Live cinema schedules and seat availability are not established by the booking workflow described here.
- Concurrent seat reservations and seat-locking mechanisms require additional implementation.
- Automated testing and production deployment configuration can be expanded.
- Production-grade monitoring, logging, and security hardening remain additional deployment considerations.

## 15. Future Enhancements

Possible future improvements include:

- Integration with a secure payment gateway.
- Live cinema, showtime, and seat-availability services.
- Prevention of duplicate or conflicting seat reservations.
- Booking cancellation and refund workflows.
- Email or SMS booking notifications.
- Automated frontend and backend testing.
- Deployment to cloud hosting platforms.
- Improved accessibility, responsive design, and performance optimization.
- Administrative tools for managing movies, shows, and bookings.

## 16. Conclusion

IMovies demonstrates the development of a full-stack web application that integrates a React-based frontend, an Express backend, and MongoDB data persistence. It brings together essential concepts such as user authentication, REST API communication, request validation, and booking management within a single project.

The project provides a foundation for further development into a more comprehensive movie ticket booking platform and serves as a practical demonstration of modern full-stack web development skills.

## Author

**Janhvi Tomar**

**GitHub Repository:**  
https://github.com/janhvitomar8-alt/IMovies

---

*Academic and portfolio project — developed for learning and demonstrating full-stack web development concepts.*
