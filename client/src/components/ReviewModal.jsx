import { useState } from 'react'

function ReviewModal({ isOpen, onClose, initialText, onSave }) {
    const [text, setText] = useState(initialText)

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(text)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Write a Review</h3>
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Write your memory here... URLs starting with http will be linked automatically."
                    rows={5}
                />
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="save-btn primary-btn" onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default ReviewModal
