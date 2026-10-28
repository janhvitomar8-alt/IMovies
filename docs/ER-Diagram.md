
# IMovies — Entity Relationship Diagram (ERD)

## 1. ER Diagram

![IMovies Entity Relationship Diagram](IMovies-ER-Diagram.png)


## 2. Entities and Attributes

### USER

Stores information about registered users.

| Attribute | Description |
|---|---|
| _id | Unique user identifier (primary key) |
| name | User's name |
| email | User's email address |
| password | Hashed password |

### BOOKING

Stores movie ticket booking information.

| Attribute | Description |
|---|---|
| _id | Unique booking identifier (primary key) |
| user | Reference to the user who made the booking |
| movieId | Identifier of the selected movie |
| movieTitle | Title of the selected movie |
| showDate | Date of the show |
| showTime | Time of the show |
| seats | Selected seats |
| totalAmount | Total booking amount |
| bookingReference | Unique booking reference |
| createdAt | Booking creation timestamp, if enabled |
| updatedAt | Last update timestamp, if enabled |

## 3. Relationship

- One user can make multiple bookings.
- Each booking belongs to one user.
- Relationship: USER (1) to BOOKING (N).

## 4. Design Notes

- The booking attributes are based on the IMovies booking API.
- Movie information is stored in the booking record in this diagram.
- The user attributes and timestamps should be verified against the actual Mongoose model files.
- The user reference represents a relationship in MongoDB; it is not necessarily a SQL foreign-key constraint.

## 5. Technology

- Frontend: React and Vite
- Backend: Node.js and Express.js
- Database: MongoDB
- ODM: Mongoose
