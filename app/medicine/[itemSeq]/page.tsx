import type { Metadata } from "next";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getMedicineDetailBySeq } from "@/lib/api/medicineApi";
import { safeFetch } from "@/lib/utils/safeFetch";

export type MedicineParams = {
  itemSeq: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<MedicineParams>;
}): Promise<Metadata> {
  const { itemSeq } = await params;
  const decodeItemSeq = decodeURIComponent(itemSeq);
  const medicine = await getMedicineDetailBySeq(decodeItemSeq);

  if (!medicine) {
    return {
      title: "약품 정보를 찾을 수 없습니다.",
      description: "다른 약품을 검색해보세요",
    };
  }

  const title = `${medicine.itemName} - 상세 정보 | MEDIMATCH`;
  const description = medicine.efcyQesitm;

  const ogImages = medicine.itemImage
    ? [medicine.itemImage]
    : ["/images/no-medicine-icon.png"];

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: ogImages,
      url: `/medicine/${itemSeq}`,
      type: "website",
      siteName: "MEDIMATCH",
    },
  };
}

export default async function Medicine({
  params,
}: {
  params: Promise<MedicineParams>;
}) {
  const { itemSeq } = await params;
  const decodeItemSeq = decodeURIComponent(itemSeq);

  const { data: medicine, error: fetchError } = await safeFetch(() =>
    getMedicineDetailBySeq(decodeItemSeq)
  );

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="bg-white shadow-lg relative overflow-hidden">
        {/* 상단 요소 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-blue-400"></div>
        <div className="max-w-4xl mx-auto p-5 pt-8">
          <div className="mb-5">
            <Link
              href="/search"
              className="flex items-center text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>검색 결과로 돌아가기</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 flex items-start justify-center">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {medicine?.itemName}
              </h1>
              <p className="text-gray-500">{medicine?.entpName}</p>

              {/* 성분 및 함량 정보 추가 */}
              <div className="mt-2 flex items-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  이부프로펜 200mg
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex overflow-x-auto scrollbar-hide gap-1 pb-2">
                  {[
                    "효능효과",
                    "용법용량",
                    "주의사항",
                    "상호작용",
                    "부작용",
                    "보관방법",
                  ].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mt-2 p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">
                      효능·효과
                    </h2>
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      이 약은 두통, 치통, 발치후 동통, 인후통, 귀의 통증,
                      관절통, 신경통, 허리통, 근육통, 어깨결림, 타박통, 골절통,
                      염좌통(삠통증), 생리통, 외상통의 진통과 오한, 발열 시의
                      해열에 사용합니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 영역 구분선  */}
      <div className="relative h-24 overflow-hidden bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-5 pt-10">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-xl font-bold text-gray-700">추천 약품</h2>
          </div>
        </div>
      </div>

      {/* 동일 효능 약품 추천 영역*/}
      <section className="py-8 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-5">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">
                동일 효능 약품 추천
              </h2>
            </div>
            <p className="text-gray-500 text-sm ml-4">
              비슷한 효능을 가진 다른 약품들을 확인해보세요
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 via-blue-50 to-transparent rounded-xl blur-sm opacity-70"></div>
            <div className="relative bg-white rounded-xl shadow-md p-4 border border-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1"></div>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                    aria-label="이전 항목 보기"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                    aria-label="다음 항목 보기"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div
                className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <Link
                  href={`/medicine/`}
                  className="flex-shrink-0 w-[300px] bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:translate-y-[-2px] overflow-hidden"
                >
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          alt={"약이미지"}
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          이지엔6이브연질캡슐
                        </h3>
                        <p className="text-sm text-gray-500">(주)대웅제약</p>
                      </div>
                    </div>

                    <div className="text-xs text-gray-700 line-clamp-3 mb-3">
                      이 약은 두통, 치통, 발치후 동통, 인후통, 귀의 통증,
                      관절통, 신경통, 허리통, 근육통, 어깨결림, 타박통, 골절통,
                      염좌통(삠통증), 생리통, 외상통의 진통과 오한, 발열 시의
                      해열에 사용합니다.
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 동일 성분 약품 추천 영역 */}
      <section className="py-8 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-5">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">
                동일 성분 약품 추천
              </h2>
            </div>
            <p className="text-gray-500 text-sm ml-4">
              같은 성분으로 만들어진 다른 약품들을 확인해보세요
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-100 via-purple-50 to-transparent rounded-xl blur-sm opacity-70"></div>
            <div className="relative bg-white rounded-xl shadow-md p-4 border border-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    이부프로펜
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                    aria-label="이전 항목 보기"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                    aria-label="다음 항목 보기"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div
                className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <Link
                  href={`/medicine`}
                  className="flex-shrink-0 w-[300px] bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:translate-y-[-2px] overflow-hidden"
                >
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          alt={"약이미지"}
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          브루펜정 400밀리그램(이부프로펜)
                        </h3>
                        <p className="text-sm text-gray-500">한미약품</p>
                      </div>
                    </div>

                    {/* 성분 및 함량 정보를 눈에 띄게 표시 */}
                    <div className="mb-3 p-2 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-800">
                          성분
                        </span>
                        <span className="text-sm text-purple-700">
                          이부프로펜
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-purple-800">
                          함량
                        </span>
                        <span className="text-sm text-purple-700">400mg</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-700 line-clamp-3 mb-3">
                      이 약은 류마티양 관절염, 골관절염, 배통, 치통, 두통,
                      월경곤란증, 염좌, 타박상, 단순성 발열, 감기로 인한 발열 및
                      동통, 수술 후 동통에 사용합니다.
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 장식 요소 */}
      <div className="h-16 bg-[#f8fafc] relative">
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-blue-400"></div>
      </div>
    </main>
  );
}
