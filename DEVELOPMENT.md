# دليل التطوير - Student Bus

## هيكل المشروع

```
student_bus_ticket_booking/
├── models/           # نماذج قاعدة البيانات
│   ├── User.js       # نموذج المستخدم
│   ├── Trip.js       # نموذج الرحلة
│   ├── Booking.js    # نموذج الحجز
│   └── Payment.js    # نموذج الدفع
├── routes/           # مسارات API
│   ├── auth.js       # مصادقة المستخدمين
│   ├── users.js      # إدارة المستخدمين
│   ├── trips.js      # إدارة الرحلات
│   ├── bookings.js   # إدارة الحجوزات
│   ├── payments.js   # إدارة المدفوعات
│   └── admin.js      # وظائف الإدارة
├── middleware/       # وسطاء Express
│   ├── auth.js       # مصادقة المستخدم
│   └── upload.js     # رفع الملفات
├── public/           # الواجهة الأمامية
│   ├── index.html    # الصفحة الرئيسية
│   ├── admin.html    # صفحة الإدارة
│   ├── styles.css    # تنسيقات CSS
│   ├── app.js        # JavaScript الرئيسي
│   └── manifest.json # إعدادات PWA
├── uploads/          # الملفات المرفوعة
├── server.js         # الخادم الرئيسي (MongoDB)
├── server-demo.js    # نسخة تجريبية (بدون DB)
└── package.json      # إعدادات المشروع
```

## التقنيات المستخدمة

### Backend
- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل الخادم
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM لـ MongoDB
- **JWT** - مصادقة المستخدمين
- **bcryptjs** - تشفير كلمات المرور
- **Multer** - رفع الملفات
- **Socket.io** - الاتصال الفوري

### Frontend
- **Vanilla JavaScript** - بدون مكتبات إضافية
- **CSS3** - تنسيقات متقدمة
- **HTML5** - هيكل الصفحات
- **Font Awesome** - الأيقونات
- **Cairo Font** - خط عربي

## إضافة ميزات جديدة

### 1. إضافة صفحة جديدة

1. **إنشاء HTML**
```html
<div class="page" id="new-page">
    <div class="page-header">
        <h1>عنوان الصفحة الجديدة</h1>
    </div>
    <!-- محتوى الصفحة -->
</div>
```

2. **إضافة رابط في النافذة**
```html
<a href="#" class="nav-link" data-page="new">
    <i class="fas fa-icon"></i> الصفحة الجديدة
</a>
```

3. **إضافة JavaScript**
```javascript
function loadNewPage() {
    // تحميل بيانات الصفحة
}

// في showPage function
case 'new':
    loadNewPage();
    break;
```

### 2. إضافة API endpoint جديد

1. **في routes/yourfile.js**
```javascript
router.get('/endpoint', auth, async (req, res) => {
    try {
        // منطق العملية
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('خطأ في الخادم');
    }
});
```

2. **ربطه في server.js**
```javascript
const yourRoutes = require('./routes/yourfile');
app.use('/api/your', yourRoutes);
```

### 3. إضافة نموذج جديد

```javascript
const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    field1: {
        type: String,
        required: true
    },
    field2: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NewModel', newSchema);
```

## التطوير والاختبار

### إعداد بيئة التطوير
```bash
# تثبيت المكتبات
npm install

# تشغيل النسخة التجريبية
node server-demo.js

# تشغيل مع MongoDB
npm start

# تطوير مع إعادة التحميل التلقائي
npm install -g nodemon
nodemon server.js
```

### اختبار الـ API
```javascript
// مثال اختبار endpoint
const response = await fetch('/api/trips', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        date: '2023-12-01',
        time: '08:00',
        price: 25
    })
});
```

## إرشادات الترميز

### تسمية المتغيرات
```javascript
// استخدم أسماء وصفية
const userBookings = [];  // ✅
const bookings = [];      // ❌

// استخدم camelCase للمتغيرات
const totalAmount = 100;  // ✅
const total_amount = 100; // ❌
```

### معالجة الأخطاء
```javascript
// تأكد من معالجة جميع الأخطاء
try {
    const result = await someAsyncFunction();
    res.json(result);
} catch (error) {
    console.error('Error in functionName:', error);
    res.status(500).json({ 
        message: 'رسالة خطأ مناسبة للمستخدم' 
    });
}
```

### التحقق من البيانات
```javascript
// تحقق من وجود البيانات المطلوبة
if (!email || !password) {
    return res.status(400).json({ 
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان' 
    });
}
```

## الأمان

### حماية المسارات
```javascript
// استخدم middleware المناسب
app.use('/api/admin/*', adminAuth);  // للإدارة فقط
app.use('/api/user/*', auth);        // للمستخدمين المسجلين
```

### تشفير البيانات الحساسة
```javascript
// تشفير كلمات المرور
const hashedPassword = await bcrypt.hash(password, 10);

// التحقق من كلمة المرور
const isMatch = await bcrypt.compare(password, user.password);
```

### التحقق من رفع الملفات
```javascript
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('يجب أن يكون الملف صورة فقط'), false);
    }
};
```

## قاعدة البيانات

### العلاقات بين الجداول
```javascript
// في نموذج Booking
booking.populate('user', 'name studentId');
booking.populate('trip', 'date time from to');
```

### الاستعلامات المحسنة
```javascript
// استخدم الفهارس للبحث السريع
// في نموذج User
userSchema.index({ email: 1, studentId: 1 });

// استعلامات مع التصفية
const trips = await Trip.find({ 
    date: { $gte: new Date() },
    status: 'active'
}).sort({ date: 1 });
```

## التحسينات المقترحة

### الأداء
1. إضافة Redis للتخزين المؤقت
2. ضغط الاستجابات
3. تحسين الصور المرفوعة
4. استخدام CDN للملفات الثابتة

### المميزات
1. إشعارات Push
2. تطبيق موبايل (React Native)
3. نظام تقييم الرحلات
4. خرائط لتتبع الحافلة
5. نظام خصومات ونقاط

### الأمان
1. Rate limiting للـ API
2. تسجيل العمليات (Logging)
3. مراقبة الأنشطة المشبوهة
4. نسخ احتياطية تلقائية

## استكشاف الأخطاء

### أخطاء شائعة
```javascript
// خطأ: Cannot set headers after they are sent
// الحل: تأكد من عدم إرسال أكثر من رد واحد
if (condition) {
    return res.json(data);  // استخدم return
}
res.json(otherData);

// خطأ: UnhandledPromiseRejectionWarning
// الحل: استخدم try-catch مع async/await
try {
    await someAsyncOperation();
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
}
```

### تسجيل الأخطاء
```javascript
// إضافة تسجيل مفصل
console.log('User attempting login:', { email, timestamp: new Date() });
console.error('Login failed:', { email, error: error.message });
```

## المساهمة

### قبل إرسال Pull Request
1. اختبر الكود محلياً
2. تأكد من عدم وجود أخطاء في Console
3. اتبع إرشادات الترميز
4. أضف تعليقات واضحة
5. حدث الوثائق إذا لزم الأمر

### Git Workflow
```bash
git checkout -b feature/feature-name
git add .
git commit -m "Add feature: description"
git push origin feature/feature-name
# إنشاء Pull Request
```