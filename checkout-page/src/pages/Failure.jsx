import React from 'react';
import { useNavigate } from 'react-router-dom';

const Failure = () => {
    const navigate = useNavigate();
    return (
        <div className="status-container failure" data-test-id="error-state">
            <div className="icon">✕</div>
            <h2>Payment Failed</h2>
            <p data-test-id="error-message">The transaction was declined by the bank.</p>
            <button data-test-id="retry-button" onClick={() => navigate(-1)}>Try Again</button>
        </div>
    );
};
export default Failure;