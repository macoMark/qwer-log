/**
 * 유저의 뱃지 획득 여부를 계산하는 함수
 * @param {Array} userAttendance - 유저가 참석한 이벤트 목록 (Joined with events)
 * @param {Array} allBadges - DB에 정의된 모든 뱃지 목록
 * @param {Array} allEvents - 해당 연도의 전체 이벤트 목록 (참석 여부 무관)
 */
const calculateUserBadges = (userAttendance, allBadges, allEvents) => {
    // 0. 데이터 전처리
    // 태그 파싱 (DB에는 JSON string으로 저장됨)
    const parseTags = (tags) => {
        try {
            return typeof tags === 'string' ? JSON.parse(tags) : (tags || []);
        } catch (e) {
            return [];
        }
    };

    const attendedEvents = userAttendance.map(e => ({
        ...e,
        tags: parseTags(e.tags)
    }));

    // 전체 이벤트도 태그 파싱 필요
    const yearEvents = allEvents.map(e => ({
        ...e,
        tags: parseTags(e.tags)
    }));

    const attendedTags = attendedEvents.flatMap(e => e.tags || []);
    const attendedTypes = attendedEvents.map(e => e.type);
    const attendedCodes = attendedEvents.map(e => e.event_code);

    // 태그별 횟수 카운트
    const counts = {
        fancon: attendedTags.filter(t => t === 'fancon').length,
        rockation: attendedTags.filter(t => t === 'rockation').length,
        rockfest: attendedTags.filter(t => t === 'rockfest').length,
        festival: attendedTags.filter(t => t === 'festival').length,
        fansign: attendedTags.filter(t => t === 'fansign').length,
        overseas: attendedTags.filter(t => t === 'overseas').length,
        univ: attendedTags.filter(t => t === 'univ').length,
        qbung: attendedTags.filter(t => t === 'qbung').length,
        anniversary: attendedTags.filter(t => t === 'anniversary').length,
        harsh: attendedTags.filter(t => t === 'harsh').length,
        busking: attendedTags.filter(t => t === 'busking').length,
        draw: attendedTags.filter(t => t === 'draw').length,
        sanok: attendedTags.filter(t => t === 'sanok').length,
    };

    let earnedCandidateCodes = [];

    // --- [1. 단일 조건 뱃지 로직] ---

    // qwermaster: 출석률 90% 이상 (type이 fansign 또는 overseas인 경우 제외)
    // 분모: 전체 이벤트 중 fansign/overseas 제외
    const filteredAll = yearEvents.filter(e => e.type !== 'fansign' && e.type !== 'overseas');
    // 분자: 참석한 이벤트 중 fansign/overseas 제외
    const filteredAttended = attendedEvents.filter(e => e.type !== 'fansign' && e.type !== 'overseas');

    if (filteredAll.length > 0 && (filteredAttended.length / filteredAll.length) * 100 >= 90) {
        earnedCandidateCodes.push('qwermaster');
    }

    // grandslam: 주요 5개 타입 모두 1회 이상 (concert, univ_festival, festival, awards, sponsor)
    const mainTypes = ['concert', 'univ_festival', 'festival', 'awards', 'sponsor'];
    if (mainTypes.every(type => attendedTypes.includes(type))) {
        earnedCandidateCodes.push('grandslam');
    }

    // attendance-award: 활동 월 모두 출석 (3월, 11월 제외한 1,2,4,5,6,7,8,9,10,12월)
    const attendedMonths = [...new Set(attendedEvents.map(e => new Date(e.date).getMonth() + 1))];
    const targetMonths = [1, 2, 4, 5, 6, 7, 8, 9, 10, 12];
    if (targetMonths.every(m => attendedMonths.includes(m))) {
        earnedCandidateCodes.push('attendance-award');
    }

    // 콘서트/락페 관련
    if (counts.fancon >= 1 && counts.rockation >= 1) earnedCandidateCodes.push('concert-master');
    if (counts.fancon >= 2) earnedCandidateCodes.push('fancon-all');
    if (counts.rockation >= 3) earnedCandidateCodes.push('rockation-all');
    if (counts.fancon >= 2 && counts.rockation >= 3) earnedCandidateCodes.push('concert-all');
    if (counts.rockfest === 3) earnedCandidateCodes.push('rockneverdie');

    // 특정 이벤트/태그 기반
    if (counts.sanok >= 1) earnedCandidateCodes.push('sanok');
    if (counts.qbung >= 1) earnedCandidateCodes.push('qbung');

    // Anniversary Badge Logic
    if (counts.anniversary >= 4) earnedCandidateCodes.push('anni-all');
    else if (counts.anniversary >= 2) earnedCandidateCodes.push('anni-half');

    if (counts.harsh >= 1) earnedCandidateCodes.push('harsh');
    if (counts.draw >= 1) earnedCandidateCodes.push('yulyul');

    // --- [2. 레벨형 뱃지 로직 (최고 단계 판별용)] ---

    // 파티피플
    if (counts.festival === 12) earnedCandidateCodes.push('party-all');
    else if (counts.festival >= 6) earnedCandidateCodes.push('party-half');

    // 대화의 희열
    if (counts.fansign >= 18) earnedCandidateCodes.push('fansign-all');
    else if (counts.fansign >= 10) earnedCandidateCodes.push('fansign-half');
    else if (counts.fansign >= 1) earnedCandidateCodes.push('fansign-1');

    // 비행기 타고가요
    if (counts.overseas >= 5) earnedCandidateCodes.push('overseas-5');
    else if (counts.overseas >= 1) earnedCandidateCodes.push('overseas-1');

    // 현직 대학생
    if (counts.univ === 12) earnedCandidateCodes.push('univ-all');
    else if (counts.univ >= 6) earnedCandidateCodes.push('univ-half');
    else if (counts.univ >= 1) earnedCandidateCodes.push('univ-1');

    // 낭만의 큐떱카
    if (counts.busking === 3) earnedCandidateCodes.push('busking-all');
    if (counts.busking >= 1) earnedCandidateCodes.push('busking-1');

    // 오프라인 등급 (QWER)
    // qwer-3: 이벤트 50% 이상 참석
    const totalEvents = yearEvents.length;
    const attendedCount = attendedEvents.length;
    const attendanceRate = totalEvents > 0 ? (attendedCount / totalEvents) : 0;

    if (attendanceRate >= 0.5) earnedCandidateCodes.push('qwer-30');
    else if (attendedCount >= 10) earnedCandidateCodes.push('qwer-10');
    else if (attendedCount >= 1) earnedCandidateCodes.push('qwer-1');


    // --- [3. 최종 필터링: 동일 그룹 내 최고 레벨만 유지] ---
    const earnedCodesSet = new Set(earnedCandidateCodes);

    // 결과 매핑: 모든 뱃지 리스트를 순회하며 is_earned 설정
    // 단, 여기서 상위 레벨 뱃지가 있으면 하위 레벨은 is_earned = false여야 함.
    // 사용자가 제공한 로직은 earnedCandidateCodes를 필터링해서 최종 목록을 만듦.

    // 먼저 earnedCandidateCodes를 정제
    const finalEarnedCodes = earnedCandidateCodes.filter((code, index, self) => {
        // 코드가 'name-숫자', 'name-half', 'name-all' 형식인지 확인
        const parts = code.split('-');
        if (parts.length < 2) return true; // 형식이 안맞으면 유지

        const lastPart = parts[parts.length - 1];
        const baseCode = parts.slice(0, -1).join('-');

        // 현재 뱃지의 레벨 계산
        let level = 0;
        if (lastPart === 'all') level = 9999;
        else if (lastPart === 'half') level = 50; // half는 중간 단계 (숫자 1,2 등보다 높다고 가정하거나 1<half<all)
        // 주의: fansign-1 (1) < fansign-half (50) < fansign-all (9999). 적절함.
        else {
            const parsed = parseInt(lastPart);
            if (!isNaN(parsed)) level = parsed;
            else return true; // 숫자가 아니고 all/half도 아니면 유지
        }

        // 같은 baseCode를 가진 다른 뱃지들 중 더 높은 레벨이 있는지 확인
        const hasHigherLevel = self.some(otherCode => {
            const otherParts = otherCode.split('-');
            const otherLastPart = otherParts[otherParts.length - 1];
            const otherBase = otherParts.slice(0, -1).join('-');

            if (baseCode !== otherBase) return false;

            let otherLevel = 0;
            if (otherLastPart === 'all') otherLevel = 9999;
            else if (otherLastPart === 'half') otherLevel = 50;
            else {
                const p = parseInt(otherLastPart);
                if (!isNaN(p)) otherLevel = p;
                else return 0;
            }

            // baseCode가 같고, 레벨이 더 높은 것이 존재하면 탈락
            return otherLevel > level;
        });

        return !hasHigherLevel;
    });

    const finalEarnedSet = new Set(finalEarnedCodes);

    return allBadges.map(badge => ({
        ...badge,
        is_earned: finalEarnedSet.has(badge.badge_code),
        earned_date: null
    }));
};

module.exports = { calculateUserBadges };
