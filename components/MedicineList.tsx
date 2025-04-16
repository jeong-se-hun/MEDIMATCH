"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Link from "next/link";
import { MedicineResponse } from "@/types/medicine";
import { getMedicineList } from "@/lib/api/medicineApi";
import { SearchParams } from "@/app/search/page";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import ErrorPopup from "./ErrorPopup";

const STALE_TIME = 86_400_000;
const GC_TIME = 172_800_000;

type MedicineListType = SearchParams & {
  initialData?: MedicineResponse;
};

export default function MedicineList({
  initialData,
  query,
  searchType,
}: MedicineListType) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useInfiniteQuery({
      queryKey: ["medicines", query, searchType],
      queryFn: ({ pageParam }) =>
        getMedicineList({ query, searchType, pageNo: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage?.body.pageNo || 1;
        const itemsPerPage = lastPage?.body.numOfRows || 10;
        const totalItems = lastPage?.body.totalCount || 0;

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },

      initialData: { pages: [initialData], pageParams: [1] },
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    });
  const { ref: inViewRef, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  if (error) {
    return <ErrorPopup error={error} />;
  }

  return (
    <div className="divide-y divide-gray-100">
      {(data?.pages.flatMap((page) => page?.body.items ?? []) ?? []).map(
        (medicine) => (
          <Link
            key={medicine.itemSeq}
            href={`/medicine/${medicine.itemSeq}`}
            className="block hover:bg-gray-50 transition-colors"
          >
            <div className="p-6 flex items-center">
              <div className="flex-shrink-0 mr-5">
                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <Image
                    src={medicine.itemImage || "/images/no-medicine-icon.png"}
                    alt={medicine.itemName}
                    width={90}
                    height={70}
                    className="rounded-lg w-[90px] h-[70px]"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  {medicine.itemName}
                </h2>
                <p className="text-sm text-gray-500">{medicine.entpName}</p>
                <div className="mt-2 text-sm text-gray-700 line-clamp-2">
                  {medicine.efcyQesitm}
                </div>
                <div className="mt-3 flex flex-wrap gap-1"></div>
              </div>
            </div>
          </Link>
        )
      )}

      {/* 무한 스크롤 트리거 엘리먼트 */}
      {hasNextPage && (
        <div ref={inViewRef} className="py-4 text-center text-gray-500">
          {isFetchingNextPage && "Loading more..."}
        </div>
      )}
    </div>
  );
}
