"use client";
import {
  IngredientItem,
  MedicineItem,
  MedicinePermissionItem,
  MedicinePermissionResponse,
} from "@/types/medicine";
import { useEffect, useMemo, useState } from "react"; // useMemo 추가
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import MedicineCard from "./MedicineCard";
import { getMedicineListByIngredient } from "@/lib/api/medicineApi";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/lib/constants/time";
import { ChevronDown } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";

export type RecommendedMedicinesProps = {
  ingredient: IngredientItem | null;
  medicine: MedicineItem;
};

enum RecommendationTab {
  Ingredient = "성분",
  Efficacy = "효능",
}

export default function RecommendedMedicines({
  ingredient,
  medicine,
}: RecommendedMedicinesProps) {
  const [recommendTab, setRecommendTab] = useState<RecommendationTab>(
    RecommendationTab.Ingredient
  );

  // 성분 목록 파싱 및 상태 관리
  const ingredientsList = useMemo(() => {
    return ingredient?.MAIN_INGR_ENG?.split("/").map((s) => s.trim()) || [];
  }, [ingredient?.MAIN_INGR_ENG]);

  const [selectedIngredient, setSelectedIngredient] = useState<string>(
    ingredientsList[0] || ""
  );

  const handleTabChange = (tab: RecommendationTab) => {
    setRecommendTab(tab);
  };

  const handleIngredientChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedIngredient(event.target.value);
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
      selectedIngredient,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getMedicineListByIngredient({
        item_ingr_name: selectedIngredient,
        pageNo: String(pageParam),
      }),
    enabled:
      recommendTab === RecommendationTab.Ingredient && !!selectedIngredient,

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

  // 첫 성분으로 초기화
  useEffect(() => {
    if (ingredientsList.length > 0 && !selectedIngredient) {
      setSelectedIngredient(ingredientsList[0]);
    }
  }, [ingredientsList, selectedIngredient]);

  // 무한 스크롤
  // useEffect(() => {
  //   if (inView && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
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
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-6 rounded-full bg-blue-500`}></div>
                <h2 className="text-xl font-bold text-gray-900">
                  동일 {recommendTab} 약품 추천
                </h2>
              </div>
              {/* 성분 드롭다운 */}
              {recommendTab === RecommendationTab.Ingredient &&
                ingredientsList.length > 1 && (
                  <div className="relative">
                    <select
                      value={selectedIngredient}
                      onChange={handleIngredientChange}
                      className="block cursor-pointer w-full appearance-none bg-white border border-gray-300 text-gray-900 py-2 pl-4 pr-8 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      {ingredientsList.map((ingr) => (
                        <option key={ingr} value={ingr}>
                          {ingr}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <ChevronDown />
                    </div>
                  </div>
                )}
            </div>
            <p className="text-gray-500 text-sm ml-4">
              {recommendTab === RecommendationTab.Efficacy
                ? "비슷한 효능을 가진 다른 약품들을 확인해보세요"
                : ingredientsList.length > 1
                ? `선택된 성분(${selectedIngredient})으로 만들어진 다른 약품들을 확인해보세요`
                : "같은 성분으로 만들어진 다른 약품들을 확인해보세요"}
            </p>
          </div>
          {/* 탭 내용 */}
          <div className="grid xs:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              recommendTab === RecommendationTab.Ingredient
                ? (
                    sameIngredientMedicines?.pages.flatMap(
                      (page) => page?.body?.items ?? []
                    ) ?? []
                  ).map((item: MedicinePermissionItem) => {
                    // 현재 보고 있는 약품은 제외
                    if (medicine.itemSeq === item.ITEM_SEQ) return null;
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

            {/* 데이터 없음 표시 */}
            {recommendTab === RecommendationTab.Ingredient &&
              !isFetchingNextPage &&
              sameIngredientMedicines?.pages?.[0]?.body?.totalCount === 0 && (
                <div className="col-span-full text-center text-gray-500 py-4">
                  해당 성분의 다른 약품 정보가 없습니다.
                </div>
              )}
          </div>
          {/* 무한 스크롤 트리거 엘리먼트 */}
          {hasNextPage && (
            <div
              ref={inViewRef}
              className="pt-6 flex items-center justify-center"
            >
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
