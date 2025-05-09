export interface ParsedIngredientDetail {
  classification: string | null; // 총량에서 추출한 분류 (없으면 null)
  ingredientName: string; // 성분명
  quantity: string; // 분량
  unit: string; // 단위
}

// 필드명 상수
const FIELD = {
  TOTAL: "총량",
  NAME: "성분명",
  QUANTITY: "분량",
  UNIT: "단위",
} as const;

// 원시 성분 데이터를 위한 인터페이스
interface IngredientFields {
  [FIELD.TOTAL]?: string;
  [FIELD.NAME]: string;
  [FIELD.QUANTITY]: string;
  [FIELD.UNIT]: string;
  [key: string]: string | undefined;
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
    console.warn(
      "[parseIngredientString] 입력된 ingredientString이 null 또는 undefined입니다."
    );
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
    const detail: IngredientFields = {
      [FIELD.NAME]: "",
      [FIELD.QUANTITY]: "",
      [FIELD.UNIT]: "",
    };

    fields.forEach((field) => {
      const idx = field.indexOf(":");
      if (idx > -1) {
        const key = field.slice(0, idx).trim();
        const value = field.slice(idx + 1).trim();
        if (key && value) {
          detail[key] = value;
        }
      }
    });

    // 필요한 데이터 추출
    const totalAmountRaw = detail[FIELD.TOTAL] || "";
    const ingredientName = detail[FIELD.NAME] || "";
    const quantity = detail[FIELD.QUANTITY] || "";
    const unit = detail[FIELD.UNIT] || "";

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
        classification,
        ingredientName,
        quantity,
        unit,
      });
    }
  });

  return parsedDetails;
}
