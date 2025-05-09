import { parseIngredientString } from "@/lib/utils/medicineUtils";

export type IngredientTableProps = {
  ingredientString?: string;
};

export default function IngredientTable({
  ingredientString,
}: IngredientTableProps) {
  const ingredients = parseIngredientString(ingredientString);

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">성분 정보</h3>
        <div className="text-center text-gray-500 py-8">
          성분 상세 정보가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">성분 정보</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* 테이블 헤더 */}
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                분류
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                성분명
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                분량
              </th>
            </tr>
          </thead>
          {/* 테이블 본문 */}
          <tbody className="bg-white divide-y divide-gray-200">
            {ingredients.map((item, index) => (
              <tr
                key={
                  item.classification
                    ? `${item.classification}-${item.ingredientName}`
                    : item.ingredientName
                }
                className={index % 2 === 0 ? "" : "bg-gray-50"}
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                  {item.classification || "-"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.ingredientName || "-"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                  {item.quantity && item.unit
                    ? `${item.quantity} ${item.unit}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
