const http = require('http');

http.get('http://localhost:3001/api/user/badges?userId=1&year=2025', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const earnedMap = new Set(json.badges.filter(b => b.is_earned).map(b => b.badge_code));

            console.log("yulyul:", earnedMap.has('yulyul') ? "YES" : "NO");
            console.log("qwer-1:", earnedMap.has('qwer-1') ? "YES" : "NO");
            console.log("qwer-2:", earnedMap.has('qwer-2') ? "YES" : "NO");
            console.log("qwer-3:", earnedMap.has('qwer-3') ? "YES" : "NO");
        } catch (e) {
            console.error("JSON Parse Error:", e.message);
        }
    });
}).on('error', (err) => {
    console.error("Error:", err.message);
});
