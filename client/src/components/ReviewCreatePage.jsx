import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import '../index.css'

function ReviewCreatePage() {
    const { eventId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [event, setEvent] = useState(location.state?.event || null)
    // Use reviewText from state if editing, otherwise default to empty
    const [reviewText, setReviewText] = useState(location.state?.reviewText || '')
    const [loading, setLoading] = useState(!event)

    useEffect(() => {
        if (!event) {
            // Fallback fetch if state is missing (e.g. direct access)
            fetch(`/api/events/${eventId}`)
                .then(res => res.json())
                .then(data => {
                    setEvent(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error("Failed to load event", err)
                    setLoading(false)
                })
        }
    }, [eventId, event])

    const handleSave = async () => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            alert('로그인이 필요합니다.')
            navigate('/login')
            return
        }
        const user = JSON.parse(storedUser)

        console.log("Saving Review:", { eventId, reviewText })

        try {
            const response = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, eventId, reviewText })
            })

            if (response.ok) {
                // Success
                navigate(`/review/view/${eventId}`, { state: { event, reviewText } })
            } else {
                console.error('Failed to save review')
                alert('저장에 실패했습니다. 다시 시도해주세요.')
            }
        } catch (error) {
            console.error('Error saving review:', error)
            alert('네트워크 오류가 발생했습니다.')
        }
    }

    if (loading) return <div className="p-4 text-white">Loading...</div>
    if (!event) return <div className="p-4 text-white">이벤트를 찾을 수 없습니다.</div>

    const formattedDate = new Date(event.date).toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\./g, '.').slice(0, -1) // Format: 2024.10.24

    return (
        <div className="review-page-bg min-h-screen flex flex-col overflow-hidden font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-header">
                <div className="flex items-center p-4 justify-between max-w-md mx-auto" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '28rem', margin: '0 auto', padding: '1rem' }}>
                    <div className="flex items-center gap-3" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                            style={{
                                display: 'flex', width: '2.5rem', height: '2.5rem', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)'
                            }}
                        >
                            <span className="material-symbols-outlined">arrow_back_ios_new</span>
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold leading-tight tracking-tight" style={{ color: 'var(--text-main)', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>후기 작성</h2>
                        </div>
                    </div>
                    <div className="w-10"></div>{/* Spacer */}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col max-w-md mx-auto w-full overflow-y-auto custom-scrollbar" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '28rem', margin: '0 auto', overflowY: 'auto' }}>
                <div className="px-4 py-4" style={{ padding: '1rem' }}>
                    <div className="review-surface rounded-xl p-4 flex items-center gap-4 shadow-sm" style={{ borderRadius: '0.75rem', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="flex flex-col justify-center min-w-0">
                            <p className="text-base font-semibold leading-tight truncate" style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 600, margin: 0 }}>{event.title}</p>
                            <p className="text-xs font-normal leading-normal mt-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span className="material-symbols-outlined text-[14px]" style={{ fontSize: '14px' }}>calendar_today</span>
                                {formattedDate}
                                {/* Location Removed */}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col px-4 pb-6" style={{ padding: '0 1rem 1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="relative flex-1 flex flex-col">
                        <label className="flex flex-col flex-1 group" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div className="flex justify-between items-center pb-2 px-1" style={{ paddingBottom: '0.5rem', paddingLeft: '0.25rem' }}>
                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Memories & Feelings</p>
                            </div>
                            <textarea
                                autoFocus
                                className="review-textarea custom-scrollbar"
                                placeholder="이 날은 어땠나요? QWER과 함께한 소중한 순간을 기록해 보세요."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="review-page-bg border-t border-slate-200 pb-8 pt-4 px-4" style={{ borderTop: '1px solid #e2e8f0', paddingBottom: '2rem', paddingTop: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div className="max-w-md mx-auto flex gap-4 items-center" style={{ maxWidth: '28rem', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-slate-100 text-slate-500 text-base font-bold leading-normal tracking-tight hover:bg-slate-200 transition-colors"
                        style={{ flex: 1, height: '3.5rem', borderRadius: '0.75rem', background: '#f1f5f9', color: '#64748b', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                        <span>취소</span>
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-[2] flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-tight shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
                        style={{ flex: 2, height: '3.5rem', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white', fontWeight: 700, boxShadow: '0 10px 15px -3px rgba(231, 60, 131, 0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <span className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            기록하기 <span className="material-symbols-outlined text-[20px]" style={{ fontSize: '20px' }}>send</span>
                        </span>
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default ReviewCreatePage
