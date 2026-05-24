const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('./database');
const authRoutes = require('./routes/auth');
const salaryRoutes = require('./routes/salary');
const expenseRoutes = require('./routes/expense');
const dashboardRoutes = require('./routes/dashboard');
const smsWebhook = require('./routes/smsWebhook');
const authenticateToken = require('./middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sms', smsWebhook);

app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, userId: req.userId });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
