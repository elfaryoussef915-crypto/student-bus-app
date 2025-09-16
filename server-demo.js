const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Demo data storage (in-memory)
let users = [];
let trips = [];
let bookings = [];
let payments = [];

// Initialize with demo admin users
const initAdmins = async () => {
  const admins = [
    {
      id: '1',
      email: 'elfaryoussef915@gmail.com',
      password: 'Youssef ali elfar 2112005',
      name: 'يوسف علي الفار',
      phone: '',
      role: 'admin',
      balance: 0,
      isVerified: true,
      createdAt: new Date()
    },
    {
      id: '2',
      email: 'admin2@studentbus.com',
      password: 'Mo marey 1691958',
      name: 'محمد مرعي',
      phone: '01025857571',
      role: 'admin',
      balance: 0,
      isVerified: true,
      createdAt: new Date()
    },
    {
      id: '3',
      email: 'admin3@studentbus.com',
      password: '2191981mossad',
      name: 'مسعد الطريني',
      phone: '01015825320',
      role: 'admin',
      balance: 0,
      isVerified: true,
      createdAt: new Date()
    }
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    admin.password = hashedPassword;
    users.push(admin);
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('يجب أن يكون الملف صورة فقط'), false);
    }
  }
});

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'لا يوجد توكن، الوصول مرفوض' });
    }

    const decoded = jwt.verify(token, 'demo-secret');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'المستخدم غير موجود' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'التوكن غير صالح' });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'الوصول مرفوض - يجب أن تكون مدير' });
    }
    next();
  });
};

// Helper functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, studentId } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'المستخدم موجود بالفعل' });
    }

    const existingStudent = users.find(u => u.studentId === studentId);
    if (existingStudent) {
      return res.status(400).json({ message: 'رقم الطالب موجود بالفعل' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: generateId(),
      name,
      email,
      password: hashedPassword,
      phone,
      studentId,
      university: 'جامعة فاروس',
      role: 'student',
      balance: 0,
      isVerified: false,
      profileImage: '',
      createdAt: new Date()
    };

    users.push(user);

    const token = jwt.sign({ id: user.id, role: user.role }, 'demo-secret', { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
        role: user.role,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('خطأ في الخادم');
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, 'demo-secret', { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
        role: user.role,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('خطأ في الخادم');
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

// Trip Routes
app.get('/api/trips', auth, (req, res) => {
  const activeTrips = trips.filter(trip => {
    const tripDate = new Date(trip.date);
    const now = new Date();
    return trip.status === 'active' && tripDate >= now;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json(activeTrips);
});

app.get('/api/trips/:id', auth, (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ message: 'الرحلة غير موجودة' });
  }
  res.json(trip);
});

app.post('/api/trips', adminAuth, (req, res) => {
  try {
    const { date, time, price, totalSeats } = req.body;

    const trip = {
      id: generateId(),
      date: new Date(date),
      time,
      from: 'رشيد',
      to: 'جامعة فاروس',
      price: parseFloat(price),
      totalSeats: totalSeats || 33,
      bookedSeats: 0,
      availableSeats: totalSeats || 33,
      status: 'active',
      createdBy: req.user.id,
      createdAt: new Date()
    };

    trips.push(trip);
    res.status(201).json(trip);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('خطأ في الخادم');
  }
});

// Booking Routes
app.get('/api/bookings', auth, (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.user.id)
    .map(booking => {
      const trip = trips.find(t => t.id === booking.tripId);
      return { ...booking, trip };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(userBookings);
});

app.post('/api/bookings', auth, (req, res) => {
  try {
    const { tripId, ticketCount } = req.body;

    const trip = trips.find(t => t.id === tripId);
    if (!trip) {
      return res.status(404).json({ message: 'الرحلة غير موجودة' });
    }

    if (trip.status !== 'active') {
      return res.status(400).json({ message: 'هذه الرحلة غير متاحة للحجز' });
    }

    if (trip.availableSeats < ticketCount) {
      return res.status(400).json({ message: 'عدد المقاعد المتاحة غير كافي' });
    }

    const user = users.find(u => u.id === req.user.id);
    const totalAmount = trip.price * ticketCount;

    if (user.balance < totalAmount) {
      return res.status(400).json({ message: 'رصيدك غير كافي. يرجى شحن حسابك أولاً' });
    }

    const booking = {
      id: generateId(),
      bookingId: 'SB' + Date.now() + Math.floor(Math.random() * 1000),
      userId: req.user.id,
      tripId,
      ticketCount: parseInt(ticketCount),
      totalAmount,
      status: 'confirmed',
      qrCode: '',
      createdAt: new Date()
    };

    bookings.push(booking);

    // Update user balance
    user.balance -= totalAmount;

    // Update trip seats
    trip.bookedSeats += ticketCount;
    trip.availableSeats -= ticketCount;

    const bookingWithTrip = { ...booking, trip };
    res.status(201).json(bookingWithTrip);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('خطأ في الخادم');
  }
});

// Payment Routes
app.post('/api/payments/recharge', auth, upload.single('screenshot'), (req, res) => {
  try {
    const { amount, transactionId, senderPhone } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'يجب إرفاق صورة للإيصال' });
    }

    const payment = {
      id: generateId(),
      userId: req.user.id,
      amount: parseFloat(amount),
      type: 'recharge',
      method: 'vodafone_cash',
      transactionId,
      senderPhone,
      screenshot: `/uploads/${req.file.filename}`,
      status: 'pending',
      adminNote: '',
      reviewedBy: null,
      reviewedAt: null,
      createdAt: new Date()
    };

    payments.push(payment);

    res.status(201).json({
      message: 'تم إرسال طلب الشحن بنجاح. سيتم مراجعته من قبل الإدارة.',
      payment
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('خطأ في الخادم');
  }
});

app.get('/api/payments/history', auth, (req, res) => {
  const userPayments = payments.filter(p => p.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(userPayments);
});

app.get('/api/payments/pending', adminAuth, (req, res) => {
  const pendingPayments = payments.filter(p => p.status === 'pending')
    .map(payment => {
      const user = users.find(u => u.id === payment.userId);
      return { ...payment, user };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(pendingPayments);
});

app.get('/api/payments/:id', adminAuth, (req, res) => {
  const payment = payments.find(p => p.id === req.params.id);
  if (!payment) {
    return res.status(404).json({ message: 'الدفعة غير موجودة' });
  }

  const user = users.find(u => u.id === payment.userId);
  const reviewedBy = payment.reviewedBy ? users.find(u => u.id === payment.reviewedBy) : null;

  res.json({ ...payment, user, reviewedBy });
});

app.put('/api/payments/:id', adminAuth, (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const payment = payments.find(p => p.id === req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'الدفعة غير موجودة' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'هذه الدفعة تمت مراجعتها بالفعل' });
    }

    payment.status = status;
    payment.adminNote = adminNote || '';
    payment.reviewedBy = req.user.id;
    payment.reviewedAt = new Date();

    if (status === 'approved') {
      const user = users.find(u => u.id === payment.userId);
      user.balance += payment.amount;
    }

    const user = users.find(u => u.id === payment.userId);
    const reviewedBy = users.find(u => u.id === payment.reviewedBy);

    res.json({ ...payment, user, reviewedBy });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('خطأ في الخادم');
  }
});

// Admin Routes
app.get('/api/admin/dashboard', adminAuth, (req, res) => {
  try {
    const totalUsers = users.filter(u => u.role === 'student').length;
    const totalTrips = trips.length;
    const totalBookings = bookings.length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;

    const totalRecharges = payments
      .filter(p => p.status === 'approved' && p.type === 'recharge')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalRevenue = bookings
      .filter(b => ['confirmed', 'used'].includes(b.status))
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const recentBookings = bookings
      .slice(-5)
      .map(booking => {
        const user = users.find(u => u.id === booking.userId);
        const trip = trips.find(t => t.id === booking.tripId);
        return { ...booking, user, trip };
      })
      .reverse();

    const recentPayments = payments
      .filter(p => p.status === 'pending')
      .slice(-5)
      .map(payment => {
        const user = users.find(u => u.id === payment.userId);
        return { ...payment, user };
      })
      .reverse();

    res.json({
      stats: {
        totalUsers,
        totalTrips,
        totalBookings,
        pendingPayments,
        totalRecharges,
        totalRevenue
      },
      recentBookings,
      recentPayments
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('خطأ في الخادم');
  }
});

app.get('/api/admin/trips', adminAuth, (req, res) => {
  const allTrips = trips.map(trip => {
    const createdBy = users.find(u => u.id === trip.createdBy);
    return { ...trip, createdBy };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(allTrips);
});

// Handle routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize and start server
const PORT = process.env.PORT || 3000;

initAdmins().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Demo application - no database required');
    console.log(`Main app: http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
  });
});

module.exports = app;