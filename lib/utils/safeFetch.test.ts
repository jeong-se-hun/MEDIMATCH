import { vi } from "vitest";
import { safeFetch } from "./safeFetch";
import { suppressConsoleError } from "@/test/utils/testUtils";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants/errors";

describe("safeFetch", () => {
  test("성공 시 data, error가 null인 객체를 반환", async () => {
    const mockData = { success: true };
    const mockFetcher = vi.fn().mockResolvedValue(mockData);

    const result = await safeFetch(mockFetcher);

    expect(result).toEqual({
      data: mockData,
      error: null,
    });
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  test("에러 발생 시 data가 null이고 error 객체를 반환", async () => {
    suppressConsoleError();

    const errorMessage = "Network Error";
    const mockError = new Error(errorMessage);
    const mockFetcher = vi.fn().mockRejectedValue(mockError);

    const result = await safeFetch(mockFetcher);

    expect(result).toEqual({
      data: null,
      error: mockError,
    });
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  test("에러가 Error 인스턴스가 아닐 경우, 기본 에러 메시지를 가진 Error 객체를 반환", async () => {
    suppressConsoleError();

    const mockFetcher = vi.fn().mockRejectedValue("Unknown Error");

    const result = await safeFetch(mockFetcher);

    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe(GENERIC_ERROR_MESSAGE);
  });
});
