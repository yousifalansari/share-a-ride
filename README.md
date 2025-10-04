# Share-A-Ride  
Community Carpooling Made Easy

![Share-A-Ride Logo](README-ASSETS/logo.png) (Chatgpt, 2025)

## Deployed Link
- Coming Soon!

## Overview  
Share-A-Ride is a Node.js web application built with Express and MongoDB. It enables local community members to share rides by allowing drivers to create ride offers and passengers to book seats on those rides. The platform features secure session-based authentication, full CRUD functionality on rides, bookings, and reviews, and ensures authorization so only authenticated users can modify data. Its design encourages eco-friendly transportation and fosters trust through ride ratings and reviews.

## User Stories  
- As a user, I want to create an account by signing up with a username, email, and p- assword so that I can securely access the app.
- As a user, I want to log in and maintain a session so that my data and actions remain secure during my app use.
- As a user, I want to update my profile information like name and contact details to personalize my account.
- As a guest user, I want to browse available rides without logging in to explore options before registering.
- As a user, I want to search rides by origin, destination, and date to find rides matching my travel needs.
- As a user, I want to create a ride with origin, destination, date/time, and available seats so I can offer transportation.
- As a user, I want to edit or cancel rides I have created in c- ase of changes or cancellations.
- As a user, I want to see a list of my created rides and their booking status to stay organized.
- As a user, I want to book seats on rides offered by others after logging in to secure a spot.
- As a user, I want to cancel bookings if my plans change, allowing flexibility.
- As a user, I want to view a list of my booked rides to manage my upcoming trips.
- As a user, I want to leave simple text reviews for rides I have completed to share feedback with the community.
- As a user, I want to see ratings and reviews on rides and drivers to make informed decisions.
- As a user, I want clear error messages if I try actions I’m not authorized to perform, like booking while logged out.
- As a user, I want to log out securely to protect my account on shared devices.

## Entity Relationship Diagram (ERD)
**createdAt and updatedAt implemented as (timestamps)

### User  
| Field    | Type     | Options                         |  
|----------|----------|--------------------------------|  
| \_id     | ObjectId | MongoDB auto-generated primary |  
| username | String   | Required, unique, trimmed       |  
| password | String   | Required                       |

---

### Ride  
| Field             | Type       | Options                                |  
|-------------------|------------|--------------------------------------|  
| \_id              | ObjectId   | MongoDB primary key                   |  
| driverId          | ObjectId   | Reference to User, required            |  
| origin            | String     | Required, trimmed                     |  
| destination       | String     | Required, trimmed                     |  
| departureDateTime | Date       | Required                            |  
| seatsAvailable    | Number     | Required, min 0                      |  
| pricePerSeat      | Number     | Default 0, min 0                    |  
| notes             | String     | Optional                            |  
| isDone            | Boolean    | Default false                      |  
| createdAt         | Date       | Auto-generated                     |  
| updatedAt         | Date       | Auto-generated                     |

---

### Booking  
| Field         | Type       | Options                               |  
|---------------|------------|-------------------------------------|  
| \_id          | ObjectId   | MongoDB primary key                  |  
| rideId        | ObjectId   | Reference to Ride, required          |  
| passengerId   | ObjectId   | Reference to User, required          |  
| seatsBooked   | Number     | Required, min 1                      |  
| pickupLocation| String     | Required                            |  
| bookingDate   | Date       | Default to current date             |  
| status        | String     | Enum: ['active', 'canceled'], default 'active' |  
| createdAt     | Date       | Auto-generated                     |  
| updatedAt     | Date       | Auto-generated                     |

---

### Review  
| Field     | Type       | Options                             |  
|-----------|------------|-----------------------------------|  
| \_id      | ObjectId   | MongoDB primary key                |  
| rideId    | ObjectId   | Reference to Ride, required        |  
| authorId  | ObjectId   | Reference to User, required        |  
| rating    | Number     | Required, min 1, max 5             |  
| comment   | String     | Optional                        |  
| createdAt | Date       | Auto-generated                   |  
| updatedAt | Date       | Auto-generated                   |

---

## Relationships Table

| Relationship Type  | From Entity | To Entity | Description                                                                              |  
|--------------------|-------------|-----------|------------------------------------------------------------------------------------------|  
| One-to-Many        | User        | Ride      | A user (driver) can create many rides, each ride h- as exactly one driver                  |  
| One-to-Many        | User        | Booking   | A user (p- assenger) can have many bookings, each booking belongs to one p- assenger          |  
| One-to-Many        | User        | Review    | A user can write many reviews, each review h- as one author                                |  
| One-to-Many        | Ride        | Booking   | A ride can have many bookings, each booking belongs to one ride                         |  
| One-to-Many        | Ride        | Review    | A ride can have many reviews, each review belongs to one ride                           |

---

## How to Use

1. **Sign Up**  
   - Navigate to the Sign Up page and create a new account by entering a unique username and password.  
   - Password confirmation ensures accuracy.  

2. **Sign In**  
   - Use your registered credentials to log in.  
   - Once logged in, your session remains active to allow access to protected features.

3. **Browse Rides**  
   - Guests and logged-in users can browse the list of available rides with details such as origin, destination, date/time, driver, and available seats.

4. **Create a Ride (Driver only)**  
   - After signing in, drivers can create rides by providing origin, destination, departure date/time, number of seats available, price per seat, and optional notes.

5. **Manage Your Rides**  
   - Drivers can view their own rides, edit ride details, mark rides as done, or delete rides.

6. **Book a Ride (Passenger)**  
   - Logged-in passengers can book available seats on rides.  
   - Enter the number of seats to book and your pickup location.  
   - Bookings can be viewed, edited, or canceled.

7. **Submit Reviews**  
   - After completing rides, users can leave star ratings and textual reviews for that ride and driver.

8. **View Reviews**  
   - View reviews for rides and drivers to make informed decisions before booking.

9. **Logout**  
   - Securely log out from your session when finished.

---

### Notes  
- Authorization restricts guests from creating, editing, or deleting rides and bookings.  
- Users can only modify rides or bookings they own.  
- Forms are pre-filled on edit for convenience.  
- Clear error messages guide you when input is invalid or unauthorized actions are attempted.

## Pseudocode  
``` text
// On landing page:
// Display welcome message with options to sign in or browse rides.

// On sign up:
// Validate user inputs.
// Hash password and create new User.
// Start session with user info.
// Redirect to homepage or dashboard.

// On sign in:
// Find user by username.
// Validate password hash.
// Start session with user info.
// Redirect to homepage or dashboard.

// On logout:
// Destroy user session.
// Redirect to homepage.

// On creating a ride:
// Validate ride details.
// Create ride linked to driver.
// Redirect to rides listing.

// On browsing rides:
// Fetch rides with associated driver info.
// Display all rides with seats and status.

// On booking:
// Check user signed in.
// Validate seat availability and ride time.
// Create booking and decrement available seats atomically.
// Redirect to bookings list.

// On cancelling booking:
// Restore seats count atomically.
// Delete booking record.
// Redirect to bookings list.

// On editing/cancelling ride:
// Check ownership.
// Update or delete ride as authorized.
// Redirect accordingly.

// On reviews:
// Fetch user's reviews and rides to review.
// Allow review submission for rides completed.
// Display ratings and comments.

// UI:
// Show relevant navigation options depending on signed-in state.
// Only owners see edit/delete controls.
// Forms prefill when editing.
// Secure session-based routes.
```
## Wireframe
![Website wireframe](README-ASSETS/Wireframe.png) 

## RESTful Routing Table
# RESTful Routing Table

| HTTP Method | Path/Endpoint               | CRUD Operation | Route Name         | Description                                                    |
|-------------|-----------------------------|----------------|--------------------|----------------------------------------------------------------|
| GET         | /auth/sign-up               | Read (Form)    | signUpForm         | Show sign-up form to create a new user                         |
| POST        | /auth/sign-up               | Create         | createUser         | Handle user registration and start session                     |
| GET         | /auth/sign-in               | Read (Form)    | signInForm         | Show sign-in form                                              |
| POST        | /auth/sign-in               | Read (Authenticate) | loginUser          | Authenticate user and start session                            |
| GET         | /auth/sign-out              | Delete (Session) | logoutUser         | Log user out and destroy session                               |
| GET         | /rides                      | Read           | listRides          | List all available rides                                       |
| GET         | /rides/new                  | Create (Form)  | newRideForm        | Show form to create a new ride (drivers only)                 |
| POST        | /rides                      | Create         | createRide         | Handle new ride creation                                       |
| GET         | /rides/my-rides             | Read           | myRides            | List rides created by signed-in driver                        |
| GET         | /rides/:rideId              | Read           | showRide           | Show details of a specific ride                               |
| GET         | /rides/:rideId/edit         | Update (Form)  | editRideForm       | Show edit form for ride (driver only)                         |
| PUT         | /rides/:rideId              | Update         | updateRide         | Update ride details (driver only)                             |
| DELETE      | /rides/:rideId              | Delete         | deleteRide         | Delete a ride (driver only)                                   |
| PUT         | /rides/:rideId/mark-done    | Update         | markRideDone       | Mark ride as completed (driver only)                          |
| GET         | /bookings                  | Read           | listBookings       | List bookings of signed-in user                               |
| GET         | /bookings/new/:rideId       | Create (Form)  | newBookingForm     | Show booking form for a specific ride                        |
| POST        | /bookings                  | Create         | createBooking      | Create a new booking for a ride                              |
| GET         | /bookings/:bookingId        | Read           | showBooking        | Show details of a booking                                    |
| GET         | /bookings/:bookingId/edit   | Update (Form)  | editBookingForm    | Show form to edit an existing booking                       |
| PUT         | /bookings/:bookingId        | Update         | updateBooking      | Update booking details                                       |
| DELETE      | /bookings/:bookingId        | Delete         | deleteBooking      | Cancel a booking                                            |
| GET         | /reviews                    | Read           | listReviews        | List user's reviews and rides to review                     |
| GET         | /reviews/ride/:rideId       | Read           | rideReviews        | Show reviews of a specific ride                             |
| GET         | /reviews/new/:rideId        | Create (Form)  | newReviewForm      | Show form to add a new review for a ride                   |
| POST        | /reviews                    | Create         | createReview       | Create a new review                                        |
| GET         | /reviews/:reviewId          | Read           | showReview         | Show specific review details                               |
| GET         | /reviews/:reviewId/edit     | Update (Form)  | editReviewForm     | Show form to edit a review                                 |
| PUT         | /reviews/:reviewId          | Update         | updateReview       | Update a review                                           |
| DELETE      | /reviews/:reviewId          | Delete         | deleteReview       | Delete a review                                         |
| GET         | /                           | Read           | home               | Show landing page                                        |



## Technologies Used

- **Node.js** - JavaScript runtime for server-side code execution.
- **Express.js** - Minimalist web framework for routing, middleware, and HTTP handling.
- **MongoDB** - NoSQL document database for data persistence.
- **Mongoose** - Object Data Modeling (ODM) library for MongoDB in Node.js.
- **EJS (Embedded JavaScript)** - Templating engine to render dynamic HTML views.
- **bcrypt** - Library to hash and verify user passwords securely.
- **express-session** - Middleware managing user sessions for authentication.
- **connect-mongo** - MongoDB session store for `express-session`.
- **method-override** - Middleware enabling HTTP verbs such as PUT and DELETE from forms.
- **morgan** - HTTP request logger middleware.
- **CSS Flexbox** - CSS module used for responsive page layout design.

---

## Attributions

- GA Course lectures and Canvas documents
- GeeksforGeeks
- W3Schools

---

## Stretch Goals / Plans for Future Enhancements

- Implement **real-time notifications** for ride updates or booking confirmations using WebSockets.
- Add **advanced search filters** for rides by date ranges, price, or driver ratings.
- Integrate **user profiles and avatars** to personalize the experience.
- Implement **pagination and sorting** of rides, bookings, and reviews lists.
- Add **email notifications** for ride status changes and booking reminders.
- Implement **role-based access control** for admins to moderate reviews and users.
- Enhance the UI with **dynamic components and animations** using frontend libraries/frameworks.
- Add **social media login integrations** (Google, Facebook, etc.) for easier authentication.
- Develop a **mobile-responsive design** for improved usability on smaller devices.
- Include **rate limiting and security enhancements** to protect against abuse and attacks.
- Include **timing/scheduling of deletion** functionality.
