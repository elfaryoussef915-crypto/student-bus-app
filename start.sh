#!/bin/bash

echo "بدء تشغيل تطبيق Student Bus..."

# Check if MongoDB is running
if ! pgrep mongod > /dev/null; then
    echo "تحذير: MongoDB غير متشغل. يرجى تشغيل MongoDB أولاً."
    echo "يمكنك تشغيل MongoDB بالأمر: mongod"
fi

# Install backend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "تثبيت dependencies الخلفية..."
    npm install
fi

# Ensure uploads directory exists
mkdir -p uploads

# Start the server
echo "تشغيل الخادم..."
echo "التطبيق سيعمل على: http://localhost:5000"
echo "لوحة الإدارة: http://localhost:5000/admin.html"

npm start