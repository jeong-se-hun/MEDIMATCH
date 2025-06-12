import { vi, afterEach } from "vitest";

// 에러 로그 무시
export function suppressConsoleError() {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
}
