import { GET } from "./route";
import { getMedicineDetailByEfficacy } from "@/lib/api/medicineApi";
import { FETCH_EFFICACY_FAILED } from "@/lib/constants/errors";
import { NextRequest } from "next/server";
import { vi, beforeEach } from "vitest";

type MockFunction = ReturnType<typeof vi.fn>;

vi.mock("@/lib/api/medicineApi", () => ({
  getMedicineDetailByEfficacy: vi.fn(),
}));

const mockRequest = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  return new NextRequest(
    `http://localhost/api/efficacy?${searchParams.toString()}`
  );
};

describe("GET /api/efficacy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("성공적으로 효능 기반 의약품 조회", async () => {
    const mockData = { items: [{ itemName: "테스트 약" }] };
    (getMedicineDetailByEfficacy as MockFunction).mockResolvedValue(mockData);

    const request = mockRequest({ efcyQesitm: "두통" });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockData);

    expect(getMedicineDetailByEfficacy).toHaveBeenCalledWith(
      expect.objectContaining({
        efcyQesitm: "두통",
        pageNo: "1",
      })
    );
  });

  test("efcyQesitm 파라미터 누락 시 400 에러 반환", async () => {
    const request = mockRequest({});
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe(FETCH_EFFICACY_FAILED);
  });

  test("API 호출 실패 시 500 에러 반환", async () => {
    (getMedicineDetailByEfficacy as MockFunction).mockRejectedValue(
      new Error("API Error")
    );

    const request = mockRequest({ efcyQesitm: "두통" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("API Error");
  });

  test("pageNo가 유효하지 않은 값일 때 400 에러", async () => {
    const request = mockRequest({
      efcyQesitm: "두통",
      pageNo: "-1",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ message: "pageNo는 1 이상의 숫자여야 합니다." });
  });
});
