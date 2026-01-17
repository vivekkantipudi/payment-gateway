const pool = require('../config/db');
const { generateId } = require('../services/IdGenerator');

module.exports = {
    createOrder: async (req, res) => {
        const { amount, currency = 'INR', receipt, notes } = req.body;
        const merchant = req.merchant;

        if (!amount || amount < 100) {
            return res.status(400).json({
                error: { code: "BAD_REQUEST_ERROR", description: "amount must be at least 100" }
            });
        }

        const orderId = generateId('order_');
        
        try {
            const result = await pool.query(
                `INSERT INTO orders (id, merchant_id, amount, currency, receipt, notes, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, 'created') RETURNING *`,
                [orderId, merchant.id, amount, currency, receipt, notes]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ error: { code: "SERVER_ERROR", description: err.message } });
        }
    },

    getOrder: async (req, res) => {
        const { order_id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM orders WHERE id = $1', [order_id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: { code: "NOT_FOUND_ERROR", description: "Order not found" } });
            }
            res.json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ error: { code: "SERVER_ERROR", description: err.message } });
        }
    }
};