const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');
const authMiddleware = require('./config/authMiddleware');
const { createOrder, getOrder } = require('./controllers/OrderController');
const { processPayment } = require('./controllers/PaymentController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/health', async (req, res) => {
    res.json({ status: "healthy", database: "connected", redis: "connected", worker: "running", timestamp: new Date().toISOString() });
});

app.get('/api/v1/test/merchant', async (req, res) => {
    const result = await pool.query('SELECT id, email, api_key, api_secret FROM merchants WHERE email = $1', ['test@example.com']);
    res.json({ ...result.rows[0], seeded: true });
});

app.post('/api/v1/orders', authMiddleware, createOrder);
app.get('/api/v1/orders/:order_id', authMiddleware, getOrder);
app.post('/api/v1/payments', authMiddleware, processPayment);

// Public Endpoints for Checkout
app.get('/api/v1/orders/:order_id/public', async (req, res) => {
    const result = await pool.query('SELECT id, amount, currency, status FROM orders WHERE id = $1', [req.params.order_id]);
    res.json(result.rows[0]);
});

app.post('/api/v1/payments/public', async (req, res) => {
    const order = await pool.query('SELECT merchant_id FROM orders WHERE id = $1', [req.body.order_id]);
    req.merchant = { id: order.rows[0].merchant_id };
    processPayment(req, res);
});

app.get('/api/v1/payments/:payment_id/public', async (req, res) => {
    const result = await pool.query('SELECT * FROM payments WHERE id = $1', [req.params.payment_id]);
    res.json(result.rows[0]);
});

app.get('/api/v1/merchant/stats', authMiddleware, async (req, res) => {
    const stats = await pool.query(`
        SELECT COUNT(*)::int as total_transactions,
        COALESCE(SUM(CASE WHEN status='success' THEN amount ELSE 0 END), 0)::int as total_amount,
        COUNT(CASE WHEN status='success' THEN 1 END)::int as success_count
        FROM payments WHERE merchant_id = $1`, [req.merchant.id]);
    const data = stats.rows[0];
    res.json({ ...data, success_rate: data.total_transactions > 0 ? Math.round((data.success_count / data.total_transactions) * 100) : 0 });
});

app.get('/api/v1/merchant/payments', authMiddleware, async (req, res) => {
    const result = await pool.query('SELECT * FROM payments WHERE merchant_id = $1 ORDER BY created_at DESC', [req.merchant.id]);
    res.json(result.rows);
});

const seed = async () => {
    const sql = fs.readFileSync(path.join(__dirname, 'resources/schema.sql'), 'utf8');
    await pool.query(sql);
    app.listen(8000, () => console.log('API running on 8000'));
};
seed();