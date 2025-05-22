import { useEffect, useState } from "react";
import "../css/Pages.css";
import rawRegionColors from "./korea_regions_colors.json";
import categoryColors from "./category_colors.json";
import DetailedPage from "./DetailedPage"

const FeedPage = () => {
interface Place {
  id: number;
  imageUrl: string;
  restaurant_name: string;
  category: string;
  region: string;
  mainMenu: string[];
  description: string;
  address: string;
  body: string;
  latitude: number;
  longitude: number;
  rate: number;
  source: string;
  status: string;
  bookmarked: boolean;
  visited: boolean;
  map_url: string;
  created_at: string;
  user_posts: {
    user_name: string;
    created_at: string;
    latitude: number;
    longitude: number;
  }[];
}

  // regionColors를 객체로 변환
const regionColors = Object.fromEntries(
  rawRegionColors.map(({ region, color }) => [region, color])
);

  //dummy data
  const placesData =[
    {
        id: 1,
        imageUrl:
          "https://cdn.imweb.me/upload/S2024013025a8a2a1c6644/13570ac6b056e.png",
        restaurant_name: "능동미나리 여의도점",
        category: "한식",
        region: "서울시 영등포구",
        mainMenu: ["미나리 수육 전골", "능동 육회비빔밥", "육전"],
        address: "서울 영등포구 의사당대로 127 롯데캐슬 엠파이어빌딩 1층 107호",
        body: "미나리가 듬뿍 들어간 수육전골과 육회비빔밥, 육전이 유명한 맛집. 술과 함께 즐기기 좋은 구성으로 여의도 직장인들의 저녁 술자리 성지로 떠오르는 중. 깔끔한 매장과 아기의자 구비, 테이블링 현장대기 시스템 운영. 국물이 점점 깊어지는 전골과 간장양념 육회비빔밥, 육전+비빔밥 조합이 환상적.",
        description: "미나리 수육 전골과 육회비빔밥, 육전이 인기인 여의도 직장인들의 술자리 성지.",
        latitude: 37.527265, // 여의도 롯데캐슬 엠파이어 좌표 (대략적)
        longitude: 126.92465,
        rate: 5,
        source: "https://blog.naver.com/wlgus3651/223570456098",
        status: "방문함",
        bookmarked: false,
        visited: false,
        map_url: "https://maps.app.goo.gl/moQBvBbAcm33HXmK9",
        created_at: "2024-09-03",
        user_posts: [
          {
            user_name: "혀언",
            created_at: "2024-09-03T11:05:00Z",
            latitude: 37.527265,
            longitude: 126.92465,
          },
        ],
      },
    
    {
      id: 2,
      imageUrl:
        "https://d12zq4w4guyljn.cloudfront.net/750_750_20250106052220_photo1_22dd42f297ce.webp",
      restaurant_name: "소바하우스 멘야준 연남점",
      category: "일식",
      region: "서울시 마포구",
      mainMenu: ["특선 소유라멘", "완탕", "흑돼지 슈마이"],
      description: "토핑의 퀄리티가 높은 라멘 맛집. 완탕과 슈마이가 특히 인기.",
      address: "서울 마포구 월드컵북로6길 84 1층",
      body: "서울 연남동 라멘 맛집. 토핑의 퀄리티가 어나더 레벨인 곳으로, 차슈와 완탕, 슈마이 등 토핑 하나하나가 고급 레스토랑 수준. 특히 특선 소유라멘의 다양한 부위 차슈와 완탕의 퀄리티가 압도적. 바 자리에서는 셰프가 라멘을 만드는 모습도 볼 수 있어 혼밥하기에도 부담 없음. 라멘 자체는 깔끔한 소유 베이스로 무난하지만, 토핑이 라멘의 전체 만족도를 극적으로 끌어올림.",
      latitude: 37.56125, // 대략적 위치 (연남동 월드컵북로6길 84 근처)
      longitude: 126.9228,
      rate: 5,
      source: "https://blog.naver.com/hyozzii/223567891234",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/r5zu2HxFhs6xKXHg6",
      created_at: "2025-05-03",
      user_posts: [
        {
          user_name: "효찌",
          created_at: "2025-05-03T13:28:00Z",
          latitude: 37.56125,
          longitude: 126.9228,
        },
      ],
    },
    {
      id: 3,
      imageUrl:
        "https://img.siksinhot.com/place/1640215450796032.jpeg",
        restaurant_name: "도넛정수 창신",
      category: "카페",
      region: "서울시 종로구",
      mainMenu: ["초코 바나나 도넛", "쑥 초코 도넛", "아메리카노"],
      description: "서울 절벽골목에서 서울 뷰와 함께 즐기는 수제 도넛 카페.",
      address: "서울 종로구 창신12길 40",
      body: "서울 창신동 절벽골목에 위치한 디저트 카페. 언덕 위에 자리잡아 남산, 낙산공원 등 서울 뷰가 탁 트인 공간에서 전국 각지 재료로 만든 8종 도넛과 커피, 음료를 즐길 수 있음. 초코 바나나 도넛과 쑥 초코 도넛이 특히 인기가 높음. 접근성이 높진 않지만 독특한 입지와 이색적인 공간으로 인스타그램 감성 카페로도 주목받는 곳. 주말엔 대기 필수.",
      latitude: 37.57481, // 대략적 위치 (창신12길 40 근처)
      longitude: 127.0173,
      rate: 4,
      source: "https://blog.naver.com/dareng__daily/223552612345",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/QdDYAFZfDF6EMbJr9",
      created_at: "2025-03-13",
      user_posts: [
        {
          user_name: "다랭",
          created_at: "2025-03-13T08:14:00Z",
          latitude: 37.57481,
          longitude: 127.0173,
        },
      ],
    },
    {
      id: 4,
      imageUrl: "https://blog.kakaocdn.net/dn/bfdTpz/btrDFKZBOKJ/QSI1BH8CfvFOjeuFqf7VQk/img.jpg",
        restaurant_name: "핫쵸 성수",
      category: "일식",
      region: "서울시 성동구",
      mainMenu: ["히로시마 오코노미야끼", "명란 크림 돈페야끼", "야끼소바"],
      description: "퍼포먼스 철판 요리가 볼거리인 성수 오코노미야끼 전문점.",
      address: "서울 성동구 왕십리로5길 9-20 1층",
      body: "서울숲 근처 성수동 오코노미야끼 전문점. 철판 요리 퍼포먼스와 세련된 인테리어가 돋보이는 핫플레이스. 히로시마 오코노미야끼는 숙주, 양배추, 삼겹, 새우, 소바면이 어우러진 시그니처 메뉴로 마요네즈와 타래소스 조합이 백미. 명란 크림 돈페야끼와 미니 샤브샤브도 인기. 좌석은 프라이빗한 테이블과 바 좌석이 있어 선택 가능하며, 평일 이외에는 웨이팅 필수.",
      latitude: 37.54463, // 대략적 위치 (왕십리로5길 9-20)
      longitude: 127.04412,
      rate: 4,
      source: "https://blog.naver.com/hotcho_seongsu/223470123456",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/Vf7oPmwJ8pZAKh3D8",
      created_at: "2024-05-31",
      user_posts: [
        {
          user_name: "열정과패기",
          created_at: "2024-05-31T01:13:00Z",
          latitude: 37.54463,
          longitude: 127.04412,
        },
      ],
    },
    {
      id: 5,
      imageUrl: "https://d12zq4w4guyljn.cloudfront.net/750_750_20240408075829_photo1_b0799598ca1c.webp",
        restaurant_name: "와일드플라워 방배",
      category: "양식",
      region: "서울시 서초구",
      mainMenu: ["트러플 들깨 궁채 파스타", "숨비소리 리조또", "레터링 서비스 디저트"],
      description: "감성 가득한 방배동 레스토랑. 레터링 디저트 서비스로 기념일 추천.",
      address: "서울 서초구 방배로 84 1층",
      body: "강남 서초 인근 방배동의 감성 레스토랑. 제철 재료를 활용한 창의적인 메뉴와 고급스러운 인테리어, 그리고 레터링 서비스로 유명한 곳. 트러플 들깨 궁채 파스타, 숨비소리 성게 리조또가 대표 메뉴. 레터링 서비스는 사전 예약 시 디저트에 원하는 문구를 무료로 제공하여 기념일에 딱. 직원들의 세심하고 빠른 응대와 넉넉한 좌석 간격 덕분에 데이트, 기념일, 가족 모임에도 적합.",
      latitude: 37.4845, // 대략적 위치 (방배로 84 근처)
      longitude: 126.9933,
      rate: 5,
      source: "https://blog.naver.com/yongyongham/223452678901",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/bmdR8wnmKquuWWrJA",
      created_at: "2024-12-26",
      user_posts: [
        {
          user_name: "용용햄",
          created_at: "2024-12-26T19:38:00Z",
          latitude: 37.4845,
          longitude: 126.9933,
        },
      ],
    },
    {
      id: 6,
      imageUrl: "https://mblogthumb-phinf.pstatic.net/MjAyMzEwMTZfMTUw/MDAxNjk3NDIzMjM4MzQ3.8Noyj6gr_uhPryMvUJldWbYuT3TP0RfgQ3Ljvd9VJ88g.cM0se-jk5J8mDcBOGogmtpNVXUZ2QQOGf_zCm5uads4g.JPEG.flak4121/IMG_9041.jpg?type=w800",
      restaurant_name: "카츠바이콘반 도산공원점",
      category: "일식",
      region: "서울시 강남구",
      mainMenu: ["상로스카츠", "미니 카레", "돈지루"],
      description: "두툼한 특등심 돈카츠와 향신료 진한 카레가 인기인 도산공원 돈카츠 맛집.",
      address: "서울 강남구 선릉로153길 36 1층",
      body: "서울 도산공원 근처 압구정로데오역 인근의 돈카츠 맛집. 두툼한 특등심 로스카츠와 부드러운 돈지루, 그리고 향신료 강한 미니 카레가 인기. 대기 많은 곳으로 혼밥러에게도 추천. 다소 기름이 덜 빠진 튀김옷은 호불호 갈릴 수 있으나 밥과 카레는 수준급.",
      latitude: 37.52442,
      longitude: 127.0352,
      rate: 4,
      source: "https://blog.naver.com/armi_/223470000001",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/7Pf6MniRm1tKEbQi8",
      created_at: "2025-04-10",
      user_posts: [
        {
          user_name: "아르미",
          created_at: "2025-04-10T10:18:00Z",
          latitude: 37.52442,
          longitude: 127.0352,
        },
      ],
    },
    {
      id: 7,
      imageUrl: "https://blog.kakaocdn.net/dn/B0jO4/btrSI9RAQ3k/Xwz65YNvR5zwOYbpNXx4p1/img.jpg",
      restaurant_name: "그라데이션커피 성수",
      category: "카페",
      region: "서울시 성동구",
      mainMenu: ["핸드드립 위스키 배럴", "코스타리카 하시엔다 코페이"],
      description: "위스키 배럴 숙성 원두가 시그니처인 핸드드립 전문 카페.",
      address: "서울 성동구 상원12길 24-1 1층",
      body: "성수의 핸드드립 커피 전문 카페. 위스키 배럴 숙성 원두가 시그니처로 위스키 향이 나는 독특한 커피. 핸드드립 과정을 직접 볼 수 있으며 원두 시향 서비스도 제공. 평일 한정 블랙커피도 인기지만 주말엔 핸드드립 추천.",
      latitude: 37.54496,
      longitude: 127.05688,
      rate: 5,
      source: "https://blog.naver.com/charlotte/223450987654",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/UzQ5wZWd2GxX9kPC6",
      created_at: "2024-08-18",
      user_posts: [
        {
          user_name: "샬롯",
          created_at: "2024-08-18T18:42:00Z",
          latitude: 37.54496,
          longitude: 127.05688,
        },
      ],
    },
    {
      id: 8,
      imageUrl: "https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/3fy/image/OUgALVYv5pBILsEFofbmJsxevOw.jpg",
      restaurant_name: "코끼리베이글 인사동",
      category: "카페",
      region: "서울시 종로구",
      mainMenu: ["버터 솔트 베이글", "아메리카노"],
      description: "화덕에 구운 쫀득 담백한 베이글이 인기인 인사동 베이글 맛집.",
      address: "서울 종로구 인사동길 35-3",
      body: "인사동 베이글 전문점. 화덕에 구워 쫀득 담백한 베이글이 인기이며 서울 3대 베이글 맛집으로 불림. 다양한 베이글과 샌드위치 제공하며, 3층까지 여유로운 공간. 런던베이글보다 한산해 빠르게 즐기기 좋음.",
      latitude: 37.57253,
      longitude: 126.9868,
      rate: 5,
      source: "https://blog.naver.com/yoontea/223570001234",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/v9s5TiTUKkDnU6f28",
      created_at: "2025-05-14",
      user_posts: [
        {
          user_name: "윤티",
          created_at: "2025-05-14T16:30:00Z",
          latitude: 37.57253,
          longitude: 126.9868,
        },
      ],
    },
    {
      id: 9,
      imageUrl: "https://mblogthumb-phinf.pstatic.net/MjAyMzA4MjlfMSAg/MDAxNjkzMjQ1NDY2Njkz.YsBR2X50Px7fiUmwMjstUXtvp5JU4_P5oFsjLior_gsg.oBFdNtq7P9V4D1OhJylZqQ7NenR8XG-SRZIeHvGYqDMg.JPEG.kimsy9591/IMG_8510.jpg?type=w800",
      restaurant_name: "호수식당 문의",
      category: "한식",
      region: "청주시",
      mainMenu: ["청국장", "순두부찌개", "비지찌개"],
      description: "청국장과 돌솥밥, 누룽지로 유명한 청주 문의 맛집.",
      address: "충청북도 청주시 상당구 문의면 문의시내로 22",
      body: "청주 문의 청국장 전문점. 돌솥밥과 누룽지, 슴슴한 청국장과 매콤한 고추무침으로 유명. 향이 강하지 않아 누구나 즐기기 좋으며 쌉싸름한 나물과 찬들도 정갈. 식사 후 식당 앞 두릅 구매 추천.",
      latitude: 36.51924,
      longitude: 127.50767,
      rate: 4,
      source: "https://blog.naver.com/polmam/223490654321",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/zLdVq6Mv74PzMdAC9",
      created_at: "2025-04-24",
      user_posts: [
        {
          user_name: "폴맘",
          created_at: "2025-04-24T07:49:00Z",
          latitude: 36.51924,
          longitude: 127.50767,
        },
      ],
    },
    {
      id: 10,
      imageUrl: "https://img.siksinhot.com/place/1443970776790487.jpg?w=560&h=448&c=Y",
      restaurant_name: "안성댁부대찌개 대전",
      category: "한식",
      region: "대전시 유성구",
      mainMenu: ["부대찌개", "삼겹살"],
      description: "깔끔한 국물이 매력적인 대전 현지인 부대찌개 맛집.",
      address: "대전 유성구 북유성대로 391",
      body: "대전 반석동 현지인 추천 부대찌개 맛집. 텁텁하지 않고 깔끔한 국물이 특징이며 라면사리 필수. 햄, 다진고기, 김치 조합으로 은은한 부대찌개 맛. 육수 추가는 셀프. 좌식 룸과 넓은 주차장 보유.",
      latitude: 36.39088,
      longitude: 127.2985,
      rate: 4,
      source: "https://blog.naver.com/gguldaeng/223430123456",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/qtdKYyoQ2D8nYksY9",
      created_at: "2025-02-17",
      user_posts: [
        {
          user_name: "꿀댕이",
          created_at: "2025-02-17T23:13:00Z",
          latitude: 36.39088,
          longitude: 127.2985,
        },
      ],
    },
    {
      id: 11,
      imageUrl: "https://mblogthumb-phinf.pstatic.net/MjAyMzA0MjZfMTU5/MDAxNjgyNDM5MjU1MzQ1.R0DPhaxUT2BI9CQRNummin7J8cb5uQVCc17Z9I_m8Nkg.Q_i1hxJRVXmdXBPXlyipsGr7HH3x1OJJZVB54IqOrIQg.JPEG.queen7165/IMG_8597.jpg?type=w800",
      restaurant_name: "프루 Fru",
      category: "술집",
      region: "서울시 종로구",
      mainMenu: ["모둠 사시미", "매콤 파스타", "참치 후토마키"],
      description: "일본 감성의 다찌 이자카야. 사시미와 명란 계란말이가 인기이며 시티팝 분위기 물씬.",
      address: "서울 종로구 북촌로5길 10",
      body: "안국역 근처에 위치한 일본 감성의 이자카야. 아담한 다찌바 스타일로 분위기와 음악이 독특하며 사시미와 명란치즈 계란말이가 인기. 시티팝 감성과 잘 어울리는 공간으로 웨이팅이 자주 발생하며 최대 2시간 30분 이용 가능.",
      latitude: 37.57994,
      longitude: 126.98411,
      rate: 5,
      source: "https://blog.naver.com/jangjorimzzang/223430999999",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/ybhXXcfbsBuPfTBe6",
      created_at: "2025-02-21",
      user_posts: [
        {
          user_name: "장조림짱",
          created_at: "2025-02-21T15:44:00Z",
          latitude: 37.57994,
          longitude: 126.98411,
        },
      ],
    },
    {
      id: 12,
      imageUrl: "https://design.co.kr/wp-content/uploads/2024/07/%EC%B0%A8%EC%B0%A8%EC%9D%B4%ED%85%8C_%EB%B3%B8%EC%B0%A8-%ED%8C%8C%EB%A5%B4%ED%8E%98-832x1109.jpg",
      restaurant_name: "차차이테",
      category: "카페",
      region: "서울시 용산구",
      mainMenu: ["맞이차", "본차+과자", "밀크티+스콘"],
      description: "차와 과자를 코스로 즐기는 한남동 예약제 티룸. 분위기 좋은 디저트 공간.",
      address: "서울 용산구 이태원로54길 74 2층",
      body: "한남동 티코스 전문점. 맞이차, 본차, 마무리차 구성으로 차와 디저트를 코스로 즐길 수 있는 예약제 티룸. 분위기 있는 공간과 정갈한 차과자 페어링으로 연인, 선물용 방문에 제격.",
      latitude: 37.53795,
      longitude: 127.00158,
      rate: 5,
      source: "https://blog.naver.com/chaejin/223456789876",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/kpUb1DCUZJYqRtMG8",
      created_at: "2025-03-09",
      user_posts: [
        {
          user_name: "채진",
          created_at: "2025-03-09T20:41:00Z",
          latitude: 37.53795,
          longitude: 127.00158,
        },
      ],
    },
    {
      id: 13,
      imageUrl: "https://d12zq4w4guyljn.cloudfront.net/750_750_20250218121009125_photo_8de4c3974a4b.webp",
      restaurant_name: "금제",
      category: "일식",
      region: "서울시 관악구",
      mainMenu: ["특로스가츠", "히레가츠", "가츠산도"],
      description: "저온 조리로 튀긴 프리미엄 로스가츠가 인기인 신림 돈카츠 맛집.",
      address: "서울 관악구 조원로 101 1층",
      body: "신림동 프리미엄 돈카츠 맛집. 저온조리한 가브리살 특로스가츠가 인기. 작고 조용한 바테이블형 일본식 식당으로, 혼밥이나 데이트 모두 가능. 트러플오일, 소금, 와사비와 함께 먹는 게 포인트.",
      latitude: 37.48132,
      longitude: 126.91851,
      rate: 5,
      source: "https://blog.naver.com/royalmilktea/223478901234",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/zjLZQpKb3FyDvU7bA",
      created_at: "2025-03-20",
      user_posts: [
        {
          user_name: "로얄밀크티",
          created_at: "2025-03-20T15:48:00Z",
          latitude: 37.48132,
          longitude: 126.91851,
        },
      ],
    },
    {
      id: 14,
      imageUrl: "https://dw82ptradz9jo.cloudfront.net/space/0DA35076-8B4C-4394-A735-FB2609655848/story/602a3043bf00be3ceaf9b90a/25ec3b91-168f-4de9-b341-b6cc89b27330",
      restaurant_name: "아우트로 커피",
      category: "카페",
      region: "청주시",
      mainMenu: ["아메리카노", "레몬소르베 음료", "베이커리"],
      description: "청주 외곽 불멍 가능한 대형 카페. 감성 좌석과 사진 맛집으로 인기.",
      address: "충북 청주시 상당구 낭성면 산성로 676",
      body: "청주 외곽에 위치한 대형카페. 넓은 공간과 불멍 가능한 창가 좌석, 다양한 커피와 디저트가 인기. 산책 겸 나들이 장소로 적합하며 포토존이 많아 사진 찍는 재미도 있음.",
      latitude: 36.6745,
      longitude: 127.6034,
      rate: 4,
      source: "https://blog.naver.com/hongi/223480000123",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/HvhsBLy2U9SyNpD16",
      created_at: "2025-04-24",
      user_posts: [
        {
          user_name: "홍이",
          created_at: "2025-04-24T20:40:00Z",
          latitude: 36.6745,
          longitude: 127.6034,
        },
      ],
    },
    {
      id: 15,
      imageUrl: "https://blog.kakaocdn.net/dn/HPbck/btsHVEtlXj4/xO7t7Gkha8PzUdkJZLr2xk/img.jpg",
      restaurant_name: "새말해장국 본점",
      category: "한식",
      region: "오산시",
      mainMenu: ["우거지갈비탕", "얼큰내장탕", "해장국"],
      description: "오산 3대 해장국 맛집. 돌솥밥과 함께 먹는 진한 국물 해장국으로 인기.",
      address: "경기도 오산시 현충로 95",
      body: "오산 3대 해장국 맛집으로 꼽히는 지역 명소. 돌솥밥에 곁들여 먹는 우거지갈비탕과 얼큰내장탕이 인기. 내부는 다소 올드하지만 국밥 마니아들 사이에서 꾸준한 사랑을 받는 곳. 김치와 밑반찬의 맛도 수준급이며, 푸짐한 양과 진한 국물 맛이 특징. 점심시간에는 대기 가능.",
      latitude: 37.15222,
      longitude: 127.07531,
      rate: 4,
      source: "https://blog.naver.com/ingfoodie/223489000999",
      status: "방문함",
      bookmarked: false,
      visited: false,
      map_url: "https://maps.app.goo.gl/Z7LDtfqKxEDh62zC6",
      created_at: "2025-03-31",
      user_posts: [
        {
          user_name: "아이엔지",
          created_at: "2025-03-31T22:01:00Z",
          latitude: 37.15222,
          longitude: 127.07531,
        },
      ],
    }
    ];

  const [placesData1, setPlacesData] = useState<Place[]>([]); // BE 에서 데이터 받아오기
  const [visibleCount, setVisibleCount] = useState(10); // 현재 브라우저에 보여줄 카드의 수

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const [selectCategory, setSelectedCategory] = useState("전체"); //선택된 카테고리 - filter 용
  const [selectRegion, setSelectedRegion] = useState("전체"); // 선택된 region - filter 용

  const categoryList = ["전체", ...Object.keys(categoryColors)];
  const regionList = ["전체", ...Object.keys(regionColors)];
  
  //카테고리 선택 시 백엔드에서 데이터 fetch
  useEffect(() => {
    const url = "http://localhost:8080/api/places"; //url 바꾸기
    let query = "";
    const fetchPlaces = async () => {
      try {
        if (selectCategory !== "전체" && selectRegion !== "전체") {
          query = `?category=${encodeURIComponent(
            selectCategory
          )}&region=${encodeURIComponent(selectRegion)}`;
        } else if (selectCategory !== "전체" && selectRegion === "전체") {
          query = `?category=${encodeURIComponent(selectCategory)}}`;
        } else if (selectCategory === "전체" && selectRegion !== "전체") {
          query = `?region=${encodeURIComponent(selectRegion)}`;
        } 
        const res = await fetch(url + query);
        const data = await res.json();
        setPlacesData(data);
        setVisibleCount(10);
      } catch (err) {
        console.error("Failed to load the data", err);
      }
    };
    fetchPlaces();
  }, [selectCategory, selectRegion]);

  // 처음에 10개 먼저 로딩, 스크롤을 더 해 브라우저의 끝에 다다를시 해 5개씩 더 로딩하기
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        setVisibleCount((prev) => prev + 5);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  //방문 & 북마크 토글 기능 구현
  const toggleVisited = async (id: number) => {
    setPlacesData((prevPlaces) =>
      prevPlaces.map((place) =>
        place.id === id ? { ...place, visited: !place.visited } : place
      )
    );
    setSelectedPlace((prev) =>
      prev && prev.id === id ? { ...prev, visited: !prev.visited } : prev
    );

    const updatedVisited = !selectedPlace?.visited;
    const url = "http://localhost:8080/api/places/" //url 바꿔야함
    try {
      await fetch(url + id + "/visited", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visited: updatedVisited }),
      });
    } catch (err) {
      console.error("방문 상태 업데이트 실패", err);
    }
  };
  const toggleBookmarked = async (id: number) => {
    setPlacesData((prevPlaces) =>
      prevPlaces.map((place) =>
        place.id === id ? { ...place, bookmarked: !place.bookmarked } : place
      )
    );
    setSelectedPlace((prev) =>
      prev && prev.id === id ? { ...prev, bookmarked: !prev.bookmarked } : prev
    );
    const updatedBookmarked = !selectedPlace?.bookmarked;
    const url = "http://localhost:8080/api/places/" //url 바꿔야함
    try {
      await fetch(url + id + "/bookmarked", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visited: updatedBookmarked }),
      });
    } catch (err) {
      console.error("즐겨찾기 상태 업데이트 실패", err);
    }
  };


  // selectedPlace가 존재할 경우 DetailedPage 컴포넌트를 렌더링하고, 없을 경우 기본 카드 리스트를 보여준다
  return selectedPlace ? (
    <div className="relative">
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-10" />
      <div className="relative z-20">
      <DetailedPage
          place={selectedPlace}
          onBack={() => setSelectedPlace(null)}
          onToggleVisited={() => toggleVisited(selectedPlace.id)}
          onToggleBookmarked={() => toggleBookmarked(selectedPlace.id)}
        />
      </div>
    </div>
  ) : (
    // 카드 리스트 및 필터 UI (카테고리/지역 드롭다운 포함)
    <div className="container mx-auto mt-4 px-4">
      {/* 검색 필드*/}
      <div className="flex justify-center my-4">
          <form 
          className="flex items-center gap-2"
          onSubmit={(e)=>{
            e.preventDefault();
            const keyword = (e.currentTarget.elements.namedItem("searchInput") as HTMLInputElement).value;
            const url = "http://localhost:8080/api/places" // url 바꾸기
            let query = `?search=${encodeURIComponent(keyword)}`;
            fetch(url + query)
            .then((res)=> res.json())
            .then((data) => {
              setPlacesData(data);
              setVisibleCount(10);
            })
            .catch((err) => console.error("검색 실패", err));
          }}
          >
            
            <input
              type="text"
              id="searchInput"
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="검색어 입력"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              검색
            </button>
          </form>
        </div>
      {/* 드롭다운 */}
      <div className="mb-4">
        <label htmlFor="categorySelect" className="mr-2 font-semibold">
          카테고리:
        </label>
        <select
          id="categorySelect"
          className="w-auto inline-block border border-gray-300 rounded px-2 py-1"
          value={selectCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categoryList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label htmlFor="regionSelect" className="mr-2 font-semibold ml-3">
          지역:
        </label>
        <select
          id="regionSelect"
          className="w-auto inline-block border border-gray-300 rounded px-2 py-1"
          value={selectRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {regionList.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      {/* 카드 리스트 */}
      <div className="flex flex-wrap">
        {placesData.slice(0, visibleCount).map((place, index) => (
          <div
            key={index}
            className="m-2 text-left border rounded shadow"
            style={{
              width: "18%",
              minWidth: "200px",
              padding: "0.4rem",
            }}
            onClick={()=>setSelectedPlace(place)}
          >
            <div className="relative">
              <img
                src={place.imageUrl}
                className="w-full h-40 object-cover rounded"
                alt={place.restaurant_name}
              />
              {place.bookmarked && (
                <span
                  className="absolute top-0 right-0 p-2"
                  style={{ fontSize: "1.5rem", color: "gold" }}
                >
                  ★
                </span>
              )}
            </div>
            <div className="p-2 flex flex-col gap-2">
              <div className="font-bold text-lg">{place.restaurant_name}</div>
              <span
                className="inline-block px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: categoryColors[place.category] || "#ccc",
                  color: "#fff",
                  border: `1px solid ${
                    categoryColors[place.category] || "#ccc"
                  }`,
                }}
              >
                {place.category}
              </span>
              <span
                className="inline-block px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: regionColors[place.region] || "#ccc",
                  color: "#fff",
                  border: `1px solid ${regionColors[place.region] || "#ccc"}`,
                }}
              >
                {place.region}
              </span>
              <div className="text-sm">대표 메뉴: {place.mainMenu.join(", ")}</div>
              <div className="text-sm text-gray-500">내용: {place.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeedPage;
