export interface ParsedIngredientDetail {
  classification: string | null; // 총량에서 추출한 분류 (없으면 null)
  ingredientName: string; // 성분명
  quantity: string; // 분량
  unit: string; // 단위
}

/**
 * 의약품 주성분 문자열을 파싱하여 구조화된 데이터 배열로 변환합니다.
 *
 * @param ingredientString - 파싱할 주성분 상세 정보 문자열
 * @returns 파싱된 주성분 상세 정보 배열
 */
export function parseIngredientString(
  ingredientString: string | null | undefined
): ParsedIngredientDetail[] {
  if (!ingredientString) {
    return [];
  }

  const entries = ingredientString
    .split(";")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  const parsedDetails: ParsedIngredientDetail[] = [];

  entries.forEach((entry) => {
    const fields = entry
      .split("|")
      .map((field) => field.trim())
      .filter((field) => field.length > 0);
    const detail: Record<string, string> = {};

    fields.forEach((field) => {
      const [key, value] = field.split(":").map((str) => str.trim());
      if (key && value) {
        detail[key] = value;
      }
    });

    // 필요한 데이터 추출
    const totalAmountRaw = detail["총량"] || "";
    const ingredientName = detail["성분명"] || "";
    const quantity = detail["분량"] || "";
    const unit = detail["단위"] || "";

    // '총량'에서 분류 정보 추출
    let classification: string | null = null;
    const lastHyphenIndex = totalAmountRaw.lastIndexOf("-");

    if (lastHyphenIndex > -1 && lastHyphenIndex < totalAmountRaw.length - 1) {
      const potentialClassification = totalAmountRaw
        .substring(lastHyphenIndex + 1)
        .trim();
      if (potentialClassification.length > 0) {
        classification = potentialClassification;
      }
    }

    if (ingredientName && quantity && unit) {
      parsedDetails.push({
        classification: classification,
        ingredientName: ingredientName,
        quantity: quantity,
        unit: unit,
      });
    }
  });

  return parsedDetails;
}
