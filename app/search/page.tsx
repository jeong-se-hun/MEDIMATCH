import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SearchForm from "@/components/SearchForm";

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
            <span className="text-xl font-bold text-gray-800">MEDI MATCH</span>
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

        <SearchForm />

        {/* 검색 결과 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-8">
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
