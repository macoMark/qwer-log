const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const badges = [
    {
        "badge_code": "qwermaster",
        "badge_name": "QWER Master",
        "badge_condition": "모든 일정의 90% 이상 참석",
        "badge_detail": "QWER의 2025년을 통째로 삼키셨군요! 당신은 제5의 멤버입니다.",
        "badge_logic_memo": "모든 일정의 90% 이상 참석",
        "badge_image_url": "/assets/badges/qwermaster.png"
    },
    {
        "badge_code": "grandslam",
        "badge_name": "그랜드슬램",
        "badge_condition": "모든 공연 이벤트 유형 각각 1회 이상 참석",
        "badge_detail": "모든 종류의 무대를 섭렵했어요. 육각형 올라운더 팬!",
        "badge_logic_memo": "참석한 이벤트 중 type이 concert, univ_festival, festival, awards, sponsor인 것이 각각 1개 이상 존재",
        "badge_image_url": "/assets/badges/grandslam.png"
    },
    {
        "badge_code": "attendance-award",
        "badge_name": "개근상",
        "badge_condition": "공연이 있는 모든 달 1회 이상 참석",
        "badge_detail": "한 달도 빠지지않고 QWER을 사랑했어요.",
        "badge_logic_memo": "참석한 이벤트 중 1월, 2월, 4월, 5월, 6월, 7월, 8월, 9월, 10월, 12월(3월, 11월 제외)인 것이 각각 1개 이상 존재",
        "badge_image_url": "/assets/badges/attendance-award.png"
    },
    {
        "badge_code": "concert-master",
        "badge_name": "콘서트 마스터",
        "badge_condition": "1, 2, QWER! 과 Rockation 1회 이상 관람",
        "badge_detail": "전설의 시작과 현재를 모두 목격한 증인!",
        "badge_logic_memo": "획득한 tags가 fancon>=1 and rockation >=1",
        "badge_image_url": "/assets/badges/concert-master.png"
    },
    {
        "badge_code": "fancon-all",
        "badge_name": "팬콘 올출러",
        "badge_condition": "국내 1, 2, QWER! 모두 관람",
        "badge_detail": "전 아직도 YES24홀에 살아요...",
        "badge_logic_memo": "획득한 tags가 fancon >=2",
        "badge_image_url": "/assets/badges/fancon-all.png"
    },
    {
        "badge_code": "rockation-all",
        "badge_name": "단콘 올출러",
        "badge_condition": "국내 Rockation 모두 관람",
        "badge_detail": "첫콘의 설렘과 중콘의 떨림, 막콘의 감동을 모두 느낀 바위게!",
        "badge_logic_memo": "획득한 tags가 rockation >=3",
        "badge_image_url": "/assets/badges/rockation-all.png"
    },
    {
        "badge_code": "concert-all",
        "badge_name": "콘서트 올출러",
        "badge_condition": "국내 1, 2, QWER!과 Rockation 모두 관람",
        "badge_detail": "하늘 아래 똑같은 콘서트는 없다!",
        "badge_logic_memo": "획득한 tags가 fancon>=2 and rockation >=3",
        "badge_image_url": "/assets/badges/concert-all.png"
    },
    {
        "badge_code": "rockneverdie",
        "badge_name": "락 윌 네버 다이",
        "badge_condition": "모든 락페스티벌 참여",
        "badge_detail": "슬램존의 지배자!",
        "badge_logic_memo": "획득한 tags가 rockfest=3",
        "badge_image_url": "/assets/badges/rockneverdie.png"
    },
    {
        "badge_code": "party-1",
        "badge_name": "파티피플 Silver",
        "badge_condition": "전체 페스티벌 중 50% 이상 참여",
        "badge_detail": "오 좀 놀 줄 아는 놈인가?",
        "badge_logic_memo": "획득한 tags가 festival >=6 and festival =! 12",
        "badge_image_url": "/assets/badges/party-1.png"
    },
    {
        "badge_code": "party-2",
        "badge_name": "파티피플 Master",
        "badge_condition": "전체 페스티벌 참여",
        "badge_detail": "오 좀 놀 줄 아는 놈인가?",
        "badge_logic_memo": "획득한 tags가 festival = 12",
        "badge_image_url": "/assets/badges/party-2.png"
    },
    {
        "badge_code": "fansign-1",
        "badge_name": "대화의 희열 Bronz",
        "badge_condition": "팬싸인회 1회 이상 참석",
        "badge_detail": "멀리서만 보던 멤버들이 내 눈 앞에!",
        "badge_logic_memo": "획득한 tags가 fansign >=1 and fansign <9",
        "badge_image_url": "/assets/badges/fansign-1.png"
    },
    {
        "badge_code": "fansign-2",
        "badge_name": "대화의 희열 Silver",
        "badge_condition": "팬싸인회 50% 이상 참석",
        "badge_detail": "멤버들과 아이컨택 과다! 심장에 무리가 올 수 있습니다.",
        "badge_logic_memo": "획득한 tags가 fansign >=10 and fansign=! 18",
        "badge_image_url": "/assets/badges/fansign-2.png"
    },
    {
        "badge_code": "fansign-3",
        "badge_name": "대화의 희열 Master",
        "badge_condition": "모든 팬싸인회 참석",
        "badge_detail": "멤버들과 아이컨택 과다! 심장에 무리가 올 수 있습니다.",
        "badge_logic_memo": "획득한 tags가 fansign=18",
        "badge_image_url": "/assets/badges/fansign-3.png"
    },
    {
        "badge_code": "overseas-1",
        "badge_name": "비행기 타고가요 Silver",
        "badge_condition": "해외 이벤트 1회 이상 참석",
        "badge_detail": "QWER을 만나러 바다 건너까지 갔다왔어요.",
        "badge_logic_memo": "획득한 tags가 overseas >=1",
        "badge_image_url": "/assets/badges/overseas-1.png"
    },
    {
        "badge_code": "overseas-2",
        "badge_name": "비행기 타고가요 Master",
        "badge_condition": "해외 이벤트 5회 이상 참석",
        "badge_detail": "여권 도장이 꽉 찼어요! 그 곳이 어디든 QWER만 있다면 !",
        "badge_logic_memo": "획득한 tags가 overseas >=5",
        "badge_image_url": "/assets/badges/overseas-2.png"
    },
    {
        "badge_code": "univ-1",
        "badge_name": "현직 대학생 Bronz",
        "badge_condition": "대학축제 1회 이상 참석",
        "badge_detail": "애니멀 싸운드 발사!!",
        "badge_logic_memo": "획득한 tags가 univ >=1",
        "badge_image_url": "/assets/badges/univ-1.png"
    },
    {
        "badge_code": "univ-2",
        "badge_name": "현직 대학생 Silver",
        "badge_condition": "대학축제 50% 이상 참석",
        "badge_detail": "애니멀 싸운드 발사!!",
        "badge_logic_memo": "획득한 tags가 univ >=6",
        "badge_image_url": "/assets/badges/univ-2.png"
    },
    {
        "badge_code": "univ-3",
        "badge_name": "현직 대학생 Master",
        "badge_condition": "모든 대학축제 참석",
        "badge_detail": "전국의 대학교 섭렵! 애니멀 싸운드 발사!!",
        "badge_logic_memo": "획득한 tags가 univ = 12",
        "badge_image_url": "/assets/badges/univ-3.png"
    },
    {
        "badge_code": "sanok",
        "badge_name": "200인의 전사",
        "badge_condition": "M Count Down 사녹 참석",
        "badge_detail": "저는 당신이 자랑스럽습니다.",
        "badge_logic_memo": "event_code = 2025-broad-mcount-1 이벤트 참석",
        "badge_image_url": "/assets/badges/sanok.png"
    },
    {
        "badge_code": "qbung",
        "badge_name": "큐붕큐붕?",
        "badge_condition": "큐붕버스 이벤트 1회 이상 참석",
        "badge_detail": "지금부터 니 이름은 큐식이여",
        "badge_logic_memo": "획득한 tags가 qbung >=1",
        "badge_image_url": "/assets/badges/qbung.png"
    },
    {
        "badge_code": "anni-1",
        "badge_name": "happy birthday!",
        "badge_condition": "모든 생일, 2주년 이벤트 카페 참석",
        "badge_detail": "기쁜 날엔 언제나 우리가 함께야!",
        "badge_logic_memo": "획득한 tags가 anniversary >=1",
        "badge_image_url": "/assets/badges/anni-1.png"
    },
    {
        "badge_code": "harsh",
        "badge_name": "비가오나 눈이오나",
        "badge_condition": "호우, 적설, 폭염 등 힘든 상황의 이벤트 참석",
        "badge_detail": "날씨 따위에 지지 않아!",
        "badge_logic_memo": "획득한 tags가 harsh >=1",
        "badge_image_url": "/assets/badges/harsh.png"
    },
    {
        "badge_code": "busking-1",
        "badge_name": "낭만의 큐떱카 Silver",
        "badge_condition": "국내 버스킹 이벤트 50% 이상 참석",
        "badge_detail": "QWER x 바위게 - 낭만 = 0",
        "badge_logic_memo": "획득한 tags가 busking >=2",
        "badge_image_url": "/assets/badges/busking-1.png"
    },
    {
        "badge_code": "busking-2",
        "badge_name": "낭만의 큐떱카 Master",
        "badge_condition": "모든 국내 버스킹 이벤트 참석",
        "badge_detail": "QWER x 바위게 - 낭만 = 0",
        "badge_logic_memo": "획득한 tags가 busking = 3",
        "badge_image_url": "/assets/badges/busking-2.png"
    },
    {
        "badge_code": "yulyul",
        "badge_name": "율율의 가호",
        "badge_condition": "추첨 이벤트 1회 이상 참석",
        "badge_detail": "율율의 가호가 함께합니다.",
        "badge_logic_memo": "획득한 tags가 draw >=1",
        "badge_image_url": "/assets/badges/yulyul.png"
    },
    {
        "badge_code": "qwer-1",
        "badge_name": "오프 뉴비",
        "badge_condition": "이벤트 10개 미만 참석",
        "badge_detail": "QWER을 만나는 재미를 알게되었어요",
        "badge_logic_memo": "참석한 이벤트가 1개 이상 10개 미만",
        "badge_image_url": "/assets/badges/qwer-1.png"
    },
    {
        "badge_code": "qwer-2",
        "badge_name": "오프 중수",
        "badge_condition": "이벤트 10개 이상 참석",
        "badge_detail": "덕질과 인생의 적절한 조화를 아는 당신",
        "badge_logic_memo": "참석한 이벤트가 10개 이상",
        "badge_image_url": "/assets/badges/qwer-2.png"
    },
    {
        "badge_code": "qwer-3",
        "badge_name": "오프 고인물",
        "badge_condition": "이벤트 50% 이상 참석",
        "badge_detail": "당신을 모르는 바위게가 있나요?",
        "badge_logic_memo": "참석한 이벤트가 50% 이상",
        "badge_image_url": "/assets/badges/qwer-3.png"
    }
];

console.log(`Starting reseed of badges table with ${badges.length} items...`);

db.serialize(() => {
    // 1. Delete all existing records
    db.run("DELETE FROM badges", (err) => {
        if (err) {
            console.error("Error deleting old badges:", err.message);
            return;
        }
        console.log("Deleted old badge data.");
    });

    // 2. Reset ID counter (optional but recommended)
    db.run("DELETE FROM sqlite_sequence WHERE name='badges'", (err) => {
        if (!err) console.log("Reset ID counter.");
    });

    // 3. Insert new records
    const stmt = db.prepare(`
        INSERT INTO badges (badge_code, badge_name, badge_condition, badge_detail, badge_logic_memo, badge_image_url) 
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    let successCount = 0;
    badges.forEach((b) => {
        stmt.run(b.badge_code, b.badge_name, b.badge_condition, b.badge_detail, b.badge_logic_memo, b.badge_image_url, function (err) {
            if (err) {
                console.error(`Error inserting ${b.badge_code}:`, err.message);
            } else {
                successCount++;
            }
        });
    });

    stmt.finalize(() => {
        console.log(`Reseed complete. Successfully inserted ${successCount}/${badges.length} badges.`);

        // 4. Verify count
        db.get("SELECT count(*) as count FROM badges", (err, row) => {
            if (err) console.error("Verify failed:", err);
            else console.log(`VERIFICATION: Current badge count is ${row.count}.`);
        });
    });
});
