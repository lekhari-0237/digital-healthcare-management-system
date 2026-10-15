const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Enable CORS & Body Parser
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if uploaded
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/test-bookings', require('./routes/bookingRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/patient/notifications', require('./routes/patientNotificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HealthTrack REST API is running smoothly.' });
});

// Root fallback
app.get('/', (req, res) => {
  res.send('HealthTrack API Server');
});

// Custom Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HealthTrack Backend Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
