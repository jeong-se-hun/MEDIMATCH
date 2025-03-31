import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Search() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="MEDI MATCH"
              width={40}
              height={40}
              className="mr-3"
            />
            <span className="text-xl font-bold text-primary">MEDI MATCH</span>
          </Link>

          <Link
            href="/"
            className="text-gray-500 hover:text-primary transition-colors flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>홈으로</span>
          </Link>
        </div>

        {/* 검색 폼 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <form action="/search" className="flex flex-col gap-4">
            {/* 탭 스타일의 검색 타입 선택 */}
            <div className="flex mb-4 bg-gray-100 p-1 rounded-lg">
              <label className="flex-1 text-center">
                <input
                  type="radio"
                  name="searchType"
                  value="medicine"
                  className="sr-only peer"
                  //   defaultChecked={searchType === "medicine"}
                />
                <span className="block w-full py-2 px-3 rounded-md cursor-pointer transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm">
                  약 이름
                </span>
              </label>
              <label className="flex-1 text-center">
                <input
                  type="radio"
                  name="searchType"
                  value="symptom"
                  className="sr-only peer"
                  //   defaultChecked={searchType === "symptom"}
                />
                <span className="block w-full py-2 px-3 rounded-md cursor-pointer transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm">
                  증상
                </span>
              </label>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="query"
                  //   defaultValue={query}
                  placeholder="검색어를 입력하세요"
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        {/* 검색 결과 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">검색 결과</h1>
            {/* <p className="text-sm text-gray-500 mt-1">
              {searchType === "medicine" ? "약 이름" : "증상"} "{query}" 검색
              결과 {searchResults.length}개
            </p> */}
          </div>

          {/* 검색 결과 리스트 */}
          <div className="divide-y divide-gray-100"></div>
        </div>
      </div>
    </main>
  );
}
