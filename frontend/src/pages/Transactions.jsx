import React, { useState, useEffect } from 'react';

const Transactions = () => {
    const [payments, setPayments] = useState([]);
    const API_BASE = "http://localhost:8000";

    useEffect(() => {
        fetch(`${API_BASE}/api/v1/test/merchant`)
            .then(res => res.json())
            .then(data => {
                return fetch(`${API_BASE}/api/v1/merchant/payments`, {
                    headers: { 'X-Api-Key': data.api_key, 'X-Api-Secret': data.api_secret }
                });
            })
            .then(res => res.json())
            .then(setPayments);
    }, []);

    return (
        <div className="transactions-page main-content">
            <h1>Payment History</h1>
            <table data-test-id="transactions-table" className="data-table">
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(p => (
                        <tr key={p.id} data-test-id="transaction-row" data-payment-id={p.id}>
                            <td data-test-id="payment-id">{p.id}</td>
                            <td data-test-id="order-id">{p.order_id}</td>
                            <td data-test-id="amount">{p.amount}</td>
                            <td data-test-id="method">{p.method}</td>
                            <td data-test-id="status" className={p.status}>{p.status}</td>
                            <td data-test-id="created-at">{new Date(p.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default Transactions;