import logo from '@/assets/logo.svg';
import { useState, useEffect } from 'react';

interface SearchResult {
  id: number;
  restaurant_name: string;
  restaurantName?: string;
  address: string;
  region: string;
  body: string;
  rate: number;
  latitude: string;
  longitude: string;
  category: string;
  mainMenu: string[];
  source: string;
  status: boolean;
  imageUrl: string;
  imageBase64?: string; // Base64 인코딩된 이미지 데이터
  imageType?: string;   // 이미지 타입 (예: image/jpeg)
}

// 기본 음식 카테고리별 이미지 (임시 대응)
const DEFAULT_FOOD_IMAGES: Record<string, string> = {
  '한식': 'https://cdn.pixabay.com/photo/2019/06/04/11/54/korean-food-4251686_1280.jpg',
  '중식': 'https://cdn.pixabay.com/photo/2018/12/03/01/04/spicy-and-sour-noodles-3852590_1280.jpg',
  '일식': 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_1280.jpg',
  '양식': 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
  '치킨': 'https://cdn.pixabay.com/photo/2014/01/24/04/05/fried-chicken-250863_1280.jpg',
  '분식': 'https://cdn.pixabay.com/photo/2019/06/10/10/43/tteokbokki-4264558_1280.jpg',
  '카페': 'https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg',
  'default': 'https://cdn.pixabay.com/photo/2017/06/01/18/46/cook-2364221_1280.jpg'
};

// 카테고리에 맞는 기본 이미지 가져오기
const getDefaultFoodImage = (category: string | undefined): string => {
  if (!category) return DEFAULT_FOOD_IMAGES['default'];
  
  for (const key of Object.keys(DEFAULT_FOOD_IMAGES)) {
    if (category.includes(key)) {
      return DEFAULT_FOOD_IMAGES[key];
    }
  }
  
  return DEFAULT_FOOD_IMAGES['default'];
};

// 이미지 URL을 Base64 API로 변환하는 함수
const getBase64ImageUrl = (originalUrl: string): string => {
  if (!originalUrl) return '';
  return `${import.meta.env.VITE_API_BASE_URL}/api/image-to-base64?url=${encodeURIComponent(originalUrl)}`;
};

// 이미지 URL을 서버에서 직접 가져오는 함수
const getRestaurantImageUrl = (restaurantId: number | undefined): string => {
  if (!restaurantId) return '';
  return `${import.meta.env.VITE_API_BASE_URL}/api/restaurants/${restaurantId}/image`;
};

const Search = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 검색 결과 데이터 디버깅
  useEffect(() => {
    if (searchResults.length > 0) {
      console.log('검색 결과 데이터:', searchResults);
    }
  }, [searchResults]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const keyword = (
      e.currentTarget.elements.namedItem("searchInput") as HTMLInputElement
    ).value;

    const url = "http://localhost:8080/api/search";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: keyword }),
      });

      if (!res.ok) {
        throw new Error("서버 응답 오류");
      }

      const data = await res.json();
      console.log("서버로부터 응답:", data);
      
      // 더 상세한 디버깅 정보 추가
      if (data && data.length > 0) {
        console.log('첫 번째 결과 샘플:');
        const first = data[0];
        console.log('ID:', first.id);
        console.log('이름:', first.restaurant_name || first.restaurantName);
        console.log('imageBase64 존재 여부:', !!first.imageBase64);
        console.log('imageType 존재 여부:', !!first.imageType); 
        console.log('imageBase64 길이:', first.imageBase64 ? first.imageBase64.substring(0, 50) + '...' : 'null');
        
        // 서버에서 오는 데이터 구조 확인
        console.log('첫 번째 결과 전체 키 목록:', Object.keys(first));
      }
      
      setSearchResults(data);
    } catch (err) {
      console.error("검색 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 pt-24 sm:pt-8">
      <div className="w-full max-w-[600px] mb-8">
        <img src={logo} alt="MATZIP" className="h-16 sm:h-20 w-auto mx-auto mb-8" />
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="text"
            id="searchInput"
            placeholder="검색어 입력"
            className="border border-gray-300 shadow-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-[500px] text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            검색
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="text-center text-gray-600">검색 중...</div>
      )}

      {searchResults.length > 0 && (
        <div className="w-full max-w-[800px] space-y-4">
          {searchResults.map((result) => (
            <div key={result.id} className="bg-white rounded-lg shadow-md p-6">
              {/* 이미지 표시 영역 (Base64 데이터 사용) */}
              <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={result.imageBase64 || getDefaultFoodImage(result.category)} 
                  alt={result.restaurant_name || '레스토랑 이미지'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('이미지 로드 실패:', result.id);
                    (e.target as HTMLImageElement).src = getDefaultFoodImage(result.category);
                  }}
                />
              </div>
              
              <h2 className="text-xl font-bold mb-2">{result.restaurant_name || result.restaurantName || '이름 없음'}</h2>
              <div className="text-gray-600 mb-2">
                <p>주소: {result.address || '주소 정보 없음'}</p>
                <p>지역: {result.region || '지역 정보 없음'}</p>
                {result.rate && <p>평점: {result.rate}/5</p>}
              </div>
              <p className="text-gray-700 mb-4">{result.body || '내용 없음'}</p>
              {result.mainMenu && result.mainMenu.length > 0 && (
                <div className="mb-2">
                  <p className="font-semibold">대표 메뉴:</p>
                  <ul className="list-disc list-inside">
                    {result.mainMenu.map((menu, index) => (
                      <li key={index}>{menu}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.source && (
                <a
                  href={result.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  출처 보기
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
