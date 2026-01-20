const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const db = require('./database');
const db = require('./db_adapter');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const crypto = require('crypto');

// ... (middleware)

// Auth Routes
app.post('/api/auth/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    // Hash password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Postgres: Use RETURNING id to get the new ID
    db.run("INSERT INTO users (username, password) VALUES (?, ?) RETURNING id", [username, hashedPassword], function (err) {
        if (err) {
            // Postgres unique constraint error code is 23505
            if (err.message.includes('duplicate key') || err.code === '23505') {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'User created' });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    db.get("SELECT id, username FROM users WHERE username = ? AND password = ?", [username, hashedPassword], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            // Simple session management: return user info. 
            // In a real app, use JWT or session cookies. 
            // For this requirement "Login session maintenance", we will send back user ID and handle it on client (localStorage).
            res.json({ message: 'Login successful', user: row });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// ... Auth routes above

// Event Routes
app.get('/api/events', (req, res) => {
    db.all("SELECT * FROM events ORDER BY date ASC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ events: rows });
    });
});

// Attendance Routes
// Get user's attendance records
app.get('/api/attendance', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'UserId required' });
    }

    db.all("SELECT event_id, status, review_text FROM attendance WHERE user_id = ?", [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ attendance: rows });
    });
});

// Toggle attendance status
app.post('/api/attendance', (req, res) => {
    const { userId, eventId, status } = req.body;
    // status should be true/false or 1/0
    // Insert or Update. Using SQLite UPSERT (ON CONFLICT)

    // Check if row exists first? Or use ON CONFLICT.
    // user_id + event_id is PK.

    // Convert boolean to 0/1 if needed, though JS/SQLite handle it usually (SQLite stores 0/1).
    const statusInt = status ? 1 : 0;

    const sql = `
        INSERT INTO attendance (user_id, event_id, status)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, event_id) DO UPDATE SET
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    `;

    db.run(sql, [userId, eventId, statusInt], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Attendance updated' });
    });
});

// Review Routes
app.post('/api/review', (req, res) => {
    const { userId, eventId, reviewText } = req.body;

    const sql = `
        INSERT INTO attendance (user_id, event_id, review_text, status)
        VALUES (?, ?, ?, 0) 
        ON CONFLICT(user_id, event_id) DO UPDATE SET
        review_text = excluded.review_text,
        updated_at = CURRENT_TIMESTAMP
        -- Preserve status if it exists. Wait, if I insert, status defaults to 0. 
        -- If update, I shouldn't overwrite status with 0 if it was 1.
        -- But ON CONFLICT UPDATE SET ... I can't easily reference 'old' status if I'm not careful.
        -- Actually, DO UPDATE SET review_text = excluded.review_text ... 
        -- status is NOT touched if I don't put it in SET. Correct.
    `;

    // However, if I INSERT (new row), status is 0 (default). That is fine. 
    // What if the user didn't check in but wrote a review? Status 0 is fine.

    // Wait, the SQL above sets status ONLY in VALUES. If conflict (update), it runs the DO UPDATE SET part.
    // In UPDATE SET, I am NOT setting status. So status remains as is. 

    db.run(sql, [userId, eventId, reviewText], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Review saved' });
    });
});

app.delete('/api/review', (req, res) => {
    // Requirements: CRUD support.
    // Set review_text to null.
    const { userId, eventId } = req.body;
    const sql = `
        UPDATE attendance SET review_text = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND event_id = ?
    `;
    db.run(sql, [userId, eventId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Review deleted' });
    });
});
// Badge Routes
const { calculateUserBadges } = require('./services/badgeEvaluator');
// Get UserBadges & Stats (Yearly Filtered)
// PATCH: Added ?year=YYYY support (default 2025)
app.get('/api/user/badges', (req, res) => {
    const userId = req.query.userId;
    const year = req.query.year || '2025';
    const dateFilter = `${year}-%`;

    if (!userId) return res.status(400).json({ error: 'userId is required' });

    // 1. Get all badges definitions
    db.all("SELECT * FROM badges", [], (err, badges) => {
        if (err) return res.status(500).json({ error: err.message });

        // 2. Get user's attended events with details (Filtered by Year)
        const sql = `
            SELECT a.*, e.title, e.type, e.date, e.tags, e.runtime 
            FROM attendance a 
            JOIN events e ON a.event_id = e.id 
            WHERE a.user_id = ? AND a.status = 1 AND e.date LIKE ?
        `;
        db.all(sql, [userId, dateFilter], (err, attendance) => {
            if (err) return res.status(500).json({ error: err.message });

            // 3. Get total event count (for calculating percentage)
            // Modified: Exclude 'fansign' and 'overseas' from the denominator
            // AND Filter by Year
            const excludeTypes = "('fansign', 'overseas')";
            const validSql = `SELECT count(*) as count FROM events WHERE (type NOT IN ${excludeTypes} OR type IS NULL) AND date LIKE ?`;

            db.get(validSql, [dateFilter], (err, row) => {
                if (err) return res.status(500).json({ error: err.message });

                const totalValidEvents = row.count;

                // 4. Calculate badges
                // NEW LOGIC: Pass all events (filtered by year) to the evaluator
                const allEventsSql = "SELECT * FROM events WHERE date LIKE ?";

                db.all(allEventsSql, [dateFilter], (err, allEvents) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const totalAllEvents = allEvents.length;

                    // Pass filtered attendance and ALL filtered events to badges
                    const userBadges = calculateUserBadges(attendance, badges, allEvents);

                    // 5. Calculate Stats
                    const totalMeetingCount = attendance.length; // Keep total meeting count as "All meetings by user in this year"
                    const totalRuntimeMinutes = attendance.reduce((acc, curr) => acc + (curr.runtime || 0), 0);

                    // Format Runtime: "OO시간 OO분"
                    const hours = Math.floor(totalRuntimeMinutes / 60);
                    const minutes = totalRuntimeMinutes % 60;
                    let totalRuntime = '';
                    if (hours > 0) totalRuntime += `${hours}시간 `;
                    totalRuntime += `${minutes}분`;

                    // Attendance Rate (Filtered)
                    // Numerator: Attended events that are NOT (fansign OR overseas)
                    const validAttendanceCount = attendance.filter(a => !(a.type === 'fansign' || a.type === 'overseas')).length;
                    const attendanceRate = totalValidEvents > 0 ? Math.round((validAttendanceCount / totalValidEvents) * 100) : 0;

                    // Favorite Type Calculation
                    const typeCounts = attendance.reduce((acc, curr) => {
                        const type = curr.type || 'unknown';
                        acc[type] = (acc[type] || 0) + 1;
                        return acc;
                    }, {});

                    const TAG_LABELS_KO = {
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
                    };

                    let favoriteTypeKey = '-';
                    let maxCount = 0;
                    for (const [type, count] of Object.entries(typeCounts)) {
                        if (count > maxCount) {
                            maxCount = count;
                            favoriteTypeKey = type;
                        }
                    }
                    const favoriteType = TAG_LABELS_KO[favoriteTypeKey] || favoriteTypeKey;

                    res.json({
                        badges: userBadges,
                        stats: {
                            totalEvents: totalAllEvents,
                            totalMeetingCount,
                            totalRuntime, // string 'OO시간 OO분'
                            favoriteType, // Korean string
                            attendanceRate // number 0-100 (Modified logic)
                        }
                    });
                });
            });
        });
    });
});

app.get('/', (req, res) => {
    res.send('IDOL-LOG API Server');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
