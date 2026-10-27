
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking.js";

const router = express.Router();

// Verify the login token and identify the user
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Please log in first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({
      message: "Your session has expired. Please log in again.",
    });
  }
}

// Create a booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      movieId,
      movieTitle,
      showDate,
      showTime,
      seats,
      totalAmount,
    } = req.body;

    if (
      !movieId ||
      !movieTitle ||
      !showDate ||
      !showTime ||
      !Array.isArray(seats) ||
      seats.length === 0 ||
      seats.some((seat) => typeof seat !== "string" || !seat.trim()) ||
      !Number.isFinite(totalAmount) ||
      totalAmount < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid movie, show, seat, and amount details.",
      });
    }

    const booking = await Booking.create({
      user: new mongoose.Types.ObjectId(req.userId),
      movieId,
      movieTitle,
      showDate,
      showTime,
      seats,
      totalAmount,
      bookingReference: `IM-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
    });

    return res.status(201).json({
      message: "Booking saved successfully.",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error.message);
    return res.status(500).json({
      message: "Unable to save booking.",
    });
  }
});

// Get the logged-in user's bookings
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch bookings.",
    });
  }
});

export default router;
