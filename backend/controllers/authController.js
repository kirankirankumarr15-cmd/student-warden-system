const jwt = require('jsonwebtoken');

const USERS = [
  { username: 'admin',   password: 'admin123'   },
  { username: 'warden',  password: 'password123' },
];

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'supersecretwardenkey1234', { expiresIn: '1d' });
    return res.json({ token, username, message: 'Login successful' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
};
