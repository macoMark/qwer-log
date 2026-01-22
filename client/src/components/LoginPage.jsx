import { useState } from 'react'

function LoginPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()

            if (res.ok) {
                if (isLogin) {
                    onLogin(data.user)
                } else {
                    alert('Signup successful! Please login.')
                    setIsLogin(true)
                }
            } else {
                if (isLogin) {
                    setError('일치하는 회원 정보가 없습니다.')
                } else {
                    setError(data.error || 'Something went wrong')
                }
            }
        } catch (err) {
            setError('Failed to connect to server')
        }
    }

    // Dynamic classes based on mode
    const containerClass = isLogin ? "bg-mesh" : "bg-mesh-signup"
    const wrapperClass = isLogin ? "" : "signup-mode"
    const titleText = isLogin ? "IDOL-LOG" : "회원가입"
    const buttonText = isLogin ? "로그인" : "회원가입"
    const linkText = isLogin ? "회원가입" : "로그인"
    const linkPreText = isLogin ? "아직 계정이 없으신가요? " : "이미 계정이 있다면? "
    const loginLinkText = isLogin ? "회원가입" : "로그인"
    const iconName = isLogin ? "arrow_forward" : "person_add"

    return (
        <div className={`${containerClass} ${wrapperClass}`}>
            <div className="login-container">
                {/* Logo Area */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <img src="/assets/logo.png" alt="QWER LOG" style={{ width: '200px', objectFit: 'contain' }} />
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* ID Input */}
                    <div className="input-group">
                        <span className="material-symbols-outlined input-icon">person</span>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="아이디"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                if (error) setError('')
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit(e)
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="input-group">
                        <span className="material-symbols-outlined input-icon">lock</span>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="비밀번호 (4글자)"
                            maxLength={4}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (error) setError('')
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit(e)
                            }}
                        // style={{ letterSpacing: '0.5em' }}
                        />
                    </div>
                </div>

                <div style={{ width: '100%', marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {error && (
                        <p className="error-msg animate-shake" style={{ width: '100%', marginBottom: '0.75rem', textAlign: 'center', color: '#ff0000', fontSize: '0.875rem', fontWeight: 600 }}>
                            {error}
                        </p>
                    )}

                    <button onClick={handleSubmit} className="login-action-btn">
                        <span>{buttonText}</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{iconName}</span>
                    </button>

                    <p style={{ marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>
                        {linkPreText}
                        <button
                            className="signup-link"
                            style={{ marginTop: 0, marginLeft: '0.25rem' }}
                            onClick={() => { setIsLogin(!isLogin); setError('') }}
                        >
                            {loginLinkText}
                        </button>
                    </p>
                </div>

                {isLogin && (
                    <div style={{ width: '100%', marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', textAlign: 'left' }}>
                        <ul style={{ fontSize: '0.85rem', color: '#888888', paddingLeft: '1rem', listStyleType: 'disc', lineHeight: '1.6', margin: 0 }}>
                            <li style={{ marginBottom: '0.25rem' }}>로그인 시 브라우저에서 비밀번호 유출 경고가 발생할 수 있습니다.</li>
                            <li style={{ marginBottom: '0.25rem' }}>쉬운 비밀번호 (ex. 0000, 1234) 사용으로 인한 경고이며 실제로 일어나는 비밀번호 유출은 아니니 안심하세요.</li>
                            <li>비밀번호는 개발자도 알지 못하도록 암호화되어 저장됩니다.</li>
                        </ul>
                    </div>
                )}

                {!isLogin && (
                    <div style={{ width: '100%', marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', textAlign: 'left' }}>
                        <ul style={{ fontSize: '0.85rem', color: '#888888', paddingLeft: '1rem', listStyleType: 'disc', lineHeight: '1.6', margin: 0 }}>
                            <li style={{ marginBottom: '0.25rem' }}>문자와 숫자 4글자로 이루어진 비밀번호를 만들 수 있습니다.</li>
                            <li style={{ marginBottom: '0.25rem' }}>비밀번호는 개발자도 알지 못하도록 암호화되어 저장됩니다.</li>
                            <li style={{ marginBottom: '0.25rem' }}>비밀번호 찾기 기능이 제공되지 않습니다.</li>
                            <li>
                                비밀번호 분실 시 오픈채팅방으로 문의해주세요. {' '}
                                <a
                                    href="https://open.kakao.com/o/s3ujgxci"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'underline', color: '#888888', cursor: 'pointer' }}
                                >
                                    [오픈채팅방 문의하기]
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LoginPage
