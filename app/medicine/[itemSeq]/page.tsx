import type { Metadata } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  getMedicineDetailBySeq,
  getMedicineIngredient,
} from "@/lib/api/medicineApi";
import { safeFetch } from "@/lib/utils/safeFetch";
import MedicineInfoTabs from "@/components/MedicineInfoTabs";
import BackButton from "@/components/BackButton";
import ErrorPopup from "@/components/ErrorPopup";

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

  const { data: medicine, error: medicineFetchError } = await safeFetch(() =>
    getMedicineDetailBySeq(decodeItemSeq)
  );

  if (medicineFetchError || !medicine) {
    return <ErrorPopup error={medicineFetchError} />;
  }

  const { data: ingredient, error: ingredientFetchError } = await safeFetch(
    () => getMedicineIngredient(medicine?.itemName)
  );

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="bg-white shadow-lg relative overflow-hidden">
        {/* 상단 요소 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-blue-400"></div>
        <div className="max-w-4xl mx-auto p-5 pt-8">
          <div className="mb-5">
            <BackButton label="검색 결과로 돌아가기" />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 flex items-start justify-center">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <Image
                  src={medicine?.itemImage || "/images/no-medicine-icon.png"}
                  alt={`${medicine?.itemName} 이미지` || "약품 이미지"}
                  width={200}
                  height={110}
                  className="rounded-lg w-[200px] h-[110px]"
                  priority
                />
              </div>
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

              <MedicineInfoTabs medicine={medicine} />
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
                    {ingredient?.MTRAL_NM}
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
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 장식 요소 */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-blue-400"></div>
    </main>
  );
}
