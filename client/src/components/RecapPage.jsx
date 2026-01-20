import { useRef, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import html2canvas from 'html2canvas'
import { motion } from 'framer-motion'
import BadgeImage from './ui/BadgeImage'

function RecapPage({ user }) {
    const { year } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isDownloading, setIsDownloading] = useState(false)
    const targetYear = year || '2025'

    const handleDownload = async () => {
        setIsDownloading(true)
        const element = document.getElementById('recap-capture-area')
        if (!element) {
            setIsDownloading(false)
            return
        }

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#050511', // Force background color
                scale: 2, // High resolution
                logging: false,
                useCORS: true, // Allow cross-origin images (important for badges)
                onclone: (clonedDoc) => {
                    // Fix 'bg-clip-text' rendering issue in html2canvas
                    const gradientTexts = clonedDoc.querySelectorAll('.bg-clip-text')
                    gradientTexts.forEach(el => {
                        el.style.background = 'none'
                        el.style.webkitTextFillColor = 'initial'
                        el.style.color = '#c084fc' // Fallback color (purple-400)
                    })

                    // Force all animated elements to be visible in the clone
                    // Framer motion transforms might be in partial state or hidden
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        * {
                            opacity: 1 !important;
                            transform: none !important;
                            transition: none !important;
                            animation: none !important;
                        }
                    `;
                    clonedDoc.body.appendChild(style);
                }
            })

            const link = document.createElement('a')
            link.download = `${targetYear}_QWER_Recap.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (err) {
            console.error("Capture failed:", err)
        } finally {
            setIsDownloading(false)
        }
    }


    useEffect(() => {
        // Toggle dark mode for this page
        document.documentElement.classList.add('dark')
        return () => {
            document.documentElement.classList.remove('dark')
        }
    }, [])

    useEffect(() => {
        if (!user) return

        fetch(`/api/user/badges?userId=${user.id}&year=${targetYear}&_t=${Date.now()}`)
            .then(res => res.json())
            .then(json => {
                if (json.error) {
                    console.error("API Error:", json.error)
                    setData(null)
                } else {
                    setData(json)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [user, targetYear])


    useEffect(() => {
        if (data && !loading) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
        }
    }, [data, loading])


    if (loading) return <div className="min-h-screen bg-[#050511] text-white flex items-center justify-center">Loading...</div>
    if (!data) return <div className="min-h-screen bg-[#050511] text-white flex items-center justify-center">No Data or API Error</div>

    const { badges, stats } = data
    if (!stats || !badges) return <div className="min-h-screen bg-[#050511] text-white flex items-center justify-center">Invalid Data Format</div>

    const earnedBadges = badges.filter(b => b.is_earned)
    const timeString = stats.totalRuntime
    const attendanceRate = stats.attendanceRate
    const favoriteTypeLabel = stats.favoriteType

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    return (
        <div className="bg-[#050511] text-white min-h-screen relative overflow-x-hidden">
            <style>{`
                body {
                  min-height: max(884px, 100dvh);
                  font-family: 'Pretendard', sans-serif;
                }
                :root {
                    --neon-pink: #ff2d88;
                    --neon-cyan: #00f2ea;
                    --neon-lime: #ccff00;
                    --neon-purple: #bd00ff;
                    --glass-border: rgba(255, 255, 255, 0.1);
                    --glass-bg: rgba(255, 255, 255, 0.05);
                }
                .glass-panel {
                    background: var(--glass-bg);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid var(--glass-border);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.5;
                    z-index: 0;
                }
                @keyframes pulse {
                    50% { opacity: .5; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>

            {/* Header */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob bg-purple-900 w-[500px] h-[500px] -top-20 -left-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="blob bg-indigo-900 w-[400px] h-[400px] bottom-0 -right-20 animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="blob bg-pink-900/30 w-[300px] h-[300px] top-1/3 right-0"></div>
            </div>

            <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-20 bg-[#050511]/30 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="p-1 -ml-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">{targetYear} Recap</h1>
                </div>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                    title="이미지로 저장"
                >
                    {isDownloading ? (
                        <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
                    ) : (
                        <span className="material-symbols-outlined text-2xl">download</span>
                    )}
                </button>
            </header>

            <main className="px-6 pb-12 relative z-10" id="recap-capture-area">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`text-center space-y-4 py-12`}
                >
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        RECAP {targetYear}
                    </h1>
                    <p className="text-gray-400 text-lg">바위게님과 QWER의 1년</p>
                </motion.div>


                <motion.section
                    className="space-y-6 mb-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div variants={cardVariants} className="glass-panel p-4 rounded-xl flex flex-col justify-center min-h-[140px]">
                            <p className="text-sm font-semibold text-white/70 mb-1">올 해 QWER과</p>
                            <p className="text-3xl font-black text-[var(--neon-pink)] leading-none">
                                {stats.totalMeetingCount}번<br />
                                <span className="text-xl text-white">만났어요</span>
                            </p>
                        </motion.div>
                        <motion.div variants={cardVariants} className="glass-panel p-4 rounded-xl flex flex-col justify-center min-h-[140px]">
                            <p className="text-sm font-semibold text-white/70 mb-1">연간 출석률</p>
                            <p className="text-3xl font-black text-[var(--neon-cyan)] leading-none">
                                {attendanceRate}%<br />
                                <span className="text-xl text-white">달성</span>
                            </p>
                            <p style={{ fontSize: '0.7rem', color: '#888888', marginTop: '0.5rem' }}>* 팬사인회, 해외 이벤트 제외</p>
                        </motion.div>
                    </div>

                    <motion.div variants={cardVariants} className="glass-panel p-5 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-white/70 mb-1">함께한 시간</p>
                            <p className="text-3xl font-black text-[var(--neon-lime)]">{timeString}</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-full">
                            <span className="material-symbols-outlined text-2xl text-[var(--neon-lime)]">schedule</span>
                        </div>
                    </motion.div>

                    <motion.div variants={cardVariants} className="glass-panel p-5 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-white/70 mb-1">가장 사랑한 순간</p>
                            <p className="text-3xl font-black text-white decoration-wavy decoration-[var(--neon-purple)] underline decoration-2 underline-offset-4">
                                {favoriteTypeLabel}
                            </p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-full">
                            <span className="material-symbols-outlined text-2xl text-[var(--neon-purple)]">favorite</span>
                        </div>
                    </motion.div>
                </motion.section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold tracking-tight">획득한 뱃지</h3>
                        <span className="text-xs font-medium text-white/50 bg-white/10 px-2 py-1 rounded-full">
                            {earnedBadges.length}개
                        </span>
                    </div>

                    <div className="space-y-3">
                        {earnedBadges.length === 0 ? (
                            <div className="glass-panel rounded-xl p-8 text-center text-white/50">
                                획득한 뱃지가 없어요.
                            </div>
                        ) : (
                            earnedBadges.map((badge, index) => (
                                <motion.div
                                    key={badge.badge_id}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }} // Slight stagger per item
                                    className="glass-panel rounded-xl p-4 flex items-center gap-5 border border-white/5 relative overflow-hidden transition-all hover:bg-white/5"
                                >
                                    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center relative z-10">
                                        <BadgeImage src={badge.badge_image_url} alt={badge.badge_name} className="w-full h-full object-contain drop-shadow-lg transition-transform hover:scale-110 duration-300" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col z-10 pt-0.5">
                                        <h4 className="font-bold text-lg text-white tracking-tight">{badge.badge_name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/20">
                                                {badge.badge_condition}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">{badge.badge_detail}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default RecapPage
