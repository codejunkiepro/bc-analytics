import React from 'react';
import { Chart } from 'react-google-charts';

const UserProfile = ({ profile }) => {
    return (
        <div className="user-profile">
            <div className="profile-header">
                <h1>{profile.user.nick_name}</h1>
                <div className="user-id">User ID: {profile.user.user_id}</div>
            </div>

            <div className="stats-grid">
                {/* Main Stats */}
                <div className="stat-card">
                    <h3>Total Profit</h3>
                    <div className={`stat-value ${profile.stats.net_profit >= 0 ? 'positive' : 'negative'}`}>
                        {profile.stats.net_profit.toFixed(2)}
                    </div>
                </div>

                <div className="stat-card">
                    <h3>ROI</h3>
                    <div className={`stat-value ${profile.stats.roi_percentage >= 0 ? 'positive' : 'negative'}`}>
                        {profile.stats.roi_percentage.toFixed(2)}%
                    </div>
                </div>

                {/* Risk Assessment */}
                {profile.riskAssessment && (
                    <div className="stat-card risk-score">
                        <h3>Risk Score</h3>
                        <div
                            className="score-value"
                            style={{
                                color: `hsl(${120 - (profile.riskAssessment.score.riskScore * 1.2)}, 100%, 40%)`
                            }}
                        >
                            {profile.riskAssessment.score.riskScore}
                        </div>
                        <div className="score-label">0-100 (Lower is safer)</div>
                    </div>
                )}

                {/* More stats... */}
            </div>

            {/* Monthly Performance Chart */}
            <div className="chart-container">
                <h2>Monthly Performance</h2>
                <Chart
                    chartType="LineChart"
                    data={[
                        ['Month', 'Profit', 'ROI'],
                        ...profile.monthlyPerformance.map(m => [m.month, m.net_profit, m.roi_percentage])
                    ]}
                    options={{
                        title: 'Monthly Performance',
                        curveType: 'function',
                        legend: { position: 'bottom' },
                        series: {
                            0: { targetAxisIndex: 0 },
                            1: { targetAxisIndex: 1 }
                        },
                        vAxes: {
                            0: { title: 'Profit' },
                            1: { title: 'ROI %' }
                        }
                    }}
                    width="100%"
                    height="400px"
                />
            </div>

            {/* Game Performance Chart */}
            <div className="chart-container">
                <h2>Game Performance</h2>
                <Chart
                    chartType="BarChart"
                    data={[
                        ['Game', 'ROI', 'Profit'],
                        ...profile.performanceByGame.slice(0, 10).map(g => [g.game_name, g.roi_percentage, g.net_profit])
                    ]}
                    options={{
                        title: 'Top Games by Performance',
                        chartArea: { width: '70%' },
                        hAxis: { title: 'ROI %' },
                        vAxis: { title: 'Game' },
                        series: {
                            0: { type: 'bars', targetAxisIndex: 0 },
                            1: { type: 'bars', targetAxisIndex: 0 }
                        }
                    }}
                    width="100%"
                    height="500px"
                />
            </div>

            {/* Recent Bets Table */}
            <div className="recent-bets">
                <h2>Recent Bets</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Game</th>
                            <th>Bet Amount</th>
                            <th>Odds</th>
                            <th>Profit</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profile.recentBets.map(bet => (
                            <tr key={bet.distribute_id}>
                                <td>{bet.game_name}</td>
                                <td>{bet.bet_amount.toFixed(2)}</td>
                                <td>{bet.odds.toFixed(2)}</td>
                                <td className={bet.profit >= 0 ? 'positive' : 'negative'}>
                                    {bet.profit.toFixed(2)}
                                </td>
                                <td>{new Date(bet.bet_time).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Copy Trading Controls */}
            <div className="copy-controls">
                <h2>Copy Trading</h2>
                <div className="copy-form">
                    <input
                        type="number"
                        placeholder="Initial amount"
                        className="amount-input"
                    />
                    <button className="copy-button">Start Copying This Trader</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;