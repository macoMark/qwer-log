import { useState } from 'react'
import ReviewModal from './ReviewModal'

function EventItem({ event, status, reviewText, onToggle, onReviewSave }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Helper to linkify text
    const renderReview = (text) => {
        if (!text) return null
        const urlRegex = /(https?:\/\/[^\s]+)/g
        const parts = text.split(urlRegex)

        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="review-link" onClick={e => e.stopPropagation()}>{part}</a>
            }
            return part
        })
    }

    return (
        <div className={`event-item ${status ? 'attended' : ''} type-${event.type}`}>
            <div className="event-date">
                <span className="day">{new Date(event.date).getDate()}</span>
                <span className="weekday">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
            </div>

            <div className="event-info">
                <div className="event-header">
                    <span className={`badge ${event.type}`}>{event.type}</span>
                    <span className="location">{event.location}</span>
                </div>
                <h4 className="event-title">{event.title}</h4>

                {reviewText && (
                    <div className="review-preview" onClick={() => setIsModalOpen(true)}>
                        {renderReview(reviewText)}
                    </div>
                )}
            </div>

            <div className="event-actions">
                <button
                    className={`checkin-btn ${status ? 'active' : ''}`}
                    onClick={onToggle}
                >
                    {status ? 'Check-in' : 'Check-in'}
                </button>
                <button className="review-btn" onClick={() => setIsModalOpen(true)}>
                    💬
                </button>
            </div>

            {isModalOpen && (
                <ReviewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialText={reviewText || ''}
                    onSave={onReviewSave}
                />
            )}
        </div>
    )
}

export default EventItem
