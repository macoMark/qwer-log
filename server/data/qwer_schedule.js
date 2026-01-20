const events = [
    {
        date: '2025-01-25',
        title: "The 1st 팬콘서트 '1, 2, QWER!' 1일차",
        type: 'concert',
        event_code: '2025-fanconcert-1',
        tags: ['fancon', 'concert'],
        runtime: 120
    },
    {
        date: '2025-01-26',
        title: "The 1st 팬콘서트 '1, 2, QWER!' 2일차",
        type: 'concert',
        event_code: '2025-fanconcert-2',
        tags: ['fancon', 'concert'],
        runtime: 120
    },
    {
        date: '2025-01-26',
        title: '히나 생일 기념 카페 방문',
        type: 'anniversary',
        event_code: '2025-birthday-hina',
        tags: ['anniversary', 'hina'],
        runtime: 0
    },
    {
        date: '2025-02-02',
        title: '시연 니티드 팝업 부산 1차',
        type: 'individual',
        event_code: '2025-popup-siyeon-1',
        tags: ['popup', 'siyeon'],
        runtime: 40
    },
    {
        date: '2025-02-07',
        title: 'ON THE K',
        type: 'broadcast',
        event_code: '2025-onthek',
        tags: ['festival', 'draw'],
        runtime: 30
    },
    {
        date: '2025-02-15',
        title: '싱어미닛 결선 축하공연',
        type: 'sponsor',
        event_code: '2025-singa',
        tags: ['sponsor'],
        runtime: 15
    },
    {
        date: '2025-02-16',
        title: '히나 WMC 팝업 스타필드 수원',
        type: 'individual',
        event_code: '2025-popup-hina-1',
        tags: ['popup', 'hina'],
        runtime: 40
    },
    {
        date: '2025-02-22',
        title: '2025 디어워즈',
        type: 'awards',
        event_code: '2025-dawards',
        tags: ['awards', 'draw'],
        runtime: 0
    },
    {
        date: '2025-03-30',
        title: 'Kstyle Party 2025 Tokyo',
        type: 'overseas',
        event_code: '2025-Kstyle',
        tags: ['overseas', 'over_fest', 'japan'],
        runtime: 10
    },
    {
        date: '2025-04-06',
        title: "1, 2, QWER!' in Tokyo",
        type: 'overseas',
        event_code: '2025-fanconcert-tokyo-1',
        tags: ['overseas', 'over_fancon', 'over_con', 'japan'],
        runtime: 120
    },
    {
        date: '2025-04-07',
        title: '도쿄 팬싸인회',
        type: 'overseas',
        event_code: '2025-fansign-tokyo-1',
        tags: ['fansign', 'overseas', 'japan', 'over_fansign'],
        runtime: 0
    },
    {
        date: '2025-04-10',
        title: "1, 2, QWER!' in Osaka",
        type: 'overseas',
        event_code: '2025-fanconcert-osaka-1',
        tags: ['overseas', 'over_fancon', 'over_con', 'japan'],
        runtime: 120
    },
    {
        date: '2025-04-15',
        title: '버스킹 제천 의림지',
        type: 'busking',
        event_code: '2025-jecheon',
        tags: ['busking'],
        runtime: 60
    },
    {
        date: '2025-04-19',
        title: '버스킹 해남 산이정원',
        type: 'busking',
        event_code: '2025-haenam',
        tags: ['busking', 'qbung'],
        runtime: 60
    },
    {
        date: '2025-04-23',
        title: '버스킹 서울 노들섬 잔디마당',
        type: 'busking',
        event_code: '2025-nodeul',
        tags: ['busking'],
        runtime: 60
    },
    {
        date: '2025-04-26',
        title: 'Alan Walker with K-POP in Taipei',
        type: 'overseas',
        event_code: '2025-tapei-alen',
        tags: ['overseas', 'over_fest', 'taipei'],
        runtime: 40
    },
    {
        date: '2025-05-02',
        title: '버스킹 오사카',
        type: 'overseas',
        event_code: '2025-busking-osaka',
        tags: ['overseas', 'over_busking', 'japan', 'harsh'],
        runtime: 60
    },
    {
        date: '2025-05-10',
        title: 'KCON Japan artist stage',
        type: 'overseas',
        event_code: '2025-kcon-artist',
        tags: ['overseas', 'over_fest', 'japan'],
        runtime: 0
    },
    {
        date: '2025-05-12',
        title: '원광대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-wonkwang-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-13',
        title: '푸방 가디언스 시구 행사',
        type: 'overseas',
        event_code: '2025-tapei-pubon',
        tags: ['overseas'],
        runtime: 0
    },
    {
        date: '2025-05-14',
        title: "1, 2, QWER!' in Taipei",
        type: 'overseas',
        event_code: '2025-fanconcert-taipei-1',
        tags: ['overseas', 'over_fancon', 'over_con', 'taipei'],
        runtime: 120
    },
    {
        date: '2025-05-16',
        title: '한양대 공학인의 밤 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-hanyang-1',
        tags: ['univ', 'harsh'],
        runtime: 40
    },
    {
        date: '2025-05-16',
        title: '시연 생일 기념 카페 방문',
        type: 'anniversary',
        event_code: '2025-birthday-siyeon',
        tags: ['anniversary', 'siyeon'],
        runtime: 0
    },
    {
        date: '2025-05-17',
        title: '쵸단 1993 Studio 팝업 성수',
        type: 'individual',
        event_code: '2025-popup-chodan',
        tags: ['popup', 'chodan'],
        runtime: 40
    },
    {
        date: '2025-05-19',
        title: '대구대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-daegu-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-19',
        title: '동서대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-dongseo-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-20',
        title: '서울시립대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-silip-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-21',
        title: '선문대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-sunmoon-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-21',
        title: '청주대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-chungju-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-24',
        title: 'PUBG 특별 콘서트',
        type: 'sponsor',
        event_code: '2025-pubg-1',
        tags: ['sponsor', 'draw'],
        runtime: 50
    },
    {
        date: '2025-05-24',
        title: '고려대 입실렌티 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-korea-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-25',
        title: '시연 니티드 팝업 부산 2차',
        type: 'individual',
        event_code: '2025-popup-siyeon-2',
        tags: ['popup', 'siyeon'],
        runtime: 40
    },
    {
        date: '2025-05-27',
        title: '동의대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-dongeui-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-27',
        title: '인제대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-inje-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-29',
        title: '조선대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-chosun-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-05-29',
        title: '순천대 대학 축제',
        type: 'univ_festival',
        event_code: '2025-univ-sunchon-1',
        tags: ['univ'],
        runtime: 30
    },
    {
        date: '2025-06-01',
        title: 'Weverse Con Festival',
        type: 'festival',
        event_code: '2025-festival-weverse',
        tags: ['festival'],
        runtime: 40
    },
    {
        date: '2025-06-02',
        title: '마젠타 생일',
        type: 'anniversary',
        event_code: '2025-birthday-magenta',
        tags: ['anniversary', 'magenta'],
        runtime: 0
    },
    {
        date: '2025-06-09',
        title: "난 네편이야, 온 세상이 불협일지라도' Showcase",
        type: 'showcase',
        event_code: '2025-showcase-dear',
        tags: ['showcase', 'draw'],
        runtime: 90
    },
    {
        date: '2025-06-12',
        title: '부산 원아시아 페스티벌',
        type: 'festival',
        event_code: '2025-festival-busanoneaisa',
        tags: ['festival'],
        runtime: 40
    },
    {
        date: '2025-06-13',
        title: '뷰티풀 민트 라이프 2025',
        type: 'festival',
        event_code: '2025-festival-buminli',
        tags: ['festival'],
        runtime: 50
    },
    {
        date: '2025-06-14',
        title: '푸방 팝 뮤직 페스티벌 in Taipei',
        type: 'overseas',
        event_code: '2025-taipei-pubon-2',
        tags: ['overseas', 'over_fest', 'taipei'],
        runtime: 30
    },
    {
        date: '2025-06-19',
        title: 'M Count Down',
        type: 'broadcast',
        event_code: '2025-broad-mcount-1',
        tags: ['broadcast', 'draw'],
        runtime: 30
    },
    {
        date: '2025-06-21',
        title: '서울 가요 대상',
        type: 'awards',
        event_code: '2025-awards-seoul-1',
        tags: ['awards'],
        runtime: 10
    },
    {
        date: '2025-06-22',
        title: '케이팝스토어 팬사인회',
        type: 'fansign',
        event_code: '2025-fansign-kpop-1',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-06-27',
        title: '마젠타 아노블리어 팝업 성수',
        type: 'individual',
        event_code: '2025-popup-magenta-1',
        tags: ['popup', 'magenta'],
        runtime: 40
    },
    {
        date: '2025-06-28',
        title: '위버스 팬사인회',
        type: 'fansign',
        event_code: '2025-fansign-weverse-1',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-06-28',
        title: '디어마이뮤즈 팬사인회',
        type: 'fansign',
        event_code: '2025-fansign-muse-1',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-07-05',
        title: '더현대닷컴 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-hyundai-1',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-07-06',
        title: '디어마이뮤즈 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-muse-2',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-07-12',
        title: '비트로드 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-beat-1',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-07-13',
        title: '디어마이뮤즈 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-muse-3',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-07-19',
        title: '디어마이뮤즈 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-muse-4',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-07-19',
        title: '캐리비안베이 워터 뮤직 풀파티',
        type: 'festival',
        event_code: '2025-caribian',
        tags: ['festival', 'harsh'],
        runtime: 30
    },
    {
        date: '2025-07-20',
        title: '마이스타굿즈 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-star-1',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-07-26',
        title: '비트로드 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-beat-2',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-07-27',
        title: '디어마이뮤즈 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-muse-5',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-08-01',
        title: '2025 펜타포트 락페스티벌',
        type: 'festival',
        event_code: '2025-penta',
        tags: ['rockfest', 'harsh', 'festival'],
        runtime: 30
    },
    {
        date: '2025-08-02',
        title: '비트로드 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-beat-3',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-08-03',
        title: '디어마이뮤즈 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-muse-6',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-08-05',
        title: '울산 Summer Festival',
        type: 'festival',
        event_code: '2025-ulsansummer',
        tags: ['festival'],
        runtime: 40
    },
    {
        date: '2025-08-07',
        title: 'M Count Down in 보령',
        type: 'broadcast',
        event_code: '2025-borad-mcount-2',
        tags: ['broadcast', 'qbung', 'harsh'],
        runtime: 15
    },
    {
        date: '2025-08-09',
        title: '케이팝스토어 팬사인회',
        type: 'fansign',
        event_code: '2025-fansign-kpop-2',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-08-10',
        title: '디어마이뮤즈 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-muse-7',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-08-12',
        title: '마젠타 삼성라이온즈 시구',
        type: 'individual',
        event_code: '2025-sigu-magenta',
        tags: ['magenta'],
        runtime: 0
    },
    {
        date: '2025-08-16',
        title: '비트로드 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-beat-4',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-08-16',
        title: '7 Rock Prime',
        type: 'festival',
        event_code: '2025-7rock',
        tags: ['festival', 'rockfest'],
        runtime: 40
    },
    {
        date: '2025-08-17',
        title: '디어마이뮤즈 팬싸인회',
        type: 'fansign',
        event_code: '2025-fansign-muse-8',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-08-21',
        title: 'K World Dream Awards',
        type: 'awards',
        event_code: '2025-kworld',
        tags: ['awards'],
        runtime: 10
    },
    {
        date: '2025-08-23',
        title: '디어마이뮤즈 팬싸인회 (난네온불 막팬싸)',
        type: 'fansign',
        event_code: '2025-fansign-muse-9',
        tags: ['fansign'],
        runtime: 0
    },
    {
        date: '2025-09-26',
        title: '부산 국제 락페스티벌',
        type: 'festival',
        event_code: '2025-busanrock',
        tags: ['festival', 'rockfest'],
        runtime: 40
    },
    {
        date: '2025-09-27',
        title: 'PMPS Finals 축하 공연',
        type: 'sponsor',
        event_code: '2025-pmps',
        tags: ['sponsor'],
        runtime: 40
    },
    {
        date: '2025-09-28',
        title: 'Asia Top Artist Festival',
        type: 'festival',
        event_code: '2025-ata',
        tags: ['festival'],
        runtime: 40
    },
    {
        date: '2025-10-03',
        title: "1ST WORLD TOUR 'ROCKATION' 서울 1일차",
        type: 'concert',
        event_code: '2025-rockation-seoul-1',
        tags: ['concert', 'rockation'],
        runtime: 150
    },
    {
        date: '2025-10-03',
        title: "1ST WORLD TOUR 'ROCKATION' 서울 2일차",
        type: 'concert',
        event_code: '2025-rockation-seoul-2',
        tags: ['concert', 'rockation'],
        runtime: 150
    },
    {
        date: '2025-10-03',
        title: "1ST WORLD TOUR 'ROCKATION' 서울 3일차",
        type: 'concert',
        event_code: '2025-rockation-seoul-3',
        tags: ['concert', 'rockation'],
        runtime: 150
    },
    {
        date: '2025-10-18',
        title: 'QWER 데뷔 2주년 기념 카페 방문',
        type: 'anniversary',
        event_code: '2025-2ndanniversary',
        tags: ['anniversary'],
        runtime: 0
    },
    {
        date: '2025-10-19',
        title: 'Madly Medely',
        type: 'festival',
        event_code: '2025-madly',
        tags: ['festival'],
        runtime: 30
    },
    {
        date: '2025-10-25',
        title: 'TicTok Awards 2025',
        type: 'awards',
        event_code: '2025-tictok',
        tags: ['awards', 'draw'],
        runtime: 10
    },
    {
        date: '2025-10-31',
        title: 'Rockation in Brooklyn',
        type: 'concert',
        event_code: '2025-rockation-america-1',
        tags: ['overseas', 'over_con', 'over_rockation', 'america'],
        runtime: 120
    },
    {
        date: '2025-11-01',
        title: '쵸단 생일 기념 카페 방문',
        type: 'anniversary',
        event_code: '2025-birthday-chodan',
        tags: ['anniversary'],
        runtime: 0
    },
    {
        date: '2025-11-03',
        title: 'Rockation in Atlanta',
        type: 'concert',
        event_code: '2025-rockation-america-2',
        tags: ['overseas', 'over_con', 'over_rockation', 'america'],
        runtime: 120
    },
    {
        date: '2025-11-06',
        title: 'Rockation in Berwyn',
        type: 'concert',
        event_code: '2025-rockation-america-3',
        tags: ['overseas', 'over_con', 'over_rockation', 'america'],
        runtime: 120
    },
    {
        date: '2025-11-06',
        title: 'Rockation in Minneapolis',
        type: 'concert',
        event_code: '2025-rockation-america-4',
        tags: ['overseas', 'over_con', 'over_rockation', 'america'],
        runtime: 120
    },
    {
        date: '2025-11-12',
        title: 'Rockation in Fortworth',
        type: 'concert',
        event_code: '2025-rockation-america-5',
        tags: ['overseas', 'over_con', 'over_rockation', 'america'],
        runtime: 120
    },
    {
        date: '2025-11-13',
        title: 'Rockation in Hoston',
        type: 'concert',
        event_code: '2025-rockation-america-6',
        tags: ['overseas', 'over_con', 'over_rockation', 'america'],
        runtime: 120
    },
    {
        date: '2025-11-15',
        title: 'Rockation in San Francisco',
        type: 'concert',
        event_code: '2025-rockation-america-7',
        tags: ['overseas', 'over_con', 'over_rockation', 'america'],
        runtime: 120
    },
    {
        date: '2025-11-17',
        title: 'Rockation in LA',
        type: 'concert',
        event_code: '2025-rockation-america-8',
        tags: ['overseas', 'over_con', 'over_rockation', 'america'],
        runtime: 120
    },
    {
        date: '2025-12-06',
        title: 'Asia Artist Awards',
        type: 'overseas',
        event_code: '2025-aaa',
        tags: ['awards', 'overseas', 'taipei'],
        runtime: 10
    },
    {
        date: '2025-12-07',
        title: 'Acon 2025 Festa',
        type: 'overseas',
        event_code: '2025-acon',
        tags: ['overseas', 'over_fest'],
        runtime: 20
    },
    {
        date: '2025-12-13',
        title: '우리은행 우리틴틴 특별공연',
        type: 'sponsor',
        event_code: '2025-woori',
        tags: ['draw'],
        runtime: 40
    },
    {
        date: '2025-12-31',
        title: '2025 서울콘 x World K-pop Festival',
        type: 'festival',
        event_code: '2025-wkf',
        tags: ['festival'],
        runtime: 50
    }
];

module.exports = events;