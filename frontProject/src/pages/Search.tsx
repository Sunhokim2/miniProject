import logo from '@/assets/logo.svg';
import { useState } from 'react';

interface SearchResult {
  id: number;
  restaurant_name: string;
  imageUrl: string;
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
}

const Search = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const storedUser = localStorage.getItem('auth-storage'); // 로그인 시 저장한 키 사용
    const authDataObject = JSON.parse(storedUser);
    const extractedId = authDataObject?.state?.user?.id;
    console.log(extractedId);


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
        body: JSON.stringify({ query: keyword
        , user_id: extractedId}),
      });

      if (!res.ok) {
        throw new Error("서버 응답 오류");
      }

      const data = await res.json();
      console.log("서버로부터 응답:", data);
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
              <img src={result.imageUrl} alt="pic1" />
              <h2 className="text-xl font-bold mb-2">{result.restaurant_name}</h2>
              <div className="text-gray-600 mb-2">
                <p>주소: {result.address}</p>
                <p>지역: {result.region}</p>
                {result.rate && <p>평점: {result.rate}/5</p>}
              </div>
              <p className="text-gray-700 mb-4">{result.body}</p>
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
