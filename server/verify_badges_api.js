const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/user/badges?userId=1&year=2025',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("--- Badge Verification ---");
            if (json.badges) {
                console.log(`Total Badges: ${json.badges.length}`);
                const earned = json.badges.filter(b => b.is_earned);
                console.log(`Earned Badges: ${earned.length}`);
                earned.forEach(b => console.log(`- [EARNED] ${b.badge_name} (${b.badge_code})`));

                if (json.badges.length === 24) {
                    console.log("SUCCESS: 24 Badges returned.");
                } else {
                    console.log(`WARNING: Expected 24 badges, got ${json.badges.length}`);
                }
            } else {
                console.log("Error: No badges in response", json);
            }
        } catch (e) {
            console.error("Error parsing JSON:", e);
            console.log("Raw Data:", data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
