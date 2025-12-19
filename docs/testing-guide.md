# Testing Guide - QR Absensi App

## Overview

Panduan lengkap untuk manual testing QR Absensi App. Dokumentasi ini mencakup complete E2E flow testing, feature testing checklists, dan bug reporting.

---

## Quick Start Testing (25 Minutes)

### Complete End-to-End Flow

**Goal:** Verify complete user journey dari registration hingga attendance tracking.

**Requirements:**

- Browser (Chrome/Firefox recommended)
- 2 browser windows/tabs (Admin + Student)
- Camera access (untuk QR scanner)
- Clean database state

---

### Part 1: Student Registration & Setup (5 min)

**Steps:**

```
1. Navigate to http://localhost:3000/register
2. Fill registration form:
   ├─ Nama Lengkap: "Test Student"
   ├─ Email: "student@test.com"
   ├─ Password: "password123"
   ├─ Konfirmasi Password: "password123"
   ├─ Role: "Mahasiswa"
   └─ NIM: "123456789"
3. Click "Daftar"
```

**Expected Results:**

- ✅ Redirect to `/student` dashboard
- ✅ Sidebar shows "Test Student"
- ✅ NIM displayed: "123456789"
- ✅ Stats show: 0 attendance
- ✅ Quick scan button visible
- ✅ No errors in console

**Screenshot:** Dashboard mahasiswa pertama kali

---

### Part 2: Admin Registration & Create Session (5 min)

**Steps:**

```
1. Open new window/tab
2. Navigate to http://localhost:3000/register
3. Fill registration form:
   ├─ Nama Lengkap: "Test Admin"
   ├─ Email: "admin@test.com"
   ├─ Password: "password123"
   ├─ Konfirmasi Password: "password123"
   └─ Role: "Dosen/Staf"
4. Click "Daftar"
5. Navigate to /admin/sessions
6. Click "Buat Sesi Baru"
7. Enter course name: "Data Structures 101"
8. Click "Buat Sesi"
```

**Expected Results:**

- ✅ Redirect to `/admin` dashboard
- ✅ Sidebar shows "Test Admin"
- ✅ Sessions page shows empty list
- ✅ After create: Redirect to session detail
- ✅ QR code displayed (large, 300x300)
- ✅ Status badge: "Aktif" (blue/primary)
- ✅ Attendance count: 0 mahasiswa
- ✅ Download button visible

**Screenshot:** Session detail dengan QR code

**⚠️ Important:** Keep this window open for student scanning

---

### Part 3: Student Scan QR Code (5 min)

**Steps:**

```
1. Switch to student window
2. Click "Scan Sekarang" button
3. Click "Mulai Scan"
4. Grant camera permission (if prompted)
5. Point camera at QR code from admin window
   - Position QR code in center of frame
   - Hold steady until scan completes
```

**Expected Results:**

- ✅ Camera activates (live video feed)
- ✅ QR code detected automatically
- ✅ Success toast appears: "Absensi berhasil..."
- ✅ Auto-redirect to `/student` dashboard
- ✅ Dashboard updates:
  - Total Kehadiran: 1
  - Absen Hari Ini: 1
  - Recent list shows "Data Structures 101"

**Screenshot:** Success toast dan updated dashboard

---

### Part 4: Admin Real-time Verification (3 min)

**Steps:**

```
1. Switch to admin window (session detail)
2. Observe the page (NO REFRESH)
```

**Expected Results:**

- ✅ Attendance list updates automatically
- ✅ "Test Student" appears in list
- ✅ NIM shown: 123456789
- ✅ Scan time shows current time
- ✅ Count updates: "1 mahasiswa"
- ✅ No page reload needed (real-time!)

**Screenshot:** Real-time attendance update

---

### Part 5: Duplicate Scan Prevention (2 min)

**Steps:**

```
1. Switch to student window
2. Navigate to /student/scan
3. Click "Mulai Scan"
4. Scan same QR code again
```

**Expected Results:**

- ✅ Error toast appears
- ✅ Message: "Anda sudah absen untuk sesi ini"
- ✅ No new record in admin window
- ✅ Count remains 1 mahasiswa

**Screenshot:** Duplicate error toast

---

### Part 6: Close Session (2 min)

**Steps:**

```
1. Switch to admin window (session detail)
2. Click "Tutup Sesi" button
3. Confirm dialog appears
4. Click "Ya, Tutup Sesi"
```

**Expected Results:**

- ✅ Confirmation dialog shows
- ✅ Warning message displayed
- ✅ After confirm: Success toast
- ✅ Status badge changes to "Ditutup" (gray)
- ✅ Button disappears
- ✅ Info text: "Sesi telah ditutup..."

**Test Closed Session Scan:**

```
1. Student tries to scan again
```

- ✅ Error: "Sesi sudah ditutup"

---

### Part 7: Attendance History (2 min)

**Steps:**

```
1. Student window: Navigate to /student/history
```

**Expected Results:**

- ✅ Table shows 1 record
- ✅ Course: "Data Structures 101"
- ✅ Tanggal Sesi: Today's date
- ✅ Waktu Scan: Correct time
- ✅ Status: "Hadir" badge
- ✅ Summary cards:
  - Total Kehadiran: 1
  - Absensi Terakhir: Today

---

### Part 8: CSV Export (2 min)

**Steps:**

```
1. Admin window: Session detail page
2. Click "Export ke CSV"
```

**Expected Results:**

- ✅ File downloads
- ✅ Filename format: attendance\_[session-id].csv
- ✅ Contains:
  - Header: "Laporan Kehadiran: Data Structures 101"
  - Column headers: No, Nama, NIM, Waktu Scan
  - Data row: 1, Test Student, 123456789, [timestamp]

---

## Detailed Feature Testing

### Authentication Tests

#### Register Tests

**Test 1.1: Valid Student Registration**

```
Input:
- Name: Valid name
- Email: valid@email.com
- Password: 123456
- Confirm: 123456
- Role: Mahasiswa
- NIM: 12345
Expected: Success → Redirect to /student
```

**Test 1.2: Student Without NIM**

```
Input: Role = Mahasiswa, NIM = empty
Expected: Error "NIM wajib diisi untuk mahasiswa"
```

**Test 1.3: Short Password**

```
Input: Password = "12345"
Expected: Error "Password minimal 6 karakter"
```

**Test 1.4: Mismatched Passwords**

```
Input: Password ≠ Confirm Password
Expected: Error "Password tidak cocok"
```

**Test 1.5: Invalid Email**

```
Input: Email = "invalid-email"
Expected: Error "Email tidak valid"
```

**Test 1.6: Duplicate Email**

```
Input: Email already registered
Expected: Error from Supabase
```

**Test 1.7: Valid Admin Registration**

```
Input:
- Name: Valid name
- Email: admin@email.com
- Password: 123456
- Confirm: 123456
- Role: Dosen/Staf
Expected: Success → Redirect to /admin
Note: NIM field should not be required
```

---

#### Login Tests

**Test 2.1: Valid Student Login**

```
Input: Registered student credentials
Expected: Redirect to /student dashboard
```

**Test 2.2: Valid Admin Login**

```
Input: Registered admin credentials
Expected: Redirect to /admin dashboard
```

**Test 2.3: Invalid Email**

```
Input: Email not in database
Expected: Error "Invalid login credentials"
```

**Test 2.4: Wrong Password**

```
Input: Correct email, wrong password
Expected: Error "Invalid login credentials"
```

---

#### Logout Tests

**Test 3.1: Logout**

```
Steps:
1. Click logout button
Expected:
- Redirect to /login
- Session cleared
- Cannot access /student or /admin
```

---

### Authorization Tests

#### Student Authorization

**Test 4.1: Student Access to Student Routes**

```
Steps:
1. Login as student
2. Navigate to /student
Expected: Access granted
```

**Test 4.2: Student Access to Admin Routes**

```
Steps:
1. Login as student
2. Navigate to /admin
Expected: Redirect to /student
```

**Test 4.3: Student Can Scan**

```
Steps:
1. Login as student
2. Navigate to /student/scan
Expected: Scanner page loads, can scan
```

**Test 4.4: Student Can View Own History**

```
Steps:
1. Login as student
2. Navigate to /student/history
Expected: Only own attendance shown
```

---

#### Admin Authorization

**Test 5.1: Admin Access to Admin Routes**

```
Steps:
1. Login as admin
2. Navigate to /admin
Expected: Access granted
```

**Test 5.2: Admin Can Create Sessions**

```
Steps:
1. Login as admin
2. Navigate to /admin/sessions/new
3. Create session
Expected: Success
```

**Test 5.3: Admin Can View All Attendance**

```
Steps:
1. Login as admin
2. View session detail
Expected: All students' attendance visible
```

---

### Session Management Tests

**Test 6.1: Create Session**

```
Input: Course name = "Test Course"
Expected:
- Session created
- Redirect to session detail
- QR code generated
- Status = "Aktif"
```

**Test 6.2: Create Session - Empty Name**

```
Input: Course name = ""
Expected: Validation error
```

**Test 6.3: View Session List**

```
Expected:
- All sessions displayed
- Status badges correct
- Attendance count shown
```

**Test 6.4: Session Detail**

```
Expected:
- QR code visible
- Course name correct
- Status badge correct
- Attendance list
- Actions available
```

**Test 6.5: Close Session**

```
Steps:
1. Click "Tutup Sesi"
2. Confirm dialog
Expected:
- Status → "Ditutup"
- Button disappears
- Toast notification
```

**Test 6.6: Close Session - Cancel**

```
Steps:
1. Click "Tutup Sesi"
2. Click "Batal"
Expected:
- Dialog closes
- Session remains active
```

---

### QR Scanner Tests

**Test 7.1: Scanner Initialization**

```
Steps:
1. Navigate to /student/scan
2. Click "Mulai Scan"
Expected:
- Camera permission requested
- Video feed appears
- Instructions visible
```

**Test 7.2: Successful Scan**

```
Steps:
1. Scan valid active session QR
Expected:
- Toast success
- Attendance recorded
- Redirect to dashboard
```

**Test 7.3: Invalid QR Code**

```
Steps:
1. Scan random QR code (not session)
Expected:
- Error toast
- "Sesi tidak ditemukan"
```

**Test 7.4: Inactive Session**

```
Steps:
1. Scan closed session QR
Expected:
- Error toast
- "Sesi sudah ditutup"
```

**Test 7.5: Duplicate Scan**

```
Steps:
1. Scan session already attended
Expected:
- Error toast
- "Anda sudah absen untuk sesi ini"
```

---

### UI/UX Tests

**Test 8.1: Responsive - Desktop**

```
Device: 1920x1080
Expected:
- Full sidebar visible
- Tables readable
- QR code clear
- No horizontal scroll
```

**Test 8.2: Responsive - Tablet**

```
Device: 768x1024
Expected:
- Layout adapts
- Sidebar may collapse
- Tables scroll if needed
- QR code resizes
```

**Test 8.3: Responsive - Mobile**

```
Device: 375x667
Expected:
- Mobile header shows
- Hamburger menu (if implemented)
- QR scanner optimized
- Tables scroll horizontally
```

**Test 8.4: Loading States**

```
Expected:
- Forms show loading on submit
- Pages show skeletons
- Buttons disabled while loading
```

**Test 8.5: Error States**

```
Expected:
- Form errors display clearly
- Toast notifications work
- Error messages in Indonesian
```

---

## Bug Report Template

Use this template when reporting issues:

```markdown
# Bug Report

**Date:** 2024-12-20
**Tester:** [Your Name]
**Browser:** Chrome 120 / Firefox 121 / Safari 17
**OS:** Windows 11 / macOS 14 / Ubuntu 22.04
**Device:** Desktop / Tablet / Mobile

---

## Bug #1: [Short Title]

**Severity:**

- [ ] Critical (App unusable)
- [ ] High (Major feature broken)
- [ ] Medium (Feature partially broken)
- [ ] Low (Minor issue, cosmetic)

**Module:** Authentication / Sessions / Scanner / etc.

**Steps to Reproduce:**

1. Navigate to X
2. Click Y
3. Enter Z
4. Observe result

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshots:**
[Attach screenshots if helpful]

**Console Errors:**
```

[Any errors from browser console]

```

**Additional Context:**
[Any other relevant information]

---
```

---

## Success Criteria

### ✅ All Tests Pass If:

1. **Authentication**
   - Registration works for both roles
   - Login redirects correctly
   - Logout clears session
   - Validation catches errors

2. **Authorization**
   - Students can't access admin
   - Admins can manage sessions
   - RLS enforced (students see own data only)

3. **Core Features**
   - Sessions created successfully
   - QR codes generated
   - Scanner works on mobile
   - Attendance recorded
   - Real-time updates work

4. **UX**
   - Responsive on all devices
   - Loading states visible
   - Errors handled gracefully
   - Confirmations for destructive actions

5. **Data Integrity**
   - No duplicate scans
   - Closed sessions can't be scanned
   - CSV export accurate

---

## Testing Tips

### Best Practices

1. **Use DevTools**
   - Check console for errors
   - Monitor network requests
   - Inspect database queries (Supabase logs)

2. **Test Edge Cases**
   - Empty inputs
   - Very long inputs
   - Special characters
   - Concurrent users

3. **Test Different States**
   - Fresh user (no data)
   - User with data
   - After logout/login

4. **Document Everything**
   - Take screenshots
   - Note timestamps
   - Record unexpected behavior

---

## Appendix: Common Issues & Solutions

### Issue: Camera Not Working

**Possible Causes:**

- Permission denied
- HTTPS required (localhost OK)
- Browser doesn't support

**Solutions:**

- Check browser permissions
- Use localhost or HTTPS
- Try different browser

---

### Issue: Real-time Not Updating

**Possible Causes:**

- Supabase Realtime not enabled
- Browser tab inactive
- Network issues

**Solutions:**

- Check Supabase Realtime settings
- Keep tab active
- Check network connection

---

### Issue: Login Fails

**Possible Causes:**

- Wrong credentials
- Email not confirmed (if enabled)
- Supabase connection issue

**Solutions:**

- Verify credentials
- Check Supabase dashboard
- Check .env variables

---

## Conclusion

Follow this guide untuk comprehensive manual testing. Report any issues menggunakan bug template. After testing complete, app is ready for deployment!

**Happy Testing! 🧪**
