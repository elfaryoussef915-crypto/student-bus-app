#!/usr/bin/env powershell

Write-Host "=== بدء تشغيل تطبيق Student Bus ===" -ForegroundColor Green

# Check for Node.js
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js غير مثبت. يرجى تثبيت Node.js من https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "تثبيت المكتبات المطلوبة..." -ForegroundColor Blue
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ خطأ في تثبيت المكتبات" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ تم تثبيت المكتبات بنجاح" -ForegroundColor Green
}

# Create uploads directory
if (-not (Test-Path "uploads")) {
    mkdir uploads | Out-Null
    Write-Host "✓ تم إنشاء مجلد uploads" -ForegroundColor Green
}

# Check for MongoDB
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "⚠ MongoDB غير متشغل" -ForegroundColor Yellow
    Write-Host "سيتم تشغيل النسخة التجريبية (بدون قاعدة بيانات)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "للنسخة الكاملة مع MongoDB:" -ForegroundColor Cyan
    Write-Host "1. ثبت MongoDB من https://mongodb.com/try/download/community" -ForegroundColor Cyan
    Write-Host "2. شغل الأمر: mongod" -ForegroundColor Cyan
    Write-Host "3. ثم شغل: npm start" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "تشغيل النسخة التجريبية..." -ForegroundColor Blue
    Write-Host "التطبيق سيعمل على: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "لوحة الإدارة: http://localhost:3000/admin.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "بيانات تسجيل دخول المدير:" -ForegroundColor Yellow
    Write-Host "البريد: elfaryoussef915@gmail.com" -ForegroundColor Yellow
    Write-Host "كلمة المرور: Youssef ali elfar 2112005" -ForegroundColor Yellow
    Write-Host ""
    
    node server-demo.js
} else {
    Write-Host "✓ MongoDB يعمل" -ForegroundColor Green
    Write-Host "تشغيل النسخة الكاملة..." -ForegroundColor Blue
    Write-Host "التطبيق سيعمل على: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "لوحة الإدارة: http://localhost:5000/admin.html" -ForegroundColor Cyan
    
    npm start
}