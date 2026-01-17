import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [merchant, setMerchant] = useState({});
    const [stats, setStats] = useState({});
    const API_BASE = "http://localhost:8000";
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE}/api/v1/test/merchant`)
            .then(res => res.json())
            .then(data => {
                setMerchant(data);
                return fetch(`${API_BASE}/api/v1/merchant/stats`, {
                    headers: { 'X-Api-Key': data.api_key, 'X-Api-Secret': data.api_secret }
                });
            })
            .then(res => res.json())
            .then(setStats);
    }, []);

    return (
        <div className="dashboard-page" data-test-id="dashboard">
            <nav className="side-nav">
                <h2>Gateway</h2>
                <button onClick={() => navigate('/dashboard')}>Overview</button>
                <button onClick={() => navigate('/dashboard/transactions')}>Transactions</button>
            </nav>
            <main className="main-content">
                <header>
                    <h1>Dashboard Overview</h1>
                    <div className="api-badge" data-test-id="api-credentials">
                        <span>Key: <code data-test-id="api-key">{merchant.api_key}</code></span>
                        <span>Secret: <code data-test-id="api-secret">{merchant.api_secret}</code></span>
                    </div>
                </header>
                <div className="stats-grid" data-test-id="stats-container">
                    <div className="stat-card">
                        <label>Total Transactions</label>
                        <div className="value" data-test-id="total-transactions">{stats.total_transactions || 0}</div>
                    </div>
                    <div className="stat-card">
                        <label>Total Volume</label>
                        <div className="value" data-test-id="total-amount">
                            ₹{((stats.total_amount || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="stat-card">
                        <label>Success Rate</label>
                        <div className="value" data-test-id="success-rate">{stats.success_rate || 0}%</div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default Dashboard;