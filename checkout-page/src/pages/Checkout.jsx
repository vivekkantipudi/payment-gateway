import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('order_id');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch public order details
        fetch(`http://localhost:8000/api/v1/orders/${orderId}/public`)
            .then(res => res.json())
            .then(data => setOrder(data));
    }, [orderId]);

    const handleUPIPayment = async (vpa) => {
        setLoading(true);
        const res = await fetch('http://localhost:8000/api/v1/payments/public', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, method: 'upi', vpa })
        });
        const payment = await res.json();
        startPolling(payment.id);
    };

    const startPolling = (paymentId) => {
        const interval = setInterval(async () => {
            const res = await fetch(`http://localhost:8000/api/v1/payments/${paymentId}/public`);
            const data = await res.json();
            
            if (data.status === 'success') {
                clearInterval(interval);
                navigate(`/success?pay_id=${paymentId}`);
            } else if (data.status === 'failed') {
                clearInterval(interval);
                navigate('/failure');
            }
        }, 2000); // Poll every 2 seconds as required
    };

    if (!order) return <div>Loading Order...</div>;

    return (
        <div data-test-id="checkout-container">
            <h1>Complete Your Payment</h1>
            <div data-test-id="order-summary">
                <p>Order ID: <span data-test-id="order-id">{order.id}</span></p>
                <p>Amount: <span data-test-id="order-amount">₹{(order.amount / 100).toFixed(2)}</span></p>
            </div>
            
            <div data-test-id="payment-methods">
                <button data-test-id="method-upi" onClick={() => handleUPIPayment('test@upi')}>
                    Pay with UPI
                </button>
            </div>

            {loading && <div data-test-id="processing-state">Processing...</div>}
        </div>
    );
};

export default Checkout;