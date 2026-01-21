import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSWR, { mutate } from 'swr'

// Fetcher function
const fetcher = (url) => fetch(url).then((res) => res.json())

const getDay = (dateStr) => {
    const d = new Date(dateStr)
    return d.getDate()
}

const getWeekday = (dateStr) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const d = new Date(dateStr)
    return days[d.getDay()]
}

function Dashboard({ user, onLogout }) {
    const navigate = useNavigate()

    // SWR for Events
    const { data: eventsData, error: eventsError, isLoading: eventsLoading } = useSWR('/api/events', fetcher, {
        revalidateOnFocus: false, // Don't revalidate on window focus to reduce requests
        dedupingInterval: 60000, // Cache for 1 minute
    })

    // SWR for Attendance
    const { data: attendanceData, error: attendanceError, isLoading: attendanceLoading, mutate: mutateAttendance } = useSWR(
        user?.id ? `/api/attendance?userId=${user.id}` : null,
        fetcher
    )

    // Derived states
    const events = useMemo(() => eventsData?.events || [], [eventsData])

    const attendance = useMemo(() => {
        const map = {}
        if (attendanceData?.attendance) {
            attendanceData.attendance.forEach(record => {
                map[record.event_id] = {
                    status: !!record.status,
                    review_text: record.review_text
                }
            })
        }
        return map
    }, [attendanceData])

    const [filter, setFilter] = useState(() => {
        // Initialize from localStorage or default to false
        const savedFansign = localStorage.getItem('filter_include_fansign')
        const savedOverseas = localStorage.getItem('filter_include_overseas')
        return {
            fansign: savedFansign ? JSON.parse(savedFansign) : false,
            overseas: savedOverseas ? JSON.parse(savedOverseas) : false
        }
    })

    // Persist filter state to localStorage
    useEffect(() => {
        localStorage.setItem('filter_include_fansign', JSON.stringify(filter.fansign))
        localStorage.setItem('filter_include_overseas', JSON.stringify(filter.overseas))
    }, [filter])

    // Loading State
    const loading = eventsLoading || (user?.id && attendanceLoading)

    // Removed Review Modal states
    const [filterModalOpen, setFilterModalOpen] = useState(false)

    // Data Fetching
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [selectedYear, setSelectedYear] = useState(2025)

    // Scroll Listener for FAB
    // Scroll Listener for FAB (Window scroll)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true)
            } else {
                setShowScrollTop(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handlers
    const handleToggleAttendance = async (eventId, currentStatus) => {
        if (!user) {
            navigate('/login')
            return
        }

        const newStatus = !currentStatus

        // Optimistic Update
        mutateAttendance(async (currentData) => {
            // Optimistically update the UI
            const updatedAttendance = currentData?.attendance ? [...currentData.attendance] : []
            const existingIndex = updatedAttendance.findIndex(r => r.event_id === eventId)

            if (existingIndex >= 0) {
                updatedAttendance[existingIndex] = { ...updatedAttendance[existingIndex], status: newStatus ? 1 : 0 }
            } else {
                updatedAttendance.push({ event_id: eventId, status: newStatus ? 1 : 0, review_text: null })
            }

            return { ...currentData, attendance: updatedAttendance }
        }, { revalidate: false }) // Don't revalidate immediately

        try {
            await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, eventId, status: newStatus })
            })
            // Revalidate after success to ensure consistency
            mutateAttendance()
        } catch (err) {
            console.error(err)
            // Revert on error
            mutateAttendance()
        }
    }

    const handleNavigateToReview = (event) => {
        if (!user) {
            navigate('/login')
            return
        }

        const hasReview = attendance[event.id]?.review_text
        if (hasReview) {
            navigate(`/review/view/${event.id}`, { state: { event } })
        } else {
            navigate(`/review/write/${event.id}`, { state: { event } })
        }
    }

    // Stats & Filtering Calculation
    const { filteredEvents, stats } = useMemo(() => {
        const filtered = events.filter(ev => {
            if (!filter.fansign && ev.type === 'fansign') return false
            if (!filter.overseas && ev.type === 'overseas') return false
            return true
        })

        // Group by month for display
        // Not used for stats, but good to have if needed. 
        // Stats logic:
        const total = filtered.length
        const attendCount = filtered.reduce((acc, ev) => acc + (attendance[ev.id]?.status ? 1 : 0), 0)

        // Monthly stats for current month (assume Dec or Jan 2025 for demo data, let's just show Jan)
        // Actually let's calculate for the specific month in view or just "This Month"
        const currentMonth = new Date().getMonth() + 1
        const thisMonthEvents = filtered.filter(ev => new Date(ev.date).getMonth() + 1 === 1) // Hardcoded 1 (Jan) for demo as per seed
        const thisMonthTotal = thisMonthEvents.length
        const thisMonthAttend = thisMonthEvents.reduce((acc, ev) => acc + (attendance[ev.id]?.status ? 1 : 0), 0)

        return {
            filteredEvents: filtered,
            stats: {
                annual: total > 0 ? Math.round((attendCount / total) * 100) : 0,
                monthly: thisMonthTotal > 0 ? Math.round((thisMonthAttend / thisMonthTotal) * 100) : 0
            }
        }
    }, [events, attendance, filter])

    // Grouping for List
    const { sortedGroupKeys, groupedEvents } = useMemo(() => {
        const groups = {}
        // Use 'events' instead of 'filteredEvents' to show ALL events regardless of filter
        events.forEach(ev => {
            const date = new Date(ev.date)
            // Key format: YYYY-M (e.g., 2025-1, 2025-10)
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
            if (!groups[monthKey]) groups[monthKey] = []
            groups[monthKey].push(ev)
        })

        // Strict Chronological Sort
        const sortedKeys = Object.keys(groups).sort((a, b) => {
            const [yearA, monthA] = a.split('-').map(Number)
            const [yearB, monthB] = b.split('-').map(Number)
            return yearA - yearB || monthA - monthB
        })

        // Sort events within each group
        const sortedGroups = sortedKeys.reduce((acc, key) => {
            acc[key] = groups[key].sort((a, b) => new Date(a.date) - new Date(b.date))
            return acc
        }, {})

        return { sortedGroupKeys: sortedKeys, groupedEvents: sortedGroups }
    }, [events]) // Depends on all events, not filtered ones

    const scrollToMonth = (index) => {
        const element = document.getElementById(`anchor-month-${index}`)
        if (element) {
            element.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
    }

    if (loading) return <div className="p-8 text-center" style={{ color: 'var(--text-main)' }}>Loading Data...</div>

    const TAG_LABELS = {
        fansign: '팬싸인회',
        overseas: '해외',
        concert: '콘서트',
        broadcast: '방송',
        showcase: '쇼케이스',
        sponsor: '행사',
        busking: '버스킹',
        univ_fest: '대학축제',
        univ_festival: '대학축제',
        festival: '페스티벌',
        rock_fest: '락페',
        awards: '시상식',
        individual: '개인',
        anniversary: '기념'
    }

    return (
        <div className="main-container" style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <header className="app-header">
                <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/assets/logo.png" alt="QWER LOG" style={{ height: '40px', objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user ? (
                        <button
                            onClick={onLogout}
                            style={{
                                background: 'transparent',
                                border: '1px solid #e2e8f0',
                                color: '#888888',
                                fontSize: '0.8rem',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            로그아웃
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="login-btn"
                        >
                            로그인
                        </button>
                    )}
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 relative">
                {/* Control Bar */}
                <section className="control-bar-section" style={{ padding: '0 1rem', marginTop: '1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* ... content ... */}
                    {/* Year Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        <button disabled style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'default' }}>&lt;</button>
                        <span>{selectedYear}</span>
                        <button disabled style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'default' }}>&gt;</button>
                    </div>

                    {/* Recap Button */}
                    <button
                        onClick={() => {
                            if (!user) {
                                navigate('/login')
                                return
                            }
                            navigate(`/recap/${selectedYear}`)
                        }}
                        style={{
                            padding: '0.6rem 2rem',
                            borderRadius: '2rem',
                            border: 'none',
                            background: 'var(--primary)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(231, 60, 131, 0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>bar_chart</span>
                        Recap
                    </button>
                </section>

                {/* Stats Section */}
                <section className="stats-section">
                    <div className="stats-card">
                        <div className="stat-row">
                            <div className="stat-header">
                                <p className="stat-label">연간 출석률</p>
                                <p className="stat-value text-primary">{stats.annual}%</p>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill bg-primary" style={{ width: `${stats.annual}%` }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter Toggle Bar */}
                <div className="filter-section">
                    <div className="filter-chips no-scrollbar">
                        <span
                            className={`chip fansign ${!filter.fansign ? 'opacity-50' : ''}`}
                            onClick={() => setFilter(prev => ({ ...prev, fansign: !prev.fansign }))}
                            style={{ cursor: 'pointer', opacity: filter.fansign ? 1 : 0.5 }}
                        >
                            {filter.fansign ? '팬싸 포함' : '팬싸 제외'}
                        </span>
                        <span
                            className={`chip overseas ${!filter.overseas ? 'opacity-50' : ''}`}
                            onClick={() => setFilter(prev => ({ ...prev, overseas: !prev.overseas }))}
                            style={{ cursor: 'pointer', opacity: filter.overseas ? 1 : 0.5 }}
                        >
                            {filter.overseas ? '해외 포함' : '해외 제외'}
                        </span>
                    </div>
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className="flex items-center gap-2 bg-white dark:bg-white/10 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'var(--white)', border: '1px solid #e2e8f0', color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 700 }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>tune</span>
                        출석률 필터
                    </button>
                </div>

                {/* Main Content List */}
                <main className="main-content" style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))' }}>
                    {
                        sortedGroupKeys.map((key, index) => {
                            const [year, month] = key.split('-')
                            const monthEvents = groupedEvents[key]

                            return (
                                <div key={key} id={`anchor-month-${index}`} className="month-group">
                                    <div className="sticky-month-header">
                                        {/* Per-Month Progress Bar & Calc */}
                                        {(() => {
                                            // Apply logic filter ONLY for stats calculation
                                            const calcEvents = monthEvents.filter(ev => {
                                                if (!filter.fansign && ev.type === 'fansign') return false
                                                if (!filter.overseas && ev.type === 'overseas') return false
                                                return true
                                            })

                                            const monthTotal = calcEvents.length
                                            const monthAttended = calcEvents.reduce((acc, ev) => acc + (attendance[ev.id]?.status ? 1 : 0), 0)
                                            const monthRate = monthTotal > 0 ? Math.round((monthAttended / monthTotal) * 100) : 0

                                            return (
                                                <>
                                                    <div className="month-nav">
                                                        {index > 0 ? (
                                                            <button className="nav-btn" onClick={() => scrollToMonth(index - 1)}>
                                                                <span className="material-symbols-outlined">chevron_left</span>
                                                            </button>
                                                        ) : (
                                                            <div className="w-8"></div> // Spacer
                                                        )}

                                                        <div className="flex flex-col items-center w-full">
                                                            <h3 className="month-title">
                                                                {month}월
                                                                <span style={{ fontSize: '0.8em', color: 'var(--primary)', marginLeft: '8px' }}>
                                                                    ({monthRate}%)
                                                                </span>
                                                            </h3>
                                                        </div>

                                                        {index < sortedGroupKeys.length - 1 ? (
                                                            <button className="nav-btn" onClick={() => scrollToMonth(index + 1)}>
                                                                <span className="material-symbols-outlined">chevron_right</span>
                                                            </button>
                                                        ) : (
                                                            <div className="w-8"></div> // Spacer
                                                        )}
                                                    </div>
                                                    <div className="progress-container">
                                                        <div className="progress-fill" style={{ width: `${monthRate}%` }}></div>
                                                    </div>
                                                </>
                                            )
                                        })()}
                                    </div>

                                    <div className="event-list">
                                        {monthEvents.map(ev => {
                                            const isAttended = attendance[ev.id]?.status
                                            const review = attendance[ev.id]?.review_text
                                            const specialTypes = ['concert', 'fansign', 'overseas', 'broadcast', 'showcase', 'sponsor', 'busking', 'festival', 'anniversary']
                                            const typeClass = specialTypes.includes(ev.type) ? ev.type : 'general'

                                            return (
                                                <div key={ev.id} className={`event-card ${isAttended ? 'highlighted' : ''}`}>
                                                    <div className="event-content">
                                                        <div className="date-column">
                                                            <span className={`date-day`}>{getDay(ev.date)}</span>
                                                            <span className="date-weekday">{getWeekday(ev.date)}</span>
                                                        </div>
                                                        <div className="info-column">
                                                            <div className="tags">
                                                                <span className={`tag ${typeClass}`}>{TAG_LABELS[ev.type] || ev.type}</span>
                                                                {ev.location && <span className="tag general">{ev.location}</span>}
                                                            </div>
                                                            <h4 className="event-title">{ev.title}</h4>

                                                            <div className="action-row" style={{ marginTop: '1rem' }}>
                                                                <button
                                                                    onClick={() => handleNavigateToReview(ev)}
                                                                    className="icon-btn"
                                                                    style={review ? { color: 'var(--primary)', backgroundColor: 'rgba(231, 60, 131, 0.1)' } : {}}
                                                                >
                                                                    <span className="material-symbols-outlined">chat_bubble</span>
                                                                </button>

                                                                <button
                                                                    onClick={() => handleToggleAttendance(ev.id, isAttended)}
                                                                    className={isAttended ? "attendance-badge" : "checkin-btn"}
                                                                >
                                                                    {isAttended ? (
                                                                        <>
                                                                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check_circle</span>
                                                                            출석함
                                                                        </>
                                                                    ) : (
                                                                        "출석 체크"
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-watermark">
                                                        <span className="material-symbols-outlined">album</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })
                    }
                </main>
            </div>

            {/* Filter Modal */}
            {
                filterModalOpen && (
                    <div className="modal-overlay" onClick={() => setFilterModalOpen(false)}>
                        <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                            <div className="sheet-handle"></div>
                            <h3 className="sheet-title">출석률 필터</h3>

                            <div className="filters-list">
                                <div className="filter-item">
                                    <span className="font-medium">팬싸 포함</span>
                                    <div
                                        className={`toggle-switch ${filter.fansign ? 'checked' : ''}`}
                                        onClick={() => setFilter(prev => ({ ...prev, fansign: !prev.fansign }))}
                                    >
                                        <div className="toggle-knob"></div>
                                    </div>
                                </div>
                                <div className="filter-item">
                                    <span className="font-medium">해외 일정 포함</span>
                                    <div
                                        className={`toggle-switch ${filter.overseas ? 'checked' : ''}`}
                                        onClick={() => setFilter(prev => ({ ...prev, overseas: !prev.overseas }))}
                                    >
                                        <div className="toggle-knob"></div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setFilterModalOpen(false)} className="apply-btn">
                                필터 적용
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Scroll to Top FAB */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                    position: 'fixed',
                    bottom: 'calc(2rem + env(safe-area-inset-bottom))',
                    right: '2rem',
                    backgroundColor: 'var(--white)',
                    color: 'var(--text-main)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    cursor: 'pointer',
                    opacity: showScrollTop ? 1 : 0,
                    visibility: showScrollTop ? 'visible' : 'hidden',
                    transition: 'all 0.3s ease',
                    zIndex: 50
                }}
                aria-label="Scroll to top"
            >
                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>arrow_upward</span>
            </button>
        </div>
    )
}

export default Dashboard
