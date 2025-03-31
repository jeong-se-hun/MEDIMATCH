import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="MEDI MATCH Logo"
            width={100}
            height={100}
            priority
            className="drop-shadow-md"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-primary">MEDI MATCH</h1>
        <p className="text-gray-500 mb-10">
          필요한 약을 빠르고 쉽게 찾아보세요
        </p>

        <form action="/search" className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
              <label className="flex-1 text-center">
                <input
                  type="radio"
                  name="searchType"
                  value="medicine"
                  className="sr-only peer"
                  defaultChecked
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
                />
                <span className="block w-full py-2 px-3 rounded-md cursor-pointer transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm">
                  증상
                </span>
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                name="query"
                placeholder="검색어를 입력하세요"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button className="w-full cursor-pointer bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md">
            검색하기
          </button>
        </form>
      </div>
    </main>
  );
}
