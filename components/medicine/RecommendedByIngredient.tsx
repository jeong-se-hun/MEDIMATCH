import { useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import MedicineCard from "@/components/medicine/MedicineCard";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/lib/constants/time";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  IngredientItem,
  MedicineItem,
  MedicinePermissionItem,
  MedicinePermissionResponse,
} from "@/types/medicine";
import { FETCH_INGREDIENT_FAILED } from "@/lib/constants/errors";

type RecommendedByIngredientProps = {
  ingredient: IngredientItem | null;
  medicine: MedicineItem;
};

export default function RecommendedByIngredient({
  ingredient,
  medicine,
}: RecommendedByIngredientProps) {
  const {
    data: sameIngredientMedicines,
    fetchNextPage,
    isFetching,
    hasNextPage,
    error,
  } = useInfiniteQuery<MedicinePermissionResponse | null, Error>({
    queryKey: [
      "recommendedByIngredient",
      medicine.itemSeq,
      ingredient?.MAIN_INGR_ENG,
    ],

    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        item_ingr_name: ingredient?.MAIN_INGR_ENG || "",
        pageNo: String(pageParam),
      });

      const res = await fetch(`/api/ingredient?${params.toString()}`);
      if (!res.ok) {
        throw new Error(FETCH_INGREDIENT_FAILED);
      }

      return res.json();
    },

    enabled: !!ingredient?.MAIN_INGR_ENG,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.body) return undefined;
      const currentPage = parseInt(String(lastPage.body.pageNo), 10) || 1;
      const numOfRows = parseInt(String(lastPage.body.numOfRows), 10) || 10;
      const totalCount = parseInt(String(lastPage.body.totalCount), 10) || 0;

      if (totalCount === 0 || numOfRows === 0) return undefined;

      const totalPages = Math.ceil(totalCount / numOfRows);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });

  const { ref: inViewRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  const filteredMedicines = useMemo(() => {
    const allItems =
      sameIngredientMedicines?.pages.flatMap(
        (page) => page?.body?.items ?? []
      ) ?? [];
    return allItems.filter((item) => medicine.itemSeq !== item.ITEM_SEQ);
  }, [sameIngredientMedicines, medicine.itemSeq]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      {/* 탭 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-6 rounded-full bg-blue-500`}></div>
            <h2 className="text-xl font-bold text-gray-900">
              동일 성분 약품 추천
            </h2>
          </div>
        </div>
        <p className="text-gray-500 text-sm ml-4">
          모든 성분이 일치하는 의약품만 보여집니다. 함량은 제품마다 다르며, 상세
          페이지에서 확인하세요.
        </p>
      </div>
      {/* 탭 내용 */}
      <div className="grid xs:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedicines.map((item: MedicinePermissionItem) => (
          <MedicineCard
            key={item.ITEM_SEQ}
            itemSeq={item.ITEM_SEQ}
            itemName={item.ITEM_NAME}
            entpName={item.ENTP_NAME}
            itemImage={item.BIG_PRDT_IMG_URL}
          />
        ))}

        {error && (
          <div className="col-span-full text-center text-red-500 py-4">
            {error.message || FETCH_INGREDIENT_FAILED}
          </div>
        )}

        {!isFetching && !error && filteredMedicines.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-4">
            성분이 일치하는 다른 의약품 정보가 없습니다.
          </div>
        )}

        {isFetching && (
          <div className="col-span-full pt-6 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {hasNextPage && !error && <div ref={inViewRef}></div>}
      </div>
    </div>
  );
}
