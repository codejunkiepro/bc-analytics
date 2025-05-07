import React from 'react';

const Filters = ({ filters, setFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="filters">
            <div className="filter-group">
                <label>Time Period (days):</label>
                <input
                    type="number"
                    name="days"
                    value={filters.days}
                    onChange={handleChange}
                    min="1"
                    max="365"
                />
            </div>

            <div className="filter-group">
                <label>Minimum Bets:</label>
                <input
                    type="number"
                    name="minBets"
                    value={filters.minBets}
                    onChange={handleChange}
                    min="1"
                />
            </div>

            <div className="filter-group">
                <label>Minimum ROI (%):</label>
                <input
                    type="number"
                    name="minROI"
                    value={filters.minROI}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                />
            </div>
        </div>
    );
};

export default Filters;