import Image from "next/image";
import SearchInputGroup from "@/components/SearchInputGroup";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="logo image"
            width={80}
            height={80}
            priority
          />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">MEDI MATCH</h1>
        <p className="text-gray-500 mb-10">
          필요한 약을 빠르고 쉽게 찾아보세요
        </p>

        <form action="/search" className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <SearchInputGroup
              radioContainerClassName="mb-6"
              inputClassName="py-4"
            />
          </div>

          <button className="w-full cursor-pointer bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md">
            검색하기
          </button>
        </form>
      </div>
    </main>
  );
}
