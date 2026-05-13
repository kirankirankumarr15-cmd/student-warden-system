# Student Warden Alert System

A full-stack, real-time hostel attendance and management system designed to streamline student check-ins/check-outs, monitor hostel premises, and automatically alert parents in case of late entries.

## 🌟 Features

- **Real-time Dashboard:** Live statistics and recent activity logs updated in real-time using Socket.IO.
- **QR Code Scanner:** Built-in HTML5 camera scanner for quick student check-in/check-out at the gate.
- **Student Registration:** Add new students along with their parent's contact details. Generates QR codes automatically.
- **Automated Alerts:** Sends automatic email notifications to parents if a student enters the hostel after the designated closing time.
- **Dynamic Configuration:** Easily configure weekday/weekend opening/closing times, reminder alerts, and grace periods directly from the UI.
- **Secure Access:** Admin login portal to secure the warden dashboard.

## 💻 Tech Stack

**Frontend:**
- React 18 (via CDN)
- Tailwind CSS
- Vanilla JavaScript
- Chart.js (for data visualization)
- HTML5-QRCode (for camera scanning)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Socket.IO (Real-time tracking)
- Nodemailer (Email alerts)
- JWT (Authentication)
- bcrypt (Password hashing)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running locally

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the unified server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the local host link:
   👉 **[http://localhost:5000](http://localhost:5000)**

### 🔑 Default Credentials
- **Username:** admin
- **Password:** admin123 (or use warden / password123)

## 📝 Usage
1. Log in to the system.
2. Go to **Settings** first to configure your hostel's schedule.
3. Use **Register Student** to add students to your system.
4. Go to **QR Scanner**, allow camera permissions, and scan student codes for attendance!

## 📄 License
This project is licensed under the MIT License.
