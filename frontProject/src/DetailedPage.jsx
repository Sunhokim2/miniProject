const DetailedPage = () => {
  //   const placeData = {
  //     id: 1,
  //     imageUrl:
  //       "https://i.namu.wiki/i/KJGxuoNhAdBUfU9wkTiW1dCGslf_KxfMF8SjlcfIl2ZeAaHXEYWT69f8D5QAXj12yxPibt9yBT3Y7hxiukU-qFI-PpJHUsKnqLzUMQMfExy6w4zhBoGpzjMqvob0cNcC7O-PA3XuHBZfwYgk4hI6PGquYgNyBxiau8wGMKrKToo.webp",
  //     restaurant: "홍콩반점",
  //     category: "음식점",
  //     region: "강남구",
  //     main_menu: "짜장면",
  //     address: "서울 강남구 테헤란로 123",
  //     body: "맛과 양 모두 만족스러운 중식당입니다.",
  //     latitude: 37.500123,
  //     longitude: 127.035678,
  //     rate: 4,
  //     source: "https://blog.naver.com/jieblog/223864819923",
  //     status: "방문함",
  //     bookmarked: true,
  //     visited: true,
  //     created_at: "2025-05-15",
  //     user_posts: [
  //       {
  //         user_name: "전성민",
  //         created_at: "2025-05-15T10:00:00Z",
  //         latitude: 37.500124,
  //         longitude: 127.035679,
  //       },
  //     ],
  //   };
  const placeData = {
    id: 3,
    imageUrl:
      "https://cdn.imweb.me/upload/S2024013025a8a2a1c6644/13570ac6b056e.png",
    restaurant: "능동미나리 여의도점",
    category: "음식점",
    region: "영등포구",
    main_menu: "미나리 수육 전골, 능동 육회비빔밥, 육전",
    address: "서울 영등포구 의사당대로 127 롯데캐슬 엠파이어빌딩 1층 107호",
    body: "미나리가 듬뿍 들어간 수육전골과 육회비빔밥, 육전이 유명한 맛집. 술과 함께 즐기기 좋은 구성으로 여의도 직장인들의 저녁 술자리 성지로 떠오르는 중. 깔끔한 매장과 아기의자 구비, 테이블링 현장대기 시스템 운영. 국물이 점점 깊어지는 전골과 간장양념 육회비빔밥, 육전+비빔밥 조합이 환상적.",
    latitude: 37.527265, // 여의도 롯데캐슬 엠파이어 좌표 (대략적)
    longitude: 126.92465,
    rate: 5,
    source: "https://blog.naver.com/wlgus3651/223570456098",
    status: "방문함",
    bookmarked: false,
    visited: true,
    created_at: "2024-09-03",
    user_posts: [
      {
        user_name: "혀언",
        created_at: "2024-09-03T11:05:00Z",
        latitude: 37.527265,
        longitude: 126.92465,
      },
    ],
  };
  const renderStars = (rate) => "⭐️".repeat(rate);

  return (
    <div className="container-fluid d-flex justify-content-center">
      <div
        className="mt-5 p-4 border rounded shadow-sm bg-light"
        style={{ width: "100%", maxWidth: "650px" }}
      >
        <h1 className="mb-4 text-start">{placeData.restaurant}</h1>
        <img
          src={placeData.imageUrl}
          alt={placeData.restaurant}
          className="detailed-page-image"
        />
        <div className="d-flex mb-2">
          <div className="detail-label">카테고리: </div>
          <div>
            <span className="badge bg-light text-danger border border-danger me-2">
              {placeData.category}
            </span>
          </div>
        </div>
        <div className="d-flex mb-2">
          <div className="detail-label">지역: </div>
          <div>
            <span className="badge bg-light text-danger border border-danger detail-content">
              {placeData.region}
            </span>
          </div>
        </div>
        <div className="d-flex mb-2">
          <div className="detail-label">대표 메뉴: </div>
          <div>{placeData.main_menu}</div>
        </div>
        <div className="d-flex mb-2">
          <div className="detail-label">주소: </div>
          <div>{placeData.address}</div>
        </div>
        <div className="d-flex mb-2">
          <div className="detail-label">방문 여부: </div>
          <div>{placeData.visited ? "✅ 방문함" : "❌ 미방문"}</div>
        </div>
        <div className="d-flex mb-2">
          <div className="detail-label">평점: </div>
          <div>{renderStars(placeData.rate)}</div>
        </div>
        <div className="d-flex mb-2">
          <div className="detail-label">출처: </div>
          <a
            href={placeData.source}
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none text-primary"
          >
            출처 보기
          </a>
        </div>
        <div className="d-flex mb-2">
          <div>{placeData.body}</div>
        </div>
      </div>
    </div>
  );
};
export default DetailedPage;
