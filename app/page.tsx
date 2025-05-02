import Image from "next/image";
import SearchForm, { SearchType } from "@/components/search/SearchForm";
import { LOGO_IMAGE } from "@/lib/constants/images";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Image
            src={LOGO_IMAGE}
            alt="logo image"
            width={70}
            height={70}
            priority
          />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">MEDI MATCH</h1>
        <p className="text-gray-500 mb-10">
          필요한 약을 빠르고 쉽게 찾아보세요
        </p>
        {/* 검색 폼 */}
        <SearchForm defaultSearchType={SearchType.MEDICINE} />
      </div>
    </main>
  );
}
