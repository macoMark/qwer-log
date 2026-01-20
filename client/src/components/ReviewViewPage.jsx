import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import '../index.css'

function ReviewViewPage() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [event, setEvent] = useState(location.state?.event || null)
    const [reviewText, setReviewText] = useState(location.state?.reviewText || '')
    const [loading, setLoading] = useState(!event)

    useEffect(() => {
        // If coming directly or missing state, fetch data
        const fetchData = async () => {
            // In a real app we'd fetch the review *and* the event
            // For now, let's try to get event if missing
            if (!event) {
                try {
                    const res = await fetch(`/api/events/${eventId}`)
                    const data = await res.json()
                    setEvent(data)
                    // If we are fetching event, we might also need to fetch the review if it wasn't passed
                    // But the prompt implies we navigate here from Dashboard (which has review) 
                    // or Create Page (which passes it).
                    // If we reload, we might lose review text if it's not persisted in DB yet?
                    // Actually, Dashboard *has* the review in `attendance` state.
                    // But if we reload this page, we need to fetch it from API.
                    // Let's assume for now we might need to fetch review if not present.
                    // The prompt says "Save... then move to view page".
                    // Ideally we fetch the latest review from API here.
                    fetchReview(data.id)
                } catch (err) {
                    console.error(err)
                }
            } else if (!reviewText) {
                fetchReview(event.id)
            } else {
                setLoading(false)
            }
        }

        const fetchReview = async (id) => {
            // Simulate specific review fetch or use existing attendance API
            // We can use `/api/attendance?userId=...` but that gets all.
            // Or just trust the state for this "mock" flow if API isn't granular.
            // But let's try to be robust. 
            // We have user ID in localStorage?
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                const user = JSON.parse(storedUser)
                try {
                    const res = await fetch(`/api/attendance?userId=${user.id}`)
                    const data = await res.json()
                    const att = data.attendance?.find(a => a.event_id == id)
                    if (att) {
                        setReviewText(att.review_text || '')
                    }
                } catch (e) { console.error(e) }
            }
            setLoading(false)
        }

        fetchData()
    }, [eventId, event, reviewText])


    if (loading) return <div className="p-4 text-white">Loading...</div>
    if (!event) return <div className="p-4 text-white">이벤트를 찾을 수 없습니다.</div>

    const formattedDate = new Date(event.date).toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\./g, '.').slice(0, -1)

    const handleEdit = () => {
        navigate(`/review/write/${eventId}`, { state: { event, reviewText } })
    }

    return (
        <div className="review-page-bg min-h-screen flex flex-col overflow-hidden font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-header">
                <div className="flex items-center p-4 justify-between max-w-md mx-auto" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '28rem', margin: '0 auto', padding: '1rem' }}>
                    <div className="flex items-center gap-3" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            onClick={() => navigate('/')}
                            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                            style={{
                                display: 'flex', width: '2.5rem', height: '2.5rem', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)'
                            }}
                        >
                            <span className="material-symbols-outlined">arrow_back_ios_new</span>
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold leading-tight tracking-tight" style={{ color: 'var(--text-main)', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>후기</h2>
                        </div>
                    </div>
                    <div className="w-10"></div>
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
                        <div className="flex justify-between items-center pb-2 px-1" style={{ paddingBottom: '0.5rem', paddingLeft: '0.25rem' }}>
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Memories & Feelings</p>
                        </div>
                        <div
                            className="review-textarea custom-scrollbar"
                            style={{
                                display: 'block', minHeight: '200px',
                            }}
                        >
                            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{reviewText}</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="review-page-bg border-t border-slate-200 pb-10 pt-4 px-4" style={{ borderTop: '1px solid #e2e8f0', paddingBottom: '2.5rem', paddingTop: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div className="max-w-md mx-auto" style={{ maxWidth: '28rem', margin: '0 auto' }}>
                    <button
                        onClick={handleEdit}
                        className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-tight shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
                        style={{ width: '100%', height: '3.5rem', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white', fontWeight: 700, boxShadow: '0 10px 15px -3px rgba(231, 60, 131, 0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <span className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            수정 <span className="material-symbols-outlined text-[20px]" style={{ fontSize: '20px' }}>edit_note</span>
                        </span>
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default ReviewViewPage
