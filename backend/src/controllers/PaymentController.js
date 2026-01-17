const pool = require('../config/db');
const { generateId } = require('../services/IdGenerator');
const ValidationService = require('../services/ValidationService');

module.exports = {
    processPayment: async (req, res) => {
        const { order_id, method, vpa, card } = req.body;
        const merchant = req.merchant;

        try {
            const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1', [order_id]);
            if (orderRes.rows.length === 0) return res.status(404).json({ error: "Order not found" });
            
            const paymentId = generateId('pay_');
            
            // Validation Logic
            if (method === 'upi' && !ValidationService.validateVPA(vpa)) {
                return res.status(400).json({ error: "Invalid VPA format" });
            }

            await pool.query(
                `INSERT INTO payments (id, order_id, merchant_id, amount, method, status, vpa) 
                 VALUES ($1, $2, $3, $4, $5, 'processing', $6)`,
                [paymentId, order_id, merchant.id, orderRes.rows[0].amount, method, vpa]
            );

            // Simulate bank delay
            setTimeout(async () => {
                const success = Math.random() < 0.95;
                await pool.query('UPDATE payments SET status = $1 WHERE id = $2', [success ? 'success' : 'failed', paymentId]);
            }, 5000);

            res.status(201).json({ id: paymentId, status: 'processing' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};