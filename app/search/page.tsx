import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LOGO_IMAGE } from "@/lib/constants/images";
import SearchForm, { SearchType } from "@/components/search/SearchForm";
import MedicineList from "@/components/search/MedicineList";

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center">
            <Image
              src={LOGO_IMAGE}
              alt="logo image"
              width={40}
              height={40}
              className="mr-3"
            />
            <span className="text-xl font-bold text-gray-800">MEDI MATCH</span>
          </Link>

          <Link
            href="/"
            className="text-gray-500 hover:text-primary transition-colors flex items-center"
            aria-label="홈 페이지로 이동"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>홈으로</span>
          </Link>
        </div>

        {/* 검색 폼 */}

        <SearchForm defaultQuery={query} defaultSearchType={searchType} />

        {/* 검색 결과 */}
        <MedicineList query={query} searchType={searchType} />
      </div>
    </main>
  );
}
