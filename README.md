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
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 1. Backend Setup
1. Open a terminal in the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file in the root with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/warden_system
   JWT_SECRET=your_super_secret_jwt_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
The frontend uses vanilla HTML/JS and CDNs, so it doesn't require complex bundlers to run.
1. Open a separate terminal.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Serve the frontend (you can use `npx serve` or Live Server):
   ```bash
   npx serve
   ```
4. Open your browser and navigate to `http://localhost:3000`.

### 🔑 Default Credentials
- **Username:** admin
- **Password:** admin123

## 📝 Usage
1. Log in to the system.
2. Go to **Settings** first to configure your hostel's schedule.
3. Use **Register Student** to add students to your system.
4. Go to **QR Scanner**, allow camera permissions, and scan student codes for attendance!

## 📄 License
This project is licensed under the MIT License.
