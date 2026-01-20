import EventItem from './EventItem'

function MonthList({ events, attendance, onToggle, onReviewSave }) {
    // Group events by month
    const eventsByMonth = events.reduce((acc, ev) => {
        const month = new Date(ev.date).getMonth() + 1
        if (!acc[month]) acc[month] = []
        acc[month].push(ev)
        return acc
    }, {})

    return (
        <div className="month-list">
            {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                <div key={month} className="month-group">
                    <h2 className="month-title">{month}월</h2>
                    <div className="events-grid">
                        {monthEvents.map(ev => (
                            <EventItem
                                key={ev.id}
                                event={ev}
                                status={attendance[ev.id]?.status}
                                reviewText={attendance[ev.id]?.review_text}
                                onToggle={() => onToggle(ev.id, attendance[ev.id]?.status)}
                                onReviewSave={(text) => onReviewSave(ev.id, text)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MonthList
