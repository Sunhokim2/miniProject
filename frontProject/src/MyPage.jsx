import regionColors from "./korea_regions_colors.json";

const MyPage = () => {
  //dummy data
  const placesData = [
    {
      imageUrl:
        "https://image.tabling.co.kr/production/menu/fcc8ef2e-4a50-4fed-802c-c9d61e0a2fe8.jpeg",
      restaurant: "능동미나리 여의도점",
      category: "음식점",
      region: "영등포구",
      main_menu: "미나리 수육 전골, 능동 육회비빔밥, 육전",
      description:
        "미나리 수육 전골과 육회비빔밥, 육전이 인기인 여의도 직장인들의 술자리 성지.",
    },
    {
      imageUrl:
        "https://d12zq4w4guyljn.cloudfront.net/750_750_20250106052220_photo1_22dd42f297ce.webp",
      restaurant: "소바하우스 멘야준 연남점",
      category: "음식점",
      region: "마포구",
      main_menu: "특선 소유라멘, 완탕, 흑돼지 슈마이",
      description: "토핑의 퀄리티가 높은 라멘 맛집. 완탕과 슈마이가 특히 인기.",
    },
    {
      imageUrl: "https://img.siksinhot.com/place/1640215450796032.jpeg",
      restaurant: "도넛정수 창신",
      category: "카페",
      region: "종로구",
      main_menu: "초코 바나나 도넛, 쑥 초코 도넛, 아메리카노, 바닐라라떼",
      description: "서울 절벽골목에서 서울 뷰와 함께 즐기는 수제 도넛 카페.",
    },
    {
      imageUrl:
        "https://blog.kakaocdn.net/dn/bfdTpz/btrDFKZBOKJ/QSI1BH8CfvFOjeuFqf7VQk/img.jpg",
      restaurant: "핫쵸 성수",
      category: "음식점",
      region: "성동구",
      main_menu: "히로시마 오코노미야끼, 명란 크림 돈페야끼, 야끼소바",
      description: "퍼포먼스 철판 요리가 볼거리인 성수 오코노미야끼 전문점.",
    },
    {
      imageUrl:
        "https://d12zq4w4guyljn.cloudfront.net/750_750_20240408075829_photo1_b0799598ca1c.webp",
      restaurant: "와일드플라워 방배",
      category: "음식점",
      region: "서초구",
      main_menu:
        "트러플 들깨 궁채 파스타, 숨비소리 리조또, 레터링 서비스 디저트",
      description:
        "감성 가득한 방배동 레스토랑. 레터링 디저트 서비스로 기념일 추천.",
    },
    {
      imageUrl:
        "https://mblogthumb-phinf.pstatic.net/MjAyMzEwMTZfMTUw/MDAxNjk3NDIzMjM4MzQ3.8Noyj6gr_uhPryMvUJldWbYuT3TP0RfgQ3Ljvd9VJ88g.cM0se-jk5J8mDcBOGogmtpNVXUZ2QQOGf_zCm5uads4g.JPEG.flak4121/IMG_9041.jpg?type=w800",
      restaurant: "카츠바이콘반 도산공원점",
      category: "음식점",
      region: "강남구",
      main_menu: "상로스카츠, 미니 카레, 돈지루",
      description:
        "두툼한 특등심 돈카츠와 향신료 진한 카레가 인기인 도산공원 돈카츠 맛집.",
    },
    {
      imageUrl:
        "https://blog.kakaocdn.net/dn/B0jO4/btrSI9RAQ3k/Xwz65YNvR5zwOYbpNXx4p1/img.jpg",
      restaurant: "그라데이션커피 성수",
      category: "카페",
      region: "성동구",
      main_menu: "핸드드립 위스키 배럴, 코스타리카 하시엔다 코페이",
      description: "위스키 배럴 숙성 원두가 시그니처인 핸드드립 전문 카페.",
    },
    {
      imageUrl:
        "https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/3fy/image/OUgALVYv5pBILsEFofbmJsxevOw.jpg",
      restaurant: "코끼리베이글 인사동",
      category: "카페",
      region: "종로구",
      main_menu: "버터 솔트 베이글, 아메리카노",
      description:
        "화덕에 구운 쫀득 담백한 베이글이 인기인 인사동 베이글 맛집.",
    },
    {
      imageUrl:
        "https://mblogthumb-phinf.pstatic.net/MjAyMzA4MjlfMSAg/MDAxNjkzMjQ1NDY2Njkz.YsBR2X50Px7fiUmwMjstUXtvp5JU4_P5oFsjLior_gsg.oBFdNtq7P9V4D1OhJylZqQ7NenR8XG-SRZIeHvGYqDMg.JPEG.kimsy9591/IMG_8510.jpg?type=w800",
      restaurant: "호수식당 문의",
      category: "음식점",
      region: "청주시",
      main_menu: "청국장, 순두부찌개, 비지찌개",
      description: "청국장과 돌솥밥, 누룽지로 유명한 청주 문의 맛집.",
    },
    {
      imageUrl:
        "https://img.siksinhot.com/place/1443970776790487.jpg?w=560&h=448&c=Y",
      restaurant: "안성댁부대찌개 대전",
      category: "음식점",
      region: "유성구",
      main_menu: "부대찌개, 삼겹살",
      description: "깔끔한 국물이 매력적인 대전 현지인 부대찌개 맛집.",
    },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap">
        {placesData.map((place, index) => (
          <div
            key={index}
            className="card m-2 text-start"
            style={{
              width: "18%",
              minWidth: "200px",
              padding: "0.4rem",
            }}
          >
            <img
              src={place.imageUrl}
              className="card-img-top"
              alt={place.restaurant}
            />
            <div className="card-body d-flex flex-column gap-1">
              <div className="fw-bold fs-5">{place.restaurant}</div>
              
                <span
                  className={`badge ${
                    place.category.trim() === "음식점"
                      ? "badge-category-restaurant"
                      : "badge-category-cafe"
                  } me-2`}
                >
                  {place.category}
                </span>
                <span
                  className="badge detail-content"
                  style={{
                    backgroundColor: regionColors[place.region] || "#ccc",
                    color: "#fff",
                    border: `1px solid ${regionColors[place.region] || "#ccc"}`,
                    
                  }}
                >
                  {place.region}
                </span>
              </div>
              <div className="small text">대표 메뉴: {place.main_menu}</div>
              <div className="small text-muted">내용: {place.description}</div>
            </div>
          
        ))}
      </div>
    </div>
  );
};
export default MyPage;
