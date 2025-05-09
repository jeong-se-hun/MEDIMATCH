"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { MedicineResponse } from "@/types/medicine";
import { SearchParams } from "@/app/search/page";
import { useInView } from "react-intersection-observer";
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
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || FETCH_SEARCH_FAILED);
        }

        return res.json();
      },

      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.body) return undefined;
        const currentPage = parseInt(String(lastPage.body.pageNo), 10) || 1;
        const numOfRows = parseInt(String(lastPage.body.numOfRows), 10) || 10;
        const totalCount = parseInt(String(lastPage.body.totalCount), 10) || 0;

        if (totalCount === 0 || numOfRows === 0) return undefined;

        const totalPages = Math.ceil(totalCount / numOfRows);
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

  return (
    <div className="divide-y divide-gray-100">
      {medicines.map((medicine) => (
        <MedicineListItem key={medicine.itemSeq} medicine={medicine} />
      ))}

      {error && (
        <div className="col-span-full text-center text-red-500 py-4">
          {error.message || FETCH_SEARCH_FAILED}
        </div>
      )}

      {!isFetching && !error && medicines.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}

      {isFetching && !error && (
        <div className="py-6 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* 무한 스크롤 트리거 엘리먼트 */}
      {hasNextPage && !error && <div ref={inViewRef}></div>}
    </div>
  );
}
