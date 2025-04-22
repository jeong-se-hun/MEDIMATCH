"use client";
import {
  IngredientItem,
  MedicineItem,
  MedicinePermissionItem,
  MedicinePermissionResponse,
} from "@/types/medicine";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import MedicineCard from "./MedicineCard";
import { getMedicineListByIngredient } from "@/lib/api/medicineApi";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/lib/constants/time";

export type RecommendedMedicinesProps = {
  ingredient: IngredientItem | null;
  medicine: MedicineItem;
};

enum RecommendationTab {
  Ingredient = "성분",
  Efficacy = "효능",
}

// TODO 추후 적용 예정 리스트
// 동일 효능 약품 내부 효능 선택 가능한 드롭 다운 ui 추가
// ingredient 값이 null 일 겨우 동일 성분 약품 이 없습니다 ui 추가

export default function RecommendedMedicines({
  ingredient,
  medicine,
}: RecommendedMedicinesProps) {
  const [recommendTab, setRecommendTab] = useState<RecommendationTab>(
    RecommendationTab.Ingredient
  );

  const handleTabChange = (tab: RecommendationTab) => {
    setRecommendTab(tab);
  };

  const {
    data: sameIngredientMedicines,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: ingredientError,
  } = useInfiniteQuery<MedicinePermissionResponse | null, Error>({
    queryKey: [
      "recommendedMedicines",
      medicine.itemSeq,
      RecommendationTab.Ingredient,
      ingredient?.MAIN_INGR_ENG,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getMedicineListByIngredient({
        item_ingr_name: ingredient?.MAIN_INGR_ENG!,
        pageNo: String(pageParam),
      }),
    enabled:
      recommendTab === RecommendationTab.Ingredient &&
      !!ingredient?.MAIN_INGR_ENG,

    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.body?.pageNo
        ? Number(lastPage.body.pageNo)
        : 1;
      const itemsPerPage = lastPage?.body?.numOfRows
        ? Number(lastPage.body.numOfRows)
        : 10;
      const totalItems = lastPage?.body?.totalCount
        ? Number(lastPage.body.totalCount)
        : 0;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });

  const { ref: inViewRef, inView } = useInView();
  console.log(sameIngredientMedicines);

  // useEffect(() => {
  //   if (inView && hasNextPage) fetchNextPage();
  // }, [inView, hasNextPage, fetchNextPage]);

  return (
    <section className="py-8 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-5">
        {/* 탭 UI */}
        <div className="mb-6">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
            <button
              onClick={() => handleTabChange(RecommendationTab.Ingredient)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                recommendTab === RecommendationTab.Ingredient
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              동일 성분 약품
            </button>
            <button
              onClick={() => handleTabChange(RecommendationTab.Efficacy)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                recommendTab === RecommendationTab.Efficacy
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              동일 효능 약품
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {/* 탭 헤더 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-6 rounded-full bg-blue-500`}></div>
              <h2 className="text-xl font-bold text-gray-900">
                동일 {recommendTab} 약품 추천
              </h2>
            </div>
            <p className="text-gray-500 text-sm ml-4">
              {recommendTab === RecommendationTab.Efficacy
                ? "비슷한 효능을 가진 다른 약품들을 확인해보세요"
                : "같은 성분으로 만들어진 다른 약품들을 확인해보세요"}
            </p>
          </div>
          {/* 탭 내용 */}
          <div className="grid sm:grid-cols-2  lg:grid-cols-3 gap-4">
            {
              recommendTab === RecommendationTab.Ingredient
                ? (
                    sameIngredientMedicines?.pages.flatMap(
                      (page) => page?.body?.items ?? []
                    ) ?? []
                  ).map((item: MedicinePermissionItem) => {
                    const mappedItem = {
                      itemSeq: item.ITEM_SEQ,
                      itemName: item.ITEM_NAME,
                      entpName: item.ENTP_NAME,
                      itemImage: item.BIG_PRDT_IMG_URL,
                    };
                    return (
                      <MedicineCard key={mappedItem.itemSeq} {...mappedItem} />
                    );
                  })
                : // 동일 효능 약품 탭일 때의 데이터 분기 처리 (예시)
                  [] // TODO: 효능 기반 API 데이터에 맞게 가공하여 map 처리
            }
            {hasNextPage && (
              <div ref={inViewRef} className="py-4 text-center text-gray-500">
                {isFetchingNextPage && "Loading more..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
