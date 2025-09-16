const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const bookingRoutes = require('./routes/bookings');
const tripRoutes = require('./routes/trips');
const paymentRoutes = require('./routes/payments');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/payments', paymentRoutes);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle routing, return all non-API requests to React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://demo:demo123@cluster0.mongodb.net/student_bus?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Create default admin users
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    const createDefaultAdmins = async () => {
      try {
        const admins = [
          {
            email: 'elfaryoussef915@gmail.com',
            password: 'Youssef ali elfar 2112005',
            name: 'يوسف علي الفار',
            phone: '',
            role: 'admin'
          },
          {
            email: 'admin2@studentbus.com',
            password: 'Mo marey 1691958',
            name: 'محمد مرعي',
            phone: '01025857571',
            role: 'admin'
          },
          {
            email: 'admin3@studentbus.com',
            password: '2191981mossad',
            name: 'مسعد الطريني',
            phone: '01015825320',
            role: 'admin'
          }
        ];

        for (const admin of admins) {
          const existingUser = await User.findOne({ email: admin.email });
          if (!existingUser) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            await User.create({
              ...admin,
              password: hashedPassword,
              balance: 0,
              isVerified: true
            });
            console.log(`Admin created: ${admin.name}`);
          }
        }
      } catch (error) {
        console.error('Error creating default admins:', error);
      }
    };

    createDefaultAdmins();
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };