import { Mock, vi } from "vitest";
import fetchClient, { DEFAULT_CACHE, DEFAULT_REVALIDATE } from "./api";

describe("fetchClient", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("성공 시, 파싱된 JSON을 반환한다", async () => {
    const mockData = { message: "Success" };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockData),
    };
    (fetch as Mock).mockResolvedValueOnce(mockResponse);

    const result = await fetchClient("/api/success");

    expect(result).toEqual(mockData);
  });

  test("호출 시, 올바른 URL과 캐시 옵션을 사용한다", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({}) };
    (fetch as Mock).mockResolvedValueOnce(mockResponse);
    const testUrl = "/api/test-options";

    await fetchClient(testUrl);

    expect(fetch).toHaveBeenCalledWith(testUrl, {
      next: { revalidate: DEFAULT_REVALIDATE },
      cache: DEFAULT_CACHE,
    });
  });

  test("HTTP 에러 시, 상태 코드와 에러 메시지를 포함한 예외를 던진다", async () => {
    const errorStatus = 404;
    const errorText = "Not Found";
    const mockResponse = {
      ok: false,
      status: errorStatus,
      text: () => Promise.resolve(errorText),
    };
    (fetch as Mock).mockResolvedValueOnce(mockResponse);

    await expect(fetchClient("/api/not-found")).rejects.toThrow(
      `API 요청 실패: ${errorStatus} - ${errorText}`
    );
  });

  test("네트워크 에러 시, 발생한 원본 에러를 다시 던진다", async () => {
    const networkError = new Error("Network connection failed");
    (fetch as Mock).mockRejectedValueOnce(networkError);

    await expect(fetchClient("/api/network-error")).rejects.toThrow(
      networkError
    );
  });
});
