import type { Metadata } from "next";
import Image from "next/image";
import {
  getMedicineDetailBySeq,
  getMedicineIngredient,
} from "@/lib/api/medicineApi";
import { safeFetch } from "@/lib/utils/safeFetch";
import MedicineInfoTabs from "@/components/medicine/MedicineInfoTabs";
import BackButton from "@/components/common/BackButton";
import ErrorPopup from "@/components/common/ErrorPopup";
import RecommendedMedicines from "@/components/medicine/RecommendedMedicines";
import { MEDICINE_PLACEHOLDER_IMAGE } from "@/lib/constants/images";
import IngredientTable from "@/components/medicine/IngredientTable";
import { MEDICINE_NOT_FOUND } from "@/lib/constants/errors";

export type MedicineParams = {
  itemSeq: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<MedicineParams>;
}): Promise<Metadata> {
  try {
    const { itemSeq } = await params;
    const medicine = await getMedicineDetailBySeq(itemSeq);

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
      : [MEDICINE_PLACEHOLDER_IMAGE];

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
  } catch (error) {
    return {
      title: "약품 정보를 찾을 수 없습니다.",
      description: "다른 약품을 검색해보세요",
    };
  }
}

export default async function Medicine({
  params,
}: {
  params: Promise<MedicineParams>;
}) {
  const { itemSeq } = await params;

  const [medicineResult, ingredientResult] = await Promise.all([
    safeFetch(() => getMedicineDetailBySeq(itemSeq)),
    safeFetch(() => getMedicineIngredient(itemSeq)),
  ]);

  const { data: medicine, error: medicineFetchError } = medicineResult;
  const { data: ingredient } = ingredientResult;

  if (medicineFetchError || !medicine) {
    const ERROR = medicineFetchError || new Error(MEDICINE_NOT_FOUND);
    return <ErrorPopup error={ERROR} />;
  }

  return (
    <main className="min-h-screen">
      <div className="bg-white shadow-lg relative overflow-hidden">
        {/* 상단 요소 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-blue-400"></div>
        <div className="max-w-4xl mx-auto p-5 pt-8">
          <div className="mb-5">
            <BackButton label="뒤로 가기" />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 flex items-start justify-center">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <Image
                  src={medicine?.itemImage || MEDICINE_PLACEHOLDER_IMAGE}
                  alt={`${medicine?.itemName} 이미지` || "약품 이미지"}
                  width={150}
                  height={110}
                  className="rounded-lg aspect-[150/110]"
                  priority
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 break-all">
                {medicine?.itemName}
              </h1>
              <p className="text-gray-500">{medicine?.entpName}</p>

              <MedicineInfoTabs medicine={medicine} />
            </div>
          </div>
          {/* 성분 및 함량 정보*/}
          <div className="mt-8">
            <IngredientTable ingredientString={ingredient?.MATERIAL_NAME} />
          </div>
        </div>
      </div>

      {/* 약품 추천 영역*/}
      <RecommendedMedicines medicine={medicine} ingredient={ingredient} />
    </main>
  );
}
