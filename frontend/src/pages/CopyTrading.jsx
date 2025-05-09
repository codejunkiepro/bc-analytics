import React, { useState, useEffect } from 'react';
import { getTopUsers } from '../services/api';
import UserCard from '../components/user-analysis/UserCard';
import Filters from '../components/user-analysis/Filters';
// import './CopyTrading.css';

const CopyTrading = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    days: 30,
    minBets: 20,
    minROI: 10
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getTopUsers(filters);
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters]);

  return (
    <div className="copy-trading-page">
      <h1>Top Traders to Copy</h1>
      <p>Discover the most profitable users to replicate their betting strategies</p>

      <Filters filters={filters} setFilters={setFilters} />

      {loading && <div className="loading">Loading top traders...</div>}
      {error && <div className="error">{error}</div>}

      <div className="users-grid">
        {users.map(user => (
          <UserCard key={user.user_id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default CopyTrading;