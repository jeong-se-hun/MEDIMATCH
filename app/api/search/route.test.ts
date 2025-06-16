import { GET } from "./route";
import { getMedicineList } from "@/lib/api/medicineApi";
import {
  FETCH_SEARCH_FAILED,
  SEARCH_PARAMS_REQUIRED,
} from "@/lib/constants/errors";
import { suppressConsoleError } from "@/test/utils/testUtils";
import { NextRequest } from "next/server";
import { vi, beforeEach } from "vitest";

type MockFunction = ReturnType<typeof vi.fn>;

vi.mock("@/lib/api/medicineApi", () => ({
  getMedicineList: vi.fn(),
}));

const mockRequest = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  return new NextRequest(
    `http://localhost/api/search?${searchParams.toString()}`
  );
};

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("성공적으로 의약품 조회", async () => {
    const mockData = { items: [{ itemName: "테스트 약" }] };
    (getMedicineList as MockFunction).mockResolvedValue(mockData);

    const request = mockRequest({
      query: "아세트아미노펜",
      searchType: "medicine",
      pageNo: "1",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockData);

    expect(getMedicineList).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "아세트아미노펜",
        searchType: "medicine",
        pageNo: "1",
      })
    );
  });

  test.each([
    { query: "", searchType: "medicine" }, // query가 비어있을 때
    { query: "    ", searchType: "medicine" }, // query가 공백일 때
    { query: "두통", searchType: "" }, // searchType이 없을 때
    { query: "두통", searchType: "invalid_type" }, // searchType이 유효하지 않을 때
  ])(
    "필수 파라미터($query, $searchType)가 유효하지 않으면 400 에러를 반환한다",
    async ({ query, searchType }) => {
      suppressConsoleError();

      const params = { query, searchType };
      const request = mockRequest(params);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe(SEARCH_PARAMS_REQUIRED);
    }
  );

  test("pageNo가 누락되었을 때 기본값 1 적용", async () => {
    const mockData = { items: [{ itemName: "테스트 약" }] };
    (getMedicineList as MockFunction).mockResolvedValue(mockData);

    const request = mockRequest({
      query: "아세트아미노펜",
      searchType: "medicine",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockData);
    expect(getMedicineList).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "아세트아미노펜",
        searchType: "medicine",
        pageNo: "1",
      })
    );
  });

  test("pageNo가 유효하지 않은 값일 때 400 에러", async () => {
    suppressConsoleError();

    const request = mockRequest({
      query: "아세트아미노펜",
      searchType: "medicine",
      pageNo: "-1",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ message: FETCH_SEARCH_FAILED });
  });

  test("API 호출 실패 시 500 에러", async () => {
    suppressConsoleError();

    (getMedicineList as MockFunction).mockRejectedValue(new Error("API Error"));

    const request = mockRequest({
      query: "아세트아미노펜",
      searchType: "medicine",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ message: "API Error" });
  });
});
