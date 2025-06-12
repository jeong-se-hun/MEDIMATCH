import { parseIngredientString } from "./medicineUtils";

describe("parseIngredientString", () => {
  test("정상적인 성분 문자열 파싱", () => {
    const input =
      "총량 : 1정204밀리그램 중-특수형|성분명 : 카페인무수물|분량 : 50|단위 : 밀리그램|규격 : KP|성분정보 : |비고 :";
    const result = parseIngredientString(input);

    expect(result).toEqual([
      {
        classification: "특수형",
        ingredientName: "카페인무수물",
        quantity: "50",
        unit: "밀리그램",
      },
    ]);
  });

  test("여러 성분이 있는 문자열 파싱", () => {
    const input =
      "총량 : 이 약 1정 (174.25mg) 중-내수용|성분명 : 브로멜라인|분량 : 40|단위 : 밀리그램|규격 : KP|성분정보 : |비고 : 20,000단위;총량 : 이 약 1정 (174.25mg) 중-내수용|성분명 : 결정트립신|분량 : 1|단위 : 밀리그램|규격 : USP|성분정보 : |비고 : 2,500단위;총량 : 이 약 1정 (174.25mg) 중-수출용|성분명 : 브로멜라인|분량 : 40|단위 : 밀리그램|규격 : KP|성분정보 : |비고 : 20,000단위;총량 : 이 약 1정 (174.25mg) 중-수출용|성분명 : 결정트립신|분량 : 1|단위 : 밀리그램|규격 : USP|성분정보 : |비고 : 2,500단위";
    const result = parseIngredientString(input);

    expect(result).toHaveLength(4);
    expect(result[0].ingredientName).toBe("브로멜라인");
    expect(result[1].ingredientName).toBe("결정트립신");
    expect(result[0].classification).toBe("내수용");
    expect(result[1].classification).toBe("내수용");
    expect(result[0].quantity).toBe("40");
    expect(result[1].quantity).toBe("1");
    expect(result[2].ingredientName).toBe("브로멜라인");
    expect(result[3].ingredientName).toBe("결정트립신");
    expect(result[2].classification).toBe("수출용");
    expect(result[3].classification).toBe("수출용");
    expect(result[2].quantity).toBe("40");
    expect(result[3].quantity).toBe("1");
  });

  test("총량에 분류 정보가 없는 경우", () => {
    const input =
      "총량 : 1정204밀리그램|성분명 : 카페인무수물|분량 : 50|단위 : 밀리그램|규격 : KP|성분정보 : |비고 :";

    const result = parseIngredientString(input);

    expect(result[0]).toMatchObject({
      classification: null,
      ingredientName: "카페인무수물",
      quantity: "50",
      unit: "밀리그램",
    });
  });

  test("빈 문자열이나 null/undefined 입력 처리", () => {
    expect(parseIngredientString("")).toEqual([]);
    expect(parseIngredientString(null)).toEqual([]);
    expect(parseIngredientString(undefined)).toEqual([]);
  });

  test("잘못된 형식의 문자열 처리", () => {
    const input = "성분명:파라세타몰|분량:500"; // 단위 누락
    const result = parseIngredientString(input);
    expect(result).toEqual([]);
  });
});
