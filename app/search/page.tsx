import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SearchForm, { SearchType } from "@/components/SearchForm";
import { getMedicineList } from "@/lib/api/medicineApi";

export type SearchParams = {
  query?: string;
  searchType?: SearchType;
};

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { query, searchType } = await searchParams;
  const medicineList = await getMedicineList({ query, searchType });

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

        <SearchForm defaultQuery={query} defaultSearchType={searchType} />

        {/* 검색 결과 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-8">
          <div className="px-6 py-4 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {query && (
                <span className="text-primary">{`"${query.trim()}"`} </span>
              )}
              검색 결과
            </h1>
            {typeof medicineList?.body?.totalCount === "number" && (
              <p className="text-sm font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                총 {medicineList?.body.totalCount}개
              </p>
            )}
          </div>

          {/* 검색 결과 리스트 */}
          <div className="divide-y divide-gray-100"></div>
        </div>
      </div>
    </main>
  );
}
