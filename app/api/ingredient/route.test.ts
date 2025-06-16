import { GET } from "./route";
import { getMedicineListByIngredient } from "@/lib/api/medicineApi";
import { FETCH_INGREDIENT_FAILED } from "@/lib/constants/errors";
import { suppressConsoleError } from "@/test/utils/testUtils";
import { NextRequest } from "next/server";
import { vi, beforeEach } from "vitest";

type MockFunction = ReturnType<typeof vi.fn>;

vi.mock("@/lib/api/medicineApi", () => ({
  getMedicineListByIngredient: vi.fn(),
}));

const mockRequest = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  return new NextRequest(
    `http://localhost/api/ingredient?${searchParams.toString()}`
  );
};

describe("GET /api/ingredient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("성공적으로 성분 기반 의약품 조회", async () => {
    const mockData = { items: [{ itemName: "테스트 약" }] };
    (getMedicineListByIngredient as MockFunction).mockResolvedValue(mockData);

    const request = mockRequest({ item_ingr_name: "아세트아미노펜" });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockData);

    expect(getMedicineListByIngredient).toHaveBeenCalledWith(
      expect.objectContaining({
        item_ingr_name: "아세트아미노펜",
        pageNo: "1",
      })
    );
  });

  test("item_ingr_name 파라미터 누락 시 400 에러 반환", async () => {
    suppressConsoleError();
    const request = mockRequest({});
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe(FETCH_INGREDIENT_FAILED);
  });

  test("API 호출 실패 시 500 에러 반환", async () => {
    (getMedicineListByIngredient as MockFunction).mockRejectedValue(
      new Error("API Error")
    );

    const request = mockRequest({ item_ingr_name: "아세트아미노펜" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("API Error");
  });

  test("pageNo가 유효하지 않은 값일 때 400 에러", async () => {
    suppressConsoleError();

    const request = mockRequest({
      item_ingr_name: "아세트아미노펜",
      pageNo: "-1",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ message: FETCH_INGREDIENT_FAILED });
  });
});
