import logo from '@/assets/logo.svg';

const Search = () => {
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const keyword = (
      e.currentTarget.elements.namedItem("searchInput") as HTMLInputElement
    ).value;

    const url = "http://localhost:8080/api/places";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: keyword }),
      });

      if (!res.ok) {
        throw new Error("서버 응답 오류");
      }

      const data = await res.json();
      console.log("서버로부터 응답:", data);
    } catch (err) {
      console.error("검색 실패:", err);
    }
  };

  return (
    <div className="pt-32 flex flex-col items-center gap-8">
      <img src={logo} alt="MATZIP" className="h-20 w-auto" />
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          id="searchInput"
          placeholder="검색어 입력"
          className="border border-gray-300 shadow-sm rounded-full px-6 py-3 w-[600px] text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="ml-4 bg-blue-500 text-white text-lg px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
        >
          검색
        </button>
      </form>
    </div>
  );
};
export default Search;
