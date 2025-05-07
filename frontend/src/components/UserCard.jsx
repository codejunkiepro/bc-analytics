import React from 'react';
import { Chart } from 'react-google-charts';

const UserCard = ({ user }) => {
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
                    <span className="stat-label">Win Rate</span>
                    <span className="stat-value">{user.win_rate.toFixed(2)}%</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Risk Factor</span>
                    <span className="stat-value">{user.riskFactor.toFixed(2)}%</span>
                </div>
            </div>

            <div className="game-performance">
                <h4>Top Performing Games</h4>
                <Chart
                    width={'100%'}
                    height={'300px'}
                    chartType="BarChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Game', 'ROI'],
                        ...user.gamePerformance.slice(0, 5).map(game => [
                            game.game_name,
                            game.roi_percentage
                        ])
                    ]}
                    options={{
                        title: 'Top Games by ROI',
                        chartArea: { width: '70%' },
                        hAxis: {
                            title: 'ROI %',
                            minValue: 0,
                        },
                        vAxis: {
                            title: 'Game',
                        },
                    }}
                />
            </div>

            <button className="follow-button">Copy This Trader</button>
        </div>
    );
};

export default UserCard;