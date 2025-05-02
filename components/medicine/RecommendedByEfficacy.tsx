"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { MedicineItem, MedicineResponse } from "@/types/medicine";
import MedicineCard from "./MedicineCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/lib/constants/time";
import { FETCH_EFFICACY_FAILED } from "@/lib/constants/errors";

export type RecommendedByEfficacyProps = {
  medicine: MedicineItem;
};

export default function RecommendedByEfficacy({
  medicine,
}: RecommendedByEfficacyProps) {
  const {
    data: sameEfficacyMedicines,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery<MedicineResponse | null, Error>({
    queryKey: ["recommendedByEfficacy", medicine.itemSeq, medicine.efcyQesitm],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        efcyQesitm: medicine.efcyQesitm,
        pageNo: String(pageParam),
      });

      const res = await fetch(`/api/efficacy?${params.toString()}`);
      if (!res.ok) {
        throw new Error(FETCH_EFFICACY_FAILED);
      }
      return res.json();
    },
    enabled: !!medicine.efcyQesitm,
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

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  const filteredMedicines = useMemo(() => {
    const all =
      sameEfficacyMedicines?.pages.flatMap((page) => page?.body?.items ?? []) ??
      [];
    return all.filter((item) => medicine.itemSeq !== item.itemSeq);
  }, [sameEfficacyMedicines, medicine.itemSeq]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      {/* 탭 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-6 rounded-full bg-blue-500`}></div>
            <h2 className="text-xl font-bold text-gray-900">
              동일 효능 약품 추천
            </h2>
          </div>
        </div>
        <p className="text-gray-500 text-sm ml-4">
          비슷한 효능을 가진 다른 약품들을 확인해보세요
        </p>
      </div>
      <div className="grid xs:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedicines.map((item: MedicineItem) => (
          <MedicineCard
            key={item.itemSeq}
            itemSeq={item.itemSeq}
            itemName={item.itemName}
            entpName={item.entpName}
            itemImage={item.itemImage}
          />
        ))}

        {!isFetching && filteredMedicines.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-4">
            효능이 일치하는 다른 의약품 정보가 없습니다.
          </div>
        )}

        {isFetching && (
          <div className="col-span-full pt-6 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {hasNextPage && <div ref={inViewRef}></div>}
      </div>
    </div>
  );
}
