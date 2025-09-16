# دليل النشر والاستضافة - Student Bus

## خيارات الاستضافة الموصى بها

### 1. Railway (سهل ومجاني للبداية)
- إنشاء حساب على [Railway.app](https://railway.app)
- ربط مستودع GitHub
- إضافة MongoDB plugin أو استخدام MongoDB Atlas
- نشر تلقائي

### 2. Heroku (مجاني مع قيود)
- إنشاء حساب على [Heroku.com](https://heroku.com)
- تثبيت Heroku CLI
- إضافة MongoDB Atlas add-on
- `git push heroku main`

### 3. DigitalOcean App Platform ($5/شهر)
- إنشاء حساب على [DigitalOcean](https://digitalocean.com)
- استخدام App Platform
- ربط GitHub repository
- استضافة قاعدة بيانات منفصلة

### 4. Vercel (للواجهة الأمامية) + MongoDB Atlas
- الواجهة الأمامية على [Vercel.com](https://vercel.com)
- Backend على Railway أو Heroku
- قاعدة البيانات على [MongoDB Atlas](https://mongodb.com/atlas)

## الإعداد للنشر

### 1. إعداد متغيرات البيئة
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
ADMIN_SECRET=your_admin_secret_key
COMPANY_PHONE=01025857571
COMPANY_NAME=Student Bus
```

### 2. إعداد package.json للنشر
```json
{
  "scripts": {
    "start": "node server.js",
    "demo": "node server-demo.js",
    "dev": "nodemon server.js"
  }
}
```

### 3. إعداد MongoDB Atlas (قاعدة بيانات سحابية مجانية)
1. إنشاء حساب على [MongoDB Atlas](https://mongodb.com/atlas)
2. إنشاء cluster مجاني
3. إعداد user وكلمة مرور
4. الحصول على connection string
5. إضافة IP addresses للوصول

### 4. أمان التطبيق
- تغيير JWT_SECRET في البيئة الإنتاجية
- استخدام HTTPS
- تحديث كلمات مرور المديرين
- إعداد backup دوري للبيانات

## خطوات النشر على Railway

1. **إعداد المستودع**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

2. **إنشاء مشروع Railway**
- اذهب إلى [Railway.app](https://railway.app)
- "New Project" → "Deploy from GitHub repo"
- اختر المستودع

3. **إضافة متغيرات البيئة**
- في Railway dashboard
- Variables → إضافة المتغيرات المطلوبة

4. **إضافة قاعدة البيانات**
- "Add Plugin" → "MongoDB"
- أو استخدم MongoDB Atlas connection string

5. **النشر**
- Railway سينشر تلقائياً
- سيعطيك URL للتطبيق

## إعداد نطاق مخصص

### إعداد النطاق
1. شراء نطاق من (نيم شيب، جودادي، إلخ)
2. في Railway/Heroku: إضافة custom domain
3. تحديث DNS records للنطاق
4. إعداد SSL certificate (تلقائي عادة)

### إعدادات DNS
```
Type: CNAME
Name: @
Value: your-app-name.up.railway.app
```

## اختبار التطبيق بعد النشر

### اختبارات أساسية
- [ ] تحميل الصفحة الرئيسية
- [ ] تسجيل حساب جديد
- [ ] تسجيل دخول
- [ ] إضافة رحلة (Admin)
- [ ] حجز تذكرة
- [ ] رفع صورة شحن
- [ ] موافقة على طلب شحن (Admin)

### مراقبة الأداء
- استخدام Railway/Heroku metrics
- إعداد log monitoring
- تتبع استخدام قاعدة البيانات

## الصيانة والتحديثات

### نسخ احتياطية
- نسخة احتياطية يومية لقاعدة البيانات
- نسخة احتياطية أسبوعية للملفات المرفوعة

### تحديثات الأمان
- تحديث dependencies دورياً
- مراجعة logs للأنشطة المشبوهة
- تحديث كلمات المرور دورياً

### المراقبة
- إعداد alerts للأخطاء
- مراقبة استخدام الموارد
- تتبع معدل الاستخدام

## التكاليف المتوقعة

| الخدمة | المستوى المجاني | المدفوع |
|--------|----------------|---------|
| Railway | 5$/شهر بعد المرحلة المجانية | 5-20$/شهر |
| Heroku | مجاني (محدود) | 7$/شهر |
| MongoDB Atlas | 512MB مجاني | 9$/شهر للمشاريع الكبيرة |
| Vercel | مجاني للمشاريع الصغيرة | 20$/شهر للفرق |

## الدعم والمساعدة

للدعم التقني أو أسئلة النشر، تواصل مع فريق التطوير.

### روابط مفيدة
- [Railway Documentation](https://docs.railway.app)
- [Heroku Dev Center](https://devcenter.heroku.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Node.js Deployment Guide](https://nodejs.org/en/docs/guides/deploying-node-js-to-heroku)