import React from "react";
import "../css/Pages.css"
import rawRegionColors from "./korea_regions_colors.json";
import categoryColors from './category_colors.json'

interface Place {
  id: number;
  imageUrl: string;
  restaurant_name: string;
  category: string;
  region: string;
  mainMenu: string[];
  address: string;
  description: string;
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

interface DetailedpageProps {
  place: Place;
  onBack: () => void;
  onToggleVisited: (id: number) => void;
  onToggleBookmarked: (id: number) => void;
}

  // regionColors를 객체로 변환
  const regionColors = Object.fromEntries(
    rawRegionColors.map(({ region, color }) => [region, color])
  );

const DetailedPage: React.FC<DetailedpageProps> = ({ place, onBack, onToggleVisited, onToggleBookmarked }) => {
  const renderStars = (rate: number) => "⭐️".repeat(rate);

  const toggleVisited = () => onToggleVisited(place.id);
  const toggleBookmarked = () => onToggleBookmarked(place.id);

  return (
    <div className="flex justify-center w-full">
      <div
        className="mt-4 p-6 border rounded shadow bg-gray-100"
        style={{ width: "100%", maxWidth: "650px" }}
      >
        <div className="text-left mb-2">
          <button
            className="flex items-center text-gray-500 text-sm hover:text-gray-700"
            onClick={onBack}
            style={{ textDecoration: "none", color: "gray", fontSize: "15px" }}
          >
            ← 돌아가기
          </button>
        </div>
        <div className="flex justify-between items-start mb-5">
          <h1 className="mt-3 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-white">{place.restaurant_name}</h1>
          <div className="flex gap-2">
            <button
              className={`bookmark-button ${
                place.bookmarked ? "gold" : "gray"
              }`}
              onClick={toggleBookmarked}
              aria-label="Bookmark"
            >
              {place.bookmarked ? "★" : "☆"}
            </button>
          </div>
        </div>
        <img
          src={place.imageUrl}
          alt={place.restaurant_name}
          className="detailedpage-image"
        />
        <div className="flex mt-2 mb-2">
          <div className="detail-label">카테고리: </div>
          <div className="d-flex justify-content-between">
            <span
                className="px-2 py-1 rounded text-white text-xs"
                style={{
                  backgroundColor: categoryColors[place.category] || "#ccc",
                  border: `1px solid ${categoryColors[place.category] || "#ccc"}`,
                }}
              >
              {place.category}
            </span>
          </div>
        </div>
        <div className="flex mb-2">
          <div className="detail-label">지역: </div>
          <div className="">
            <span
              className="px-2 py-1 rounded text-white text-xs"
              style={{
                backgroundColor: regionColors[place.region] || "#ccc",
                border: `1px solid ${regionColors[place.region] || "#ccc"}`,
              }}
            >
              {place.region}
            </span>
          </div>
        </div>
        <div className="flex mb-2">
          <div className="detail-label">대표 메뉴: </div>
          {place.mainMenu.join(", ")}
        </div>
        <div className="flex mb-2">
          <div className="detail-label">주소: </div>
          <div>{place.address}</div>
        </div>
        <div className="flex mb-2">
          <div className="detail-label">평점: </div>
          <div>{renderStars(place.rate)}</div>
        </div>
        <div className="flex mb-2">
          <div className="detail-label">구글 지도: </div>
          <a
            href={place.map_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            링크
          </a>
        </div>
        <div className="flex mb-2">
          <div className="detail-label">출처: </div>
          <a
            href={place.source}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            출처 보기
          </a>
        </div>
        <div className="flex mb-2">
          <div className="detail-label"></div>
          <div className="text-left mt-3 mr-5">{place.description}</div>
        </div>
        <div className="flex justify-center mt-4">
        <button
          className={`mt-3 px-3 py-1 ${
            place.visited ? "bg-green-500 text-white rounded text-sm" : "border border-gray-400 text-gray-700 rounded text-sm"
          }`}
          onClick={toggleVisited}
        >
          {place.visited ? "✅ 방문함" : "❌ 미방문"}
        </button>
        </div>
      </div>
    </div>
  );
};
export default DetailedPage;
