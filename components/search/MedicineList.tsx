"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { MedicineResponse } from "@/types/medicine";
import { SearchParams } from "@/app/search/page";
import { useInView } from "react-intersection-observer";
import ErrorPopup from "../common/ErrorPopup";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/lib/constants/time";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  FETCH_SEARCH_FAILED,
  SEARCH_PARAMS_REQUIRED,
} from "@/lib/constants/errors";
import { SearchType } from "./SearchForm";
import MedicineListItem from "./MedicineListItem";

type MedicineListType = SearchParams & {
  initialData: MedicineResponse;
};

export default function MedicineList({
  initialData,
  query,
  searchType,
}: MedicineListType) {
  const { data, fetchNextPage, hasNextPage, isFetching, error } =
    useInfiniteQuery({
      queryKey: ["medicines", query, searchType],
      queryFn: async ({ pageParam = 1 }) => {
        if (
          !query ||
          !searchType ||
          !Object.values(SearchType).includes(searchType)
        ) {
          throw new Error(SEARCH_PARAMS_REQUIRED);
        }

        const params = new URLSearchParams({
          query: query,
          searchType: searchType,
          pageNo: String(pageParam),
        });

        const res = await fetch(`/api/search?${params.toString()}`);
        if (!res.ok) {
          throw new Error(FETCH_SEARCH_FAILED);
        }

        return res.json();
      },

      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage?.body.pageNo || 1;
        const itemsPerPage = lastPage?.body.numOfRows || 10;
        const totalItems = lastPage?.body.totalCount || 0;

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },

      initialData: { pages: [initialData], pageParams: [1] },
      staleTime: DEFAULT_STALE_TIME,
      gcTime: DEFAULT_GC_TIME,
    });

  const { ref: inViewRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  const medicines = useMemo(() => {
    return data?.pages.flatMap((page) => page?.body.items ?? []) ?? [];
  }, [data]);

  if (error) {
    return <ErrorPopup error={error} />;
  }

  return (
    <div className="divide-y divide-gray-100">
      {medicines.length > 0
        ? medicines.map((medicine) => (
            <MedicineListItem key={medicine.itemSeq} medicine={medicine} />
          ))
        : !isFetching && (
            <div className="py-12 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}

      {isFetching && (
        <div className="py-6 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* 무한 스크롤 트리거 엘리먼트 */}
      {hasNextPage && <div ref={inViewRef}></div>}
    </div>
  );
}
