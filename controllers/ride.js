const express = require('express');
const Ride = require('../models/ride');
const isSignedIn = require('../middleware/is-signed-in.js');

const router = express.Router();

// Show all rides - accessible to all users/guests
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().populate('driverId', 'username');
    res.render('ride/list.ejs', { rides });
  } catch (error) {
    res.status(500).send('Error loading rides');
  }
});

// Show the form to create a new ride - only signed-in users (drivers)
router.get('/new', isSignedIn, (req, res) => {
  res.render('ride/form.ejs');
});

// Handle the creation of a new ride - only signed-in users
router.post('/', isSignedIn, async (req, res) => {
  try {
    const newRide = await Ride.create({
      driverId: req.session.user._id,
      origin: req.body.origin,
      destination: req.body.destination,
      departureDateTime: req.body.departureDateTime,
      seatsAvailable: req.body.seatsAvailable,
      pricePerSeat: req.body.pricePerSeat,
      notes: req.body.notes,
    });
    res.redirect('/rides');
  } catch (error) {
    res.status(400).send('Failed to create ride');
  }
});

// Show the rides created by the logged-in user (driver dashboard)
router.get('/my-rides', isSignedIn, async (req, res) => {
  try {
    const myRides = await Ride.find({ driverId: req.session.user._id });
    res.render('ride/my-rides.ejs', { rides: myRides });
  } catch (error) {
    res.status(500).send('Error loading your rides');
  }
});

module.exports = router;