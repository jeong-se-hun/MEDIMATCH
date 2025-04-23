"use client";
import Link from "next/link";
import Image from "next/image";

import { MEDICINE_PLACEHOLDER_IMAGE } from "@/lib/constants/images";

type MedicineCardProps = {
  itemSeq: string;
  itemName: string;
  entpName: string;
  itemImage?: string;
  efcyQesitm?: string;
};

export default function MedicineCard({
  itemSeq,
  itemName,
  entpName,
  itemImage,
  efcyQesitm,
}: MedicineCardProps) {
  return (
    <Link
      href={`/medicine/${itemSeq}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] overflow-hidden"
    >
      <div className="p-4 flex flex-col h-full">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3 flex items-center justify-center">
          <Image
            src={itemImage || MEDICINE_PLACEHOLDER_IMAGE}
            alt={itemName}
            width={200}
            height={108}
            className="rounded-lg object-contain aspect-[200/108]"
          />
        </div>

        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm">
          {itemName}
        </h3>
        {efcyQesitm && (
          <span className="inline-block text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
            {efcyQesitm}
          </span>
        )}

        <p className="text-xs text-gray-500 mb-2">{entpName}</p>
      </div>
    </Link>
  );
}
