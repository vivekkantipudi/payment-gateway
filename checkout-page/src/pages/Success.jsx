import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Success = () => {
    const [searchParams] = useSearchParams();
    return (
        <div className="status-container success" data-test-id="success-state">
            <div className="icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Payment ID: <span data-test-id="payment-id">{searchParams.get('pay_id')}</span></p>
            <p data-test-id="success-message">Your payment has been processed successfully.</p>
        </div>
    );
};
export default Success;