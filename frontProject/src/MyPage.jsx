import { useEffect, useState } from "react";
import "./Pages.css";
import regionColors from "./korea_regions_colors.json";
import categoryColors from "./category_colors.json";

const MyPage = () => {
  //dummy data
  const placesData =[
    {
      imageUrl: "https://image.tabling.co.kr/production/menu/fcc8ef2e-4a50-4fed-802c-c9d61e0a2fe8.jpeg",
      restaurant_name: "능동미나리 여의도점",
      category: "한식",
      region: "영등포구",
      mainMenu: ["미나리 수육 전골", "능동 육회비빔밥", "육전"],
      description: "미나리 수육 전골과 육회비빔밥, 육전이 인기인 여의도 직장인들의 술자리 성지.",
      bookmarked: true
    },
    {
      imageUrl: "https://d12zq4w4guyljn.cloudfront.net/750_750_20250106052220_photo1_22dd42f297ce.webp",
      restaurant_name: "소바하우스 멘야준 연남점",
      category: "일식",
      region: "마포구",
      mainMenu: ["특선 소유라멘", "완탕", "흑돼지 슈마이"],
      description: "토핑의 퀄리티가 높은 라멘 맛집. 완탕과 슈마이가 특히 인기.",
      bookmarked: false
    },
    {
      imageUrl: "https://img.siksinhot.com/place/1640215450796032.jpeg",
      restaurant_name: "도넛정수 창신",
      category: "카페",
      region: "종로구",
      mainMenu: ["초코 바나나 도넛", "쑥 초코 도넛", "아메리카노"],
      description: "서울 절벽골목에서 서울 뷰와 함께 즐기는 수제 도넛 카페.",
      bookmarked: true
    },
    {
      imageUrl: "https://blog.kakaocdn.net/dn/bfdTpz/btrDFKZBOKJ/QSI1BH8CfvFOjeuFqf7VQk/img.jpg",
      restaurant_name: "핫쵸 성수",
      category: "일식",
      region: "성동구",
      mainMenu: ["히로시마 오코노미야끼", "명란 크림 돈페야끼", "야끼소바"],
      description: "퍼포먼스 철판 요리가 볼거리인 성수 오코노미야끼 전문점.",
      bookmarked: true
    },
    {
      imageUrl: "https://d12zq4w4guyljn.cloudfront.net/750_750_20240408075829_photo1_b0799598ca1c.webp",
      restaurant_name: "와일드플라워 방배",
      category: "양식",
      region: "서초구",
      mainMenu: ["트러플 들깨 궁채 파스타", "숨비소리 리조또", "레터링 서비스 디저트"],
      description: "감성 가득한 방배동 레스토랑. 레터링 디저트 서비스로 기념일 추천.",
      bookmarked: true
    },
    {
      imageUrl: "https://mblogthumb-phinf.pstatic.net/MjAyMzEwMTZfMTUw/MDAxNjk3NDIzMjM4MzQ3.8Noyj6gr_uhPryMvUJldWbYuT3TP0RfgQ3Ljvd9VJ88g.cM0se-jk5J8mDcBOGogmtpNVXUZ2QQOGf_zCm5uads4g.JPEG.flak4121/IMG_9041.jpg?type=w800",
      restaurant_name: "카츠바이콘반 도산공원점",
      category: "일식",
      region: "강남구",
      mainMenu: ["상로스카츠", "미니 카레", "돈지루"],
      description: "두툼한 특등심 돈카츠와 향신료 진한 카레가 인기인 도산공원 돈카츠 맛집.",
      bookmarked: true
    },
    {
      imageUrl: "https://blog.kakaocdn.net/dn/B0jO4/btrSI9RAQ3k/Xwz65YNvR5zwOYbpNXx4p1/img.jpg",
      restaurant_name: "그라데이션커피 성수",
      category: "카페",
      region: "성동구",
      mainMenu: ["핸드드립 위스키 배럴", "코스타리카 하시엔다 코페이"],
      description: "위스키 배럴 숙성 원두가 시그니처인 핸드드립 전문 카페.",
      bookmarked: true
    },
    {
      imageUrl: "https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/3fy/image/OUgALVYv5pBILsEFofbmJsxevOw.jpg",
      restaurant_name: "코끼리베이글 인사동",
      category: "카페",
      region: "종로구",
      mainMenu: ["버터 솔트 베이글", "아메리카노"],
      description: "화덕에 구운 쫀득 담백한 베이글이 인기인 인사동 베이글 맛집.",
      bookmarked: false
    },
    {
      imageUrl: "https://mblogthumb-phinf.pstatic.net/MjAyMzA4MjlfMSAg/MDAxNjkzMjQ1NDY2Njkz.YsBR2X50Px7fiUmwMjstUXtvp5JU4_P5oFsjLior_gsg.oBFdNtq7P9V4D1OhJylZqQ7NenR8XG-SRZIeHvGYqDMg.JPEG.kimsy9591/IMG_8510.jpg?type=w800",
      restaurant_name: "호수식당 문의",
      category: "한식",
      region: "청주시",
      mainMenu: ["청국장", "순두부찌개", "비지찌개"],
      description: "청국장과 돌솥밥, 누룽지로 유명한 청주 문의 맛집.",
      bookmarked: false
    },
    {
      imageUrl: "https://img.siksinhot.com/place/1443970776790487.jpg?w=560&h=448&c=Y",
      restaurant_name: "안성댁부대찌개 대전",
      category: "한식",
      region: "유성구",
      mainMenu: ["부대찌개", "삼겹살"],
      description: "깔끔한 국물이 매력적인 대전 현지인 부대찌개 맛집.",
      bookmarked: false
    },
    {
      imageUrl: "https://mblogthumb-phinf.pstatic.net/MjAyMzA0MjZfMTU5/MDAxNjgyNDM5MjU1MzQ1.R0DPhaxUT2BI9CQRNummin7J8cb5uQVCc17Z9I_m8Nkg.Q_i1hxJRVXmdXBPXlyipsGr7HH3x1OJJZVB54IqOrIQg.JPEG.queen7165/IMG_8597.jpg?type=w800",
      restaurant_name: "프루 Fru",
      category: "술집",
      region: "종로구",
      mainMenu: ["모둠 사시미", "매콤 파스타", "참치 후토마키"],
      description: "일본 감성의 다찌 이자카야. 사시미와 명란 계란말이가 인기이며 시티팝 분위기 물씬.",
      bookmarked: false
    },
    {
      imageUrl: "https://design.co.kr/wp-content/uploads/2024/07/%EC%B0%A8%EC%B0%A8%EC%9D%B4%ED%85%8C_%EB%B3%B8%EC%B0%A8-%ED%8C%8C%EB%A5%B4%ED%8E%98-832x1109.jpg",
      restaurant_name: "차차이테",
      category: "카페",
      region: "용산구",
      mainMenu: ["맞이차", "본차+과자", "밀크티+스콘"],
      description: "차와 과자를 코스로 즐기는 한남동 예약제 티룸. 분위기 좋은 디저트 공간.",
      bookmarked: false
    },
    {
      imageUrl: "https://d12zq4w4guyljn.cloudfront.net/750_750_20250218121009125_photo_8de4c3974a4b.webp",
      restaurant_name: "금제",
      category: "일식",
      region: "관악구",
      mainMenu: ["특로스가츠", "히레가츠", "가츠산도"],
      description: "저온 조리로 튀긴 프리미엄 로스가츠가 인기인 신림 돈카츠 맛집.",
      bookmarked: false
    },
    {
      imageUrl: "https://dw82ptradz9jo.cloudfront.net/space/0DA35076-8B4C-4394-A735-FB2609655848/story/602a3043bf00be3ceaf9b90a/25ec3b91-168f-4de9-b341-b6cc89b27330",
      restaurant_name: "아우트로 커피",
      category: "카페",
      region: "청주시",
      mainMenu: ["아메리카노", "레몬소르베 음료", "베이커리"],
      description: "청주 외곽 불멍 가능한 대형 카페. 감성 좌석과 사진 맛집으로 인기.",
      bookmarked: false
    },
    {
      imageUrl: "https://blog.kakaocdn.net/dn/HPbck/btsHVEtlXj4/xO7t7Gkha8PzUdkJZLr2xk/img.jpg",
      restaurant_name: "새말해장국 본점",
      category: "한식",
      region: "오산시",
      mainMenu: ["우거지갈비탕", "얼큰내장탕", "해장국"],
      description: "오산 3대 해장국 맛집. 돌솥밥과 함께 먹는 진한 국물 해장국으로 인기.",
      bookmarked: false
    }
  ];

  const [placesData1, setPlacesData] = useState([]); // BE 에서 데이터 받아오기
  const [visibleCount, setVisibleCount] = useState(10); // 현재 브라우저에 보여줄 카드의 수
  const [selectCategory, setSelectedCategory] = useState("전체"); //선택된 카테고리 - filter 용
  const [selectRegion, setSelectedRegion] = useState("전체"); // 선택된 region - filter 용

  const categoryList = ["전체", ...Object.keys(categoryColors)];
  const regionList = ["전체", ...Object.keys(regionColors)];
  
  //카테고리 선택 시 백엔드에서 데이터 fetch
  useEffect(() => {
    const url = "http://localhost:8080/api/places";
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

  return (
    <div className="container mt-4">
      {/* 드롭다운 */}
      <div className="mb-4">
        <label htmlFor="categorySelect" className="me-2 fw-semibold">
          카테고리:
        </label>
        <select
          id="categorySelect"
          className="form-select w-auto d-inline-block"
          value={selectCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categoryList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label htmlFor="regionSelect" className="me-2 fw-semibold ms-3">
          지역:
        </label>
        <select
          id="regionSelect"
          className="form-select w-auto d-inline-block"
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
      <div className="d-flex flex-wrap">
        {placesData.slice(0, visibleCount).map((place, index) => (
          <div
            key={index}
            className="card m-2 text-start"
            style={{
              width: "18%",
              minWidth: "200px",
              padding: "0.4rem",
            }}
          >
            <div className="position-relative">
              <img
                src={place.imageUrl}
                className="card-img-top"
                alt={place.restaurant_name}
              />
              {place.bookmarked && (
                <span
                  className="position-absolute top-0 end-0 p-2"
                  style={{ fontSize: "1.5rem", color: "gold" }}
                >
                  ★
                </span>
              )}
            </div>
            <div className="card-body d-flex flex-column gap-2">
              <div className="fw-bold fs-5">{place.restaurant_name}</div>
              <span
                className="badge"
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
                className="badge"
                style={{
                  backgroundColor: regionColors[place.region] || "#ccc",
                  color: "#fff",
                  border: `1px solid ${regionColors[place.region] || "#ccc"}`,
                }}
              >
                {place.region}
              </span>
              <div className="small text">대표 메뉴: {place.mainMenu.join(", ")}</div>
              <div className="small text-muted">내용: {place.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyPage;
