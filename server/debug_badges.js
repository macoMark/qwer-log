const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { calculateUserBadges } = require('./services/badgeEvaluator');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const userId = 1; // Assuming checking for user ID 1 (or I need to find the user)

console.log("--- 1. Checking Badges Table ---");
db.all("SELECT badge_code, badge_name FROM badges WHERE badge_code IN ('yulyul', 'qwer-1', 'qwer-2', 'qwer-3')", [], (err, rows) => {
    if (err) {
        console.error("DB Error:", err);
        return;
    }
    console.log("New Badges found in DB:", rows);

    console.log("\n--- 2. Checking User Attendance & Logic ---");
    db.all("SELECT * FROM attendance WHERE user_id = ?", [userId], (err, attendance) => {
        if (err) { console.error(err); return; }

        // We need joined event data for the evaluator
        const placeholders = attendance.map(() => '?').join(',');
        const eventIds = attendance.map(a => a.event_id);

        if (eventIds.length === 0) {
            console.log("No attendance records for user.");
            return;
        }

        db.all(`SELECT * FROM events WHERE id IN (${placeholders})`, eventIds, (err, attendedEvents) => {
            if (err) { console.error(err); return; }

            // Merge attendance status into events (mimicking the service logic roughly)
            const userAttendance = attendedEvents.map(ev => {
                const att = attendance.find(a => a.event_id === ev.id);
                return { ...ev, status: att.status, tags: ev.tags }; // tags is string here
            });

            // Fetch ALL events for rate calculation
            db.all("SELECT * FROM events", [], (err, allEvents) => {
                if (err) { console.error(err); return; }

                db.all("SELECT * FROM badges", [], (err, allBadges) => {
                    const results = calculateUserBadges(userAttendance, allBadges, allEvents);

                    const newBadges = results.filter(b => ['yulyul', 'qwer-1', 'qwer-2', 'qwer-3'].includes(b.badge_code));
                    console.log("\nBadge Evaluation Results for New Badges:");
                    newBadges.forEach(b => {
                        console.log(`[${b.badge_code}] Earned: ${b.is_earned}`);
                    });

                    // Debug specific counts
                    const attendedTags = userAttendance.flatMap(e => JSON.parse(e.tags));
                    console.log("\nDebug Counts:");
                    console.log("Total Attended:", userAttendance.length);
                    console.log("Total Events:", allEvents.length);
                    console.log("Draw Tags:", attendedTags.filter(t => t === 'draw').length);
                });
            });
        });
    });
});
