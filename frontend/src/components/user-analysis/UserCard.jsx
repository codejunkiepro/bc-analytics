import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-google-charts';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <div className="user-card">
      <div className="user-header">
        <h3>{user.nick_name}</h3>
        <span className="user-id">ID: {user.user_id}</span>
      </div>
      
      <div className="user-stats">
        <div className="stat">
          <span className="stat-label">Net Profit</span>
          <span className="stat-value positive">{user.net_profit.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">ROI</span>
          <span className="stat-value positive">{user.roi_percentage.toFixed(2)}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Bets</span>
          <span className="stat-value">{user.total_bets}</span>
        </div>
      </div>
      
      <div className="user-actions">
        <button 
          className="view-profile"
          onClick={() => navigate(`/user/${user.user_id}`)}
        >
          View Profile
        </button>
        <button className="copy-user">Copy This Trader</button>
      </div>
    </div>
  );
};

export default UserCard;