const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Car = require("../models/Car");

// 🔹 Create a new booking
router.post("/", async (req, res) => {
  try {
    const { userId, carId, fromDate, toDate } = req.body;

    // Validate required fields
    if (!userId || !carId || !fromDate || !toDate) {
      return res.status(400).json({ error: "All fields are required (userId, carId, fromDate, toDate)" });
    }

    // Parse and validate dates
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      return res.status(400).json({ error: "Invalid date range (fromDate must be before toDate)" });
    }

    // Check car existence and availability
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    if (!car.availability) {
      return res.status(400).json({ error: "Car is not available" });
    }

    // Calculate total cost
    const totalCost = days * car.pricePerDay;
    if (isNaN(totalCost)) {
      return res.status(400).json({ error: "Failed to calculate total cost" });
    }

    // Save booking
    const booking = new Booking({
      userId,
      carId,
      fromDate: from.toISOString(),
      toDate: to.toISOString(),
      totalCost,
    });

    await booking.save();

    // Respond success
    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔹 Get all bookings for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate("carId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
