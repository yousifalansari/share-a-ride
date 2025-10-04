const dotenv = require('dotenv');
dotenv.config();
require('./config/database.js');
const express = require('express');

const app = express();

const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// Controllers
const authController = require('./controllers/auth.js');
const rideController = require('./controllers/ride.js'); 
const bookingController = require('./controllers/booking.js');
const reviewController = require('./controllers/review.js');

app.use(express.static('public'));

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// MIDDLEWARE

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.use(passUserToView);

// PUBLIC ROUTES

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.use('/auth', authController);
app.use('/bookings', bookingController);
app.use('/reviews', reviewController);

// PROTECTED ROUTES

// Mount rides controller for all /rides routes
app.use('/rides', rideController); // 

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
