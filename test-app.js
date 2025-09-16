// اختبار سريع لـ API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

async function testAPI() {
    console.log('🧪 بدء اختبار Student Bus API...\n');
    
    try {
        // Test 1: Register new user
        console.log('1️⃣ اختبار تسجيل مستخدم جديد...');
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'أحمد محمد',
            email: 'ahmed@test.com',
            phone: '01012345678',
            studentId: 'ST123456',
            password: '123456'
        });
        console.log('✅ تم تسجيل المستخدم بنجاح');
        authToken = registerResponse.data.token;

        // Test 2: Login
        console.log('2️⃣ اختبار تسجيل الدخول...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'ahmed@test.com',
            password: '123456'
        });
        console.log('✅ تم تسجيل الدخول بنجاح');

        // Test 3: Get current user
        console.log('3️⃣ اختبار الحصول على بيانات المستخدم...');
        const userResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ تم الحصول على بيانات المستخدم');

        // Test 4: Admin login
        console.log('4️⃣ اختبار تسجيل دخول المدير...');
        const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'elfaryoussef915@gmail.com',
            password: 'Youssef ali elfar 2112005'
        });
        console.log('✅ تم تسجيل دخول المدير بنجاح');
        const adminToken = adminLoginResponse.data.token;

        // Test 5: Create trip
        console.log('5️⃣ اختبار إنشاء رحلة...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const tripResponse = await axios.post(`${BASE_URL}/trips`, {
            date: tomorrow.toISOString().split('T')[0],
            time: '08:00',
            price: 25
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ تم إنشاء الرحلة بنجاح');

        // Test 6: Get trips
        console.log('6️⃣ اختبار الحصول على الرحلات...');
        const tripsResponse = await axios.get(`${BASE_URL}/trips`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`✅ تم الحصول على ${tripsResponse.data.length} رحلة`);

        // Test 7: Get admin dashboard
        console.log('7️⃣ اختبار لوحة الإدارة...');
        const dashboardResponse = await axios.get(`${BASE_URL}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ تم الحصول على بيانات لوحة الإدارة');
        
        console.log('\n🎉 جميع الاختبارات نجحت!');
        console.log('\n📊 نتائج الاختبار:');
        console.log(`👥 عدد المستخدمين: ${dashboardResponse.data.stats.totalUsers}`);
        console.log(`🚌 عدد الرحلات: ${dashboardResponse.data.stats.totalTrips}`);
        console.log(`🎫 عدد الحجوزات: ${dashboardResponse.data.stats.totalBookings}`);

    } catch (error) {
        console.log('❌ فشل في الاختبار:', error.response?.data?.message || error.message);
        process.exit(1);
    }
}

// Run tests if axios is available
(async () => {
    try {
        await testAPI();
    } catch (error) {
        console.log('⚠️ لتشغيل الاختبارات، قم بتثبيت axios أولاً:');
        console.log('npm install axios');
        console.log('ثم شغل: node test-app.js');
    }
})();

module.exports = { testAPI };