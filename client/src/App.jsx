
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";


const movies = [
  {
    id: 1,
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    rating: "8.5",
    year: "2024",
    duration: "2h 46m",
    tag: "CINEMA ICON",
    color: "#c88751",
    image:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    description:
      "A journey across a mysterious desert world where destiny, power and survival collide.",
  },
  {
    id: 2,
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: "8.7",
    year: "2014",
    duration: "2h 49m",
    tag: "FAN FAVOURITE",
    color: "#8c9fe8",
    image:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description:
      "Beyond the stars lies a journey that challenges everything humanity knows about time and love.",
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "Action",
    rating: "9.0",
    year: "2008",
    duration: "2h 32m",
    tag: "LEGENDARY",
    color: "#7f8b99",
    image:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description:
      "A city on the edge. A hero tested. A battle between chaos and justice.",
  },
  {
    id: 4,
    title: "La La Land",
    genre: "Romance",
    rating: "8.0",
    year: "2016",
    duration: "2h 08m",
    tag: "FEEL EVERYTHING",
    color: "#e9a6bd",
    image:
      "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    description:
      "Two dreamers find love, ambition and unexpected turns beneath the city lights.",
  },
  {
    id: 5,
    title: "Inception",
    genre: "Sci-Fi",
    rating: "8.8",
    year: "2010",
    duration: "2h 28m",
    tag: "MIND-BENDING",
    color: "#8c9fe8",
    image:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    description:
      "A skilled thief enters people's dreams to steal secrets—and faces an impossible mission to plant an idea.",
  },
  {
    id: 6,
    title: "Oppenheimer",
    genre: "Drama",
    rating: "8.3",
    year: "2023",
    duration: "3h 00m",
    tag: "THE STORY THAT CHANGED HISTORY",
    color: "#d58b65",
    image:
      "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    description:
      "The story of J. Robert Oppenheimer and the scientific race that led to the creation of the atomic bomb.",
  },
];

const genres = ["All", "Sci-Fi", "Action", "Romance", "Adventure", "Thriller"];

function MovieCard({ movie, onSelect, saved, onSave }) {
  return (
    <article className="movie-card">
      <button
        className={`save-button ${saved ? "is-saved" : ""}`}
        onClick={() => onSave(movie.id)}
        aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
        title={saved ? "Remove from watchlist" : "Add to watchlist"}
      >
        {saved ? "♥" : "♡"}
      </button>

      <button
        className="poster-button"
        onClick={() => onSelect(movie)}
        aria-label={`View ${movie.title}`}
      >
        <div className="poster">
          <img src={movie.image} alt="" loading="lazy" />
          <div
            className="poster-tint"
            style={{ "--movie-color": movie.color }}
          />
          <span className="poster-tag">{movie.tag}</span>
          <span className="poster-open">EXPLORE FILM ↗</span>
        </div>
      </button>

      <div className="movie-info">
        <div className="movie-heading">
          <h3>{movie.title}</h3>
          <span className="rating">★ {movie.rating}</span>
        </div>
        <p>
          {movie.year} <span>·</span> {movie.genre} <span>·</span>{" "}
          {movie.duration}
        </p>
        <button className="text-link" onClick={() => onSelect(movie)}>
          DISCOVER FILM <span>↗</span>
        </button>
      </div>
    </article>
  );
}


function MovieModal({ movie, onClose, onBook }) {
  
  if (!movie) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="movie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <img className="modal-image" src={movie.image} alt="" />

        <div className="modal-content">
          <span className="eyebrow">YOUR NEXT MOVIE NIGHT</span>
          <h2 id="modal-title">{movie.title}</h2>

          <p className="modal-meta">
            ★ {movie.rating} · {movie.year} · {movie.genre} · {movie.duration}
          </p>

          <p>{movie.description}</p>

          <button
            className="primary-button"
            onClick={() => onBook(movie)}
          >
            BOOK TICKETS <span>↗</span>
          </button>

          <p className="modal-note">
            Choose your cinema, showtime and seats.
          </p>
        </div>
      </section>
    </div>
  );
}

function BookingModal({ movie, onClose, onBookingConfirmed }) {
  const [cinema, setCinema] = useState("IMovies Luxe");
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("7:30 PM");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [bookingId, setBookingId] = useState("");
  const [savingBooking, setSavingBooking] = useState(false);
const [bookingError, setBookingError] = useState("");
  const downloadTicket = () => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [100, 160],
  });

  pdf.setFillColor(18, 16, 24);
  pdf.rect(0, 0, 100, 160, "F");

  pdf.setTextColor(230, 180, 80);
  pdf.setFontSize(18);
  pdf.text("IMovies", 10, 15);

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.text("MOVIE BOOKING TICKET", 10, 23);

  pdf.setDrawColor(230, 180, 80);
  pdf.line(10, 28, 90, 28);

  pdf.setFontSize(14);
  pdf.text(movie.title, 10, 39, { maxWidth: 80 });

  pdf.setFontSize(9);
  pdf.text(`Booking ID: ${bookingId}`, 10, 51);
  pdf.text(`Cinema: ${cinema}`, 10, 59);
  pdf.text(
    `Date: ${dates[day].day}, ${dates[day].date} ${dates[day].month}`,
    10,
    67
  );
  pdf.text(`Time: ${time}`, 10, 75);
  pdf.text(`Seats: ${selectedSeats.join(", ")}`, 10, 83);

  pdf.setDrawColor(100, 95, 110);
  pdf.line(10, 90, 90, 90);

  pdf.setFontSize(12);
  pdf.text(`TOTAL: Rs. ${total}`, 10, 100);

  // Add the QR code from the hidden QR element
  const qrSvg = document.querySelector(".ticket-qr svg");

  if (qrSvg) {
    const svgData = new XMLSerializer().serializeToString(qrSvg);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      const qrImage = canvas.toDataURL("image/png");
      pdf.addImage(qrImage, "PNG", 32, 105, 36, 36);

      pdf.setFontSize(7);
      pdf.text("SCAN FOR BOOKING DETAILS", 50, 147, {
        align: "center",
      });

      pdf.save(`IMovies-Ticket-${bookingId}.pdf`);
    };

    img.onerror = () => {
      pdf.save(`IMovies-Ticket-${bookingId}.pdf`);
    };

    img.src =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(svgData);
  } else {
    pdf.save(`IMovies-Ticket-${bookingId}.pdf`);
  }
};
  if (!movie) return null;

  const dates = Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return {
      day: date.toLocaleDateString("en-IN", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
    };
  });

  const occupiedSeats = ["A3", "B5", "C2", "C6", "D4", "E7"];
  const seatPrice = cinema === "IMovies Luxe" ? 250 : 180;
  const total = selectedSeats.length * seatPrice;

  function toggleSeat(seat) {
    if (occupiedSeats.includes(seat)) return;

    setSelectedSeats((current) =>
      current.includes(seat)
        ? current.filter((item) => item !== seat)
        : [...current, seat]
    );
  }

  return (
    <div className="booking-backdrop" onClick={onClose}>
      <section
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="booking-close"
          onClick={onClose}
          aria-label="Close booking"
        >
          ×
        </button>

        {!confirmed ? (
          <>
            <div className="booking-header">
              <span className="eyebrow">YOUR MOVIE NIGHT STARTS HERE</span>
              <h2 id="booking-title">Book your <span>seats.</span></h2>
              <p>{movie.title} · {movie.duration}</p>
            </div>

            <div className="booking-section">
              <label className="booking-label" htmlFor="cinema">
                01 — CHOOSE YOUR CINEMA
              </label>
              <select
                id="cinema"
                className="booking-select"
                value={cinema}
                onChange={(event) => {
                  setCinema(event.target.value);
                  setSelectedSeats([]);
                }}
              >
                <option>IMovies Luxe</option>
                <option>IMovies Central</option>
                <option>IMovies Downtown</option>
              </select>
            </div>

            <div className="booking-section">
              <span className="booking-label">02 — PICK YOUR DATE</span>
              <div className="date-options">
                {dates.map((item, index) => (
                  <button
                    key={`${item.date}-${item.month}`}
                    className={`date-option ${day === index ? "chosen" : ""}`}
                    onClick={() => setDay(index)}
                  >
                    <span>{item.day}</span>
                    <strong>{item.date}</strong>
                    <span>{item.month}</span>
                  </button>
                ))}


          
              </div>
            </div>

            <div className="booking-section">
              <span className="booking-label">03 — SELECT SHOWTIME</span>
              <div className="showtime-options">
                {["10:30 AM", "1:45 PM", "4:30 PM", "7:30 PM", "10:15 PM"].map(
                  (item) => (
                    <button
                      key={item}
                      className={`showtime-option ${time === item ? "chosen" : ""}`}
                      onClick={() => setTime(item)}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="booking-section">
              <div className="seat-heading">
                <span className="booking-label">04 — CHOOSE YOUR SEATS</span>
                <span className="seat-price">₹{seatPrice} / seat</span>
              </div>

              <div className="screen-curve">
                <span>SCREEN THIS WAY</span>
              </div>

              <div className="seat-grid">
                {["A", "B", "C", "D", "E"].map((row) => (
                  <div className="seat-row" key={row}>
                    <span className="row-label">{row}</span>
                    {Array.from({ length: 8 }, (_, index) => {
                      const seat = `${row}${index + 1}`;
                      const occupied = occupiedSeats.includes(seat);
                      const chosen = selectedSeats.includes(seat);

                      return (
                        <button
                          key={seat}
                          aria-label={`Seat ${seat}${occupied ? ", unavailable" : chosen ? ", selected" : ""}`}
                          title={seat}
                          disabled={occupied}
                          className={`seat ${occupied ? "occupied" : ""} ${chosen ? "selected" : ""}`}
                          onClick={() => toggleSeat(seat)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="seat-legend">
                <span><i className="legend-seat available" /> Available</span>
                <span><i className="legend-seat selected" /> Selected</span>
                <span><i className="legend-seat occupied" /> Occupied</span>
              </div>
            </div>

            <div className="booking-summary">
              <div>
                <span className="booking-label">YOUR SELECTION</span>
                <p>
                  {selectedSeats.length
                    ? selectedSeats.join(", ")
                    : "Choose your seats"}
                </p>
                <span className="summary-meta">
                  {dates[day].day}, {dates[day].date} {dates[day].month}
                  {" · "}{time}
                </span>
              </div>

              <div className="summary-total">
                <span>TOTAL</span>
                <strong>₹{total}</strong>
              </div>
            </div>

           
{!showPayment ? (
  <>
   
<button
  type="button"
  className="primary-button booking-confirm-button"
  onClick={() => {
    if (selectedSeats.length === 0) {
      setBookingError("Please select at least one seat.");
      return;
    }

    setBookingError("");
    setShowPayment(true);
  }}
>
  PROCEED TO PAYMENT <span>↗</span>
</button>


    <p className="booking-disclaimer">
      Demo checkout — no payment will be taken.
    </p>
  </>

) : (
  <div className="payment-panel">
    <span className="booking-label">05 — PAYMENT</span>

    <h3>
      Complete your <span>checkout.</span>
    </h3>

    <div className="payment-total">
      <span>AMOUNT TO PAY</span>
      <strong>₹{total}</strong>
    </div>

    <div className="payment-methods">
      {["UPI", "Card", "Net banking"].map((method) => (
        <button
          key={method}
          type="button"
          className={`payment-method ${
            paymentMethod === method ? "chosen" : ""
          }`}
          onClick={() => setPaymentMethod(method)}
        >
          {method}
          <span>{paymentMethod === method ? "✓" : ""}</span>
        </button>
      ))}
    </div>

    {bookingError && (
      <p className="booking-disclaimer" role="alert">
        {bookingError}
      </p>
    )}

    <button
      type="button"
      className="primary-button booking-confirm-button"
      disabled={savingBooking}
      onClick={async () => {
        console.log("SIMULATE PAYMENT button clicked");

        if (savingBooking) return;

        if (selectedSeats.length === 0) {
          setBookingError("Please select at least one seat.");
          return;
        }

        setSavingBooking(true);
        setBookingError("");

        try {
          const savedUser = JSON.parse(
            sessionStorage.getItem("imovies-user") || "null"
          );

          if (!savedUser?.token) {
            setBookingError("Please log in again before booking.");
            return;
          }

          const showDate = `${dates[day].day}, ${dates[day].date} ${dates[day].month}`;
console.log("Sending booking to backend...");
          const response = await fetch(
            "http://localhost:5000/api/bookings",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${savedUser.token}`,
              },
              body: JSON.stringify({
                movieId: String(movie.id),
                movieTitle: movie.title,
                showDate,
                showTime: time,
                seats: selectedSeats,
                totalAmount: total,
              }),
            }
          );

          const data = await response.json();
console.log("Booking API status:", response.status);
console.log("Booking API response:", data);
          if (!response.ok) {
            setBookingError(data.message || "Unable to save booking.");
            return;
          }

          const savedBookingId = data.booking.bookingReference;
          setBookingId(savedBookingId);

          onBookingConfirmed({
            bookingId: savedBookingId,
            movieId: movie.id,
            movieTitle: movie.title,
            cinema,
            date: showDate,
            time,
            seats: [...selectedSeats],
            total,
            paymentMethod,
            paymentStatus: "Demo payment simulated",
            bookedAt: new Date().toISOString(),
          });

          setConfirmed(true);
        } catch (error) {
          console.error("Booking error:", error);
          setBookingError(
            "Cannot connect to the server. Check that the backend is running."
          );
        } finally {
          setSavingBooking(false);
        }
      }}
    >
      {savingBooking
        ? "SAVING BOOKING..."
        : `SIMULATE PAYMENT · ₹${total}`}{" "}
      <span>↗</span>
    </button>

    <p className="booking-disclaimer">
      Demo only. No money will be charged.
    </p>
  </div>
)}

  
 


          </>
        ) : (
          <div className="booking-success">
            <div className="success-symbol">✓</div>
            <span className="eyebrow">YOUR NIGHT IS SET</span>
            <h2>It's a <span>movie date.</span></h2>
            <p className="success-movie">{movie.title}</p>

            <div className="confirmation-ticket">
              <span className="booking-label">IMOVIES · DEMO TICKET</span>
              <h3>{cinema}</h3>
              <p>
                {dates[day].day}, {dates[day].date} {dates[day].month}
                {" · "}{time}
              </p>
              <div className="ticket-divider" />
              <span className="booking-label">YOUR SEATS</span>
              <strong>{selectedSeats.join(", ")}</strong>
              <div className="ticket-divider" />
              <div className="confirmation-total">
                <span>TOTAL</span>
                <strong>₹{total}</strong>
              </div>
              <p className="demo-code">BOOKING ID: {bookingId}</p>
              <div
  className="ticket-qr"
  aria-hidden="true"
  style={{
    position: "fixed",
    left: "-10000px",
    top: 0,
  }}
>
  <QRCodeSVG
    value={JSON.stringify({
      bookingId,
      movie: movie.title,
      cinema,
      date: `${dates[day].day}, ${dates[day].date} ${dates[day].month}`,
      time,
      seats: selectedSeats,
      total,
    })}
    size={200}
    level="M"
    includeMargin
  />
</div>


<button
  type="button"
  className="primary-button"
  onClick={downloadTicket}
>
  ↓ DOWNLOAD TICKET
</button>
            </div>

            <button
  className="primary-button"
  onClick={() => {
    setConfirmed(false);
    setShowPayment(false);
    setSelectedSeats([]);
    setBookingError("");
    setBookingId("");
    onClose();
  }}
>
  BACK TO MOVIES <span>↗</span>
</button>
            <p className="booking-disclaimer">
              This is a sample confirmation, not a real ticket.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}


function AuthModal({ mode, setMode, onClose, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  

async function handleSubmit(event) {
  event.preventDefault();
  setError("");

  const cleanEmail = email.trim().toLowerCase();

  if (mode === "signup" && !name.trim()) {
    setError("Please enter your name.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  try {
    const endpoint =
      mode === "signup"
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

    const payload =
      mode === "signup"
        ? {
            name: name.trim(),
            email: cleanEmail,
            password,
          }
        : {
            email: cleanEmail,
            password,
          };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Authentication failed. Please try again.");
      return;
    }

    if (mode === "signup") {
      setError("");
      setMode("login");
      setPassword("");
      setName("");
      setEmail(cleanEmail);
      return;
    }

    const user = data.user;

    if (!user) {
      setError("Login succeeded, but the server returned no user details.");
      return;
    }

    onLogin({
      id: user.id,
      name: user.name,
      email: user.email,
      token: data.token,
    });
  } catch (error) {
    console.error("Authentication error:", error);
    setError(
      "Cannot connect to the server. Make sure your backend is running."
    );
  }
}



  return (
    <div className="auth-backdrop" onClick={onClose}>
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close login"
          type="button"
        >
          ×
        </button>

        <span className="eyebrow">WELCOME TO IMOVIES</span>
        <h2 id="auth-title">
          {mode === "login" ? (
            <>Your next <span>movie night.</span></>
          ) : (
            <>Join the <span>experience.</span></>
          )}
        </h2>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Log in to continue your cinema journey."
            : "Create your account and make it a movie night."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <label>
              YOUR NAME
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            EMAIL ADDRESS
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            PASSWORD
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={6}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-button auth-submit" type="submit">
            {mode === "login" ? "LOG IN" : "CREATE ACCOUNT"} <span>↗</span>
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "New to IMovies?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setError("");
              setMode(mode === "login" ? "signup" : "login");
            }}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>

        <p className="auth-demo-note">
  Your account is securely verified by the IMovies server.
</p>
      </section>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
 const [savedMovies, setSavedMovies] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [bookingMovie, setBookingMovie] = useState(null);
  
  const [bookings, setBookings] = useState([]);
const [loadedUserKey, setLoadedUserKey] = useState(null);

  const [showSaved, setShowSaved] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
const [authMode, setAuthMode] = useState("login");
const [currentUser, setCurrentUser] = useState(() => {
  try {
    return JSON.parse(sessionStorage.getItem("imovies-user")) || null;
  } catch {
    return null;
  }
});
  
useEffect(() => {
  if (!currentUser?.email) {
    setSavedMovies([]);
    setBookings([]);
    setLoadedUserKey(null);
    return;
  }

  const userKey = currentUser.email.trim().toLowerCase();
  setLoadedUserKey(null);

  try {
    const saved = JSON.parse(
      localStorage.getItem(`imovies-watchlist:${userKey}`) || "[]"
    );

    const booked = JSON.parse(
      localStorage.getItem(`imovies-bookings:${userKey}`) || "[]"
    );

    setSavedMovies(Array.isArray(saved) ? saved : []);
    setBookings(Array.isArray(booked) ? booked : []);
  } catch (error) {
    console.error("Could not load account data:", error);
    setSavedMovies([]);
    setBookings([]);
  }

  setLoadedUserKey(userKey);
}, [currentUser]);

useEffect(() => {
  const userKey = currentUser?.email?.trim().toLowerCase();

  if (!userKey || loadedUserKey !== userKey) return;

  localStorage.setItem(
    `imovies-watchlist:${userKey}`,
    JSON.stringify(savedMovies)
  );
}, [savedMovies, currentUser, loadedUserKey]);

useEffect(() => {
  const userKey = currentUser?.email?.trim().toLowerCase();

  if (!userKey || loadedUserKey !== userKey) return;

  localStorage.setItem(
    `imovies-bookings:${userKey}`,
    JSON.stringify(bookings)
  );
}, [bookings, currentUser, loadedUserKey]);


  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        movie.genre.toLowerCase().includes(search.toLowerCase());

      const matchesGenre = genre === "All" || movie.genre === genre;
      const matchesSaved = !showSaved || savedMovies.includes(movie.id);

      return matchesSearch && matchesGenre && matchesSaved;
    });
  }, [search, genre, showSaved, savedMovies]);

  function toggleSaved(id) {
    setSavedMovies((current) =>
      current.includes(id)
        ? current.filter((movieId) => movieId !== id)
        : [...current, id]
    );
  }

  function showMovies() {
    setShowSaved(false);
    document
      .getElementById("movies")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <nav className="navbar">
        <a className="brand" href="#home" aria-label="IMovies home">
          i<span>MOVIES</span><b>®</b>
        </a>

        <div className="nav-links">
          <a className="nav-active" href="#home">Discover</a>
          <a href="#movies">Movies</a>
          <a href="#experience">Our experience</a>
        </div>


{currentUser && (
  <>
    <button
      className={`watchlist-button ${showSaved ? "watchlist-active" : ""}`}
      onClick={() => {
        setShowSaved((current) => !current);
        document
          .getElementById("movies")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <span>♡</span> Watchlist
      <span className="watch-count">{savedMovies.length}</span>
    </button>

    <button
      className="watchlist-button"
      onClick={() => {
        setShowSaved(false);
        setShowBookings(true);
      }}
    >
      <span>▤</span> My Bookings
      <span className="watch-count">{bookings.length}</span>
    </button>
  </>
)}


{currentUser ? (
  <button
    className="watchlist-button"
    onClick={() => {
      sessionStorage.removeItem("imovies-user");
      setCurrentUser(null);
      setSavedMovies([]);
      setBookings([]);
      setLoadedUserKey(null);
      setShowSaved(false);
      setShowBookings(false);
      setBookingMovie(null);
      setActiveMovie(null);
    }}
  >
    <span>↪</span> Log Out
  </button>
) : (

  <button
    className="watchlist-button"
    onClick={() => {
      setAuthMode("login");
      setShowAuth(true);
    }}
  >
    <span>♙</span> Login / Sign Up
  </button>
)}


      </nav>

      <section className="hero" id="home">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2000&q=90"
          alt=""
        />
        <div className="hero-shade" />

        <div className="hero-content">
          <div className="hero-kicker">
            <span className="live-dot" /> THE ART OF THE BIG SCREEN
          </div>
          <h1>
            DON'T JUST
            <br />
            WATCH IT.
            <br />
            <span>FEEL IT.</span>
          </h1>
          <p className="hero-description">
            The stories you love. The seats you want.
            <br />
            Your next unforgettable night starts here.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={showMovies}>
              EXPLORE MOVIES <span>↗</span>
            </button>
            <a className="secondary-button" href="#experience">
              THE IMOVIES EXPERIENCE <span>↓</span>
            </a>
          </div>
          <div className="hero-footnote">
            <span>YOUR SEAT.</span> YOUR STORY. YOUR MOVIE NIGHT.
          </div>
        </div>

        <div className="hero-index">
          <span>01</span>
          <div />
          06
        </div>
        <div className="vertical-label">MADE FOR MOVIE PEOPLE</div>
      </section>

      <section className="catalogue section-wrap" id="movies">
        <div className="section-topline">
          <span className="eyebrow">
            <span className="live-dot" /> THE COLLECTION
          </span>
          <span className="catalogue-count">
            {String(filteredMovies.length).padStart(2, "0")} FILMS TO EXPLORE
          </span>
        </div>

        <div className="section-heading">
          <div>
            <h2>
              FIND YOUR
              <br />
              <span>MAIN CHARACTER</span> MOMENT.
            </h2>
            <p>Handpicked stories for every kind of movie person.</p>
          </div>

          <label className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find your next obsession..."
              aria-label="Search movies"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                ×
              </button>
            )}
          </label>
        </div>

        <div className="filter-row">
          <div className="genre-filters">
            {genres.map((item) => (
              <button
                key={item}
                className={`genre-chip ${genre === item ? "selected" : ""}`}
                onClick={() => setGenre(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {showSaved && (
            <button className="clear-filter" onClick={() => setShowSaved(false)}>
              SHOW ALL FILMS ×
            </button>
          )}
        </div>

        {filteredMovies.length > 0 ? (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={setActiveMovie}
                saved={savedMovies.includes(movie.id)}
                onSave={toggleSaved}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>✳</span>
            <h3>NO SCENES FOUND.</h3>
            <p>Try another title or explore a different genre.</p>
            <button
              className="primary-button"
              onClick={() => {
                setSearch("");
                setGenre("All");
                setShowSaved(false);
              }}
            >
              RESET DISCOVERY ↗
            </button>
          </div>
        )}
      </section>

      <section className="experience-section" id="experience">
        <div className="experience-orb orb-one" />
        <div className="experience-orb orb-two" />
        <div className="experience-copy">
          <span className="eyebrow">NOT JUST ANOTHER TICKET</span>
          <h2>
            YOUR NIGHT.
            <br />
            <span>DIRECTED BY YOU.</span>
          </h2>
          <p>
            From the first trailer to the final credits, your movie night
            deserves a little main-character energy.
          </p>
          <div className="experience-points">
            <span>✳ Discover stories</span>
            <span>✳ Choose your seats</span>
            <span>✳ Make it a night</span>
          </div>
        </div>
        <div className="experience-art" id="booking-preview">
          <div className="ticket ticket-back">
            <span>ADMIT ONE</span>
          </div>
          <div className="ticket ticket-front">
            <span className="ticket-logo">iMOVIES®</span>
            <div className="ticket-star">✳</div>
            <span className="ticket-label">YOUR NEXT GREAT NIGHT</span>
            <strong>THE MAGIC<br />STARTS HERE.</strong>
            <div className="ticket-bottom">
              <span>YOUR SEAT AWAITS</span>
              <span>IM — 001</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#home">i<span>MOVIES</span><b>®</b></a>
        <p>MADE FOR THE LOVE OF CINEMA.</p>
        <a href="#home">BACK TO THE TOP ↑</a>
        <span className="footer-note">
          Student project · Interactive frontend demo
        </span>
      </footer>

      
{showBookings && (
  <div
    className="modal-backdrop"
    onClick={() => setShowBookings(false)}
  >
    <section
      className="movie-modal my-bookings-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-bookings-title"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={() => setShowBookings(false)}
        aria-label="Close bookings"
      >
        ×
      </button>

      <div className="modal-content">
        <span className="eyebrow">YOUR MOVIE NIGHTS</span>
        <h2 id="my-bookings-title">
          My <span>Bookings.</span>
        </h2>

        <p>
          Your saved tickets and booking details.
        </p>

        {bookings.length === 0 ? (
          <div className="empty-bookings">
            <p>You don't have any bookings yet.</p>
            <button
              className="primary-button"
              onClick={() => {
                setShowBookings(false);
                showMovies();
              }}
            >
              EXPLORE MOVIES <span>↗</span>
            </button>
          </div>
        ) : (
          <div className="my-bookings-list">
            {bookings.map((booking) => (
              <article
                className="my-booking-card"
                key={booking.bookingId}
              >
                <div className="my-booking-top">
                  <div>
                    <span className="booking-label">
                      BOOKING ID
                    </span>
                    <p className="my-booking-id">
                      {booking.bookingId}
                    </p>
                  </div>

                  <span className="my-booking-status">
                    BOOKED
                  </span>
                </div>

                <h3>{booking.movieTitle}</h3>

                <p>{booking.cinema}</p>
                <p>
                  {booking.date} · {booking.time}
                </p>
                <p>
                  Seats: {booking.seats.join(", ")}
                </p>

                <div className="my-booking-bottom">
                  <strong>₹{booking.total}</strong>

                  <button
                    type="button"
                    className="cancel-booking-button"
                    onClick={() => {
                      const shouldCancel = window.confirm(
                        `Cancel your booking for ${booking.movieTitle}?`
                      );

                      if (shouldCancel) {
                        setBookings((current) =>
                          current.filter(
                            (item) =>
                              item.bookingId !== booking.bookingId
                          )
                        );
                      }
                    }}
                  >
                    CANCEL BOOKING
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  </div>
)}

{showAuth && (
  <AuthModal
    mode={authMode}
    setMode={setAuthMode}
    onClose={() => setShowAuth(false)}
   
onLogin={(user) => {
  sessionStorage.setItem("imovies-user", JSON.stringify(user));
  setCurrentUser(user);
  setShowSaved(false);
  setShowBookings(false);
  setBookingMovie(null);
  setActiveMovie(null);
  setShowAuth(false);
}}

  />
)}

<MovieModal
  movie={activeMovie}
  onClose={() => setActiveMovie(null)}
 
  
  onBook={(movie) => {
  setActiveMovie(null);

  if (!currentUser) {
    setAuthMode("login");
    setShowAuth(true);
    return;
  }

  setBookingMovie(movie);
}}

/>

<BookingModal
  key={bookingMovie?.id ?? "no-booking"}
  movie={bookingMovie}
  onClose={() => setBookingMovie(null)}
  onBookingConfirmed={(newBooking) => {
    setBookings((current) => [newBooking, ...current]);
  }}
/>
    </main>
  );
}
