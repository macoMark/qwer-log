function StatsPanel({ stats, filter, setFilter }) {
    const percentage = stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0

    return (
        <div className="stats-panel">
            <div className="stats-card main-stat">
                <h3>Total Attendance</h3>
                <div className="progress-circle" style={{ '--percent': percentage }}>
                    <span>{percentage}%</span>
                </div>
                <p>{stats.attended} / {stats.total} Events</p>
            </div>

            <div className="stats-card filters">
                <h3>Filters</h3>
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={filter.fansign}
                        onChange={e => setFilter({ ...filter, fansign: e.target.checked })}
                    />
                    Include Fansign
                </label>
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={filter.overseas}
                        onChange={e => setFilter({ ...filter, overseas: e.target.checked })}
                    />
                    Include Overseas
                </label>
            </div>

            {/* Visualizing Monthly stats could be complex, keeping simple for now */}
            <div className="stats-card monthly-summary">
                <h3>Monthly Breakdown</h3>
                <div className="monthly-grid">
                    {Object.entries(stats.monthly).map(([month, data]) => (
                        <div key={month} className="month-stat-item">
                            <span>{month}월</span>
                            <div className="mini-bar">
                                <div style={{ width: `${(data.attended / data.total) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StatsPanel
