import Image from "next/image";
import Link from "next/link";
import { MedicineItem } from "@/types/medicine";
import { MEDICINE_PLACEHOLDER_IMAGE } from "@/lib/constants/images";

type MedicineListItemProps = {
  medicine: MedicineItem;
};

export default function MedicineListItem({ medicine }: MedicineListItemProps) {
  return (
    <Link
      href={`/medicine/${medicine.itemSeq}`}
      className="block hover:bg-gray-50 transition-colors"
    >
      <div className="p-6 flex items-center">
        <div className="flex-shrink-0 mr-5">
          <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
            <Image
              src={medicine.itemImage || MEDICINE_PLACEHOLDER_IMAGE}
              alt={medicine.itemName}
              width={90}
              height={70}
              className="rounded-lg aspect-[90/70]"
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
  );
}
