import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, vi, beforeEach, Mock } from "vitest";
import ErrorPopup from "./ErrorPopup";
import { useRouter } from "next/navigation";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ErrorPopup", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });

    // window.history 모의
    Object.defineProperty(window, "history", {
      value: {
        length: 2, //이전 페이지가 있다고 가정
        back: vi.fn(),
      },
      writable: true,
    });
  });

  test("error prop이 null 일 때 팝업이 렌더링 X", () => {
    render(<ErrorPopup error={null} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("error prop이 있을 때 팝업이 렌더링", () => {
    const testError = new Error("테스트 오류");
    render(<ErrorPopup error={testError} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ERROR" })).toBeInTheDocument();
    expect(screen.getByText(testError.message)).toBeInTheDocument();
  });

  test("errorMessage prop이 제공되고 error.message가 없을 때 해당 메시지 표시.", () => {
    const customMessage = "사용자 정의 오류 메시지입니다.";
    render(<ErrorPopup error={new Error()} errorMessage={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test("닫기 버튼 클릭 시 onClose 콜백이 호출", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    render(<ErrorPopup error={new Error("테스트")} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button", { name: "팝업 닫기" });
    await user.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("shouldNavigateBack이 true이고 onClose가 없을 때 router.back()이 호출", async () => {
    const user = userEvent.setup();
    render(
      <ErrorPopup error={new Error("테스트")} shouldNavigateBack={true} />
    );

    const closeButton = screen.getByRole("button", { name: "팝업 닫기" });
    await user.click(closeButton);

    await waitFor(() => {
      expect(mockBack).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("shouldNavigateBack이 true이고 history.length가 1 이하일 때 fallbackPath로 router.push()가 호출", async () => {
    const user = userEvent.setup();

    Object.defineProperty(window, "history", {
      value: {
        length: 1,
        back: vi.fn(),
      },
      writable: true,
    });

    const customFallbackPath = "/custom-fallback";
    render(
      <ErrorPopup
        error={new Error("테스트")}
        shouldNavigateBack={true}
        fallbackPath={customFallbackPath}
      />
    );

    const closeButton = screen.getByRole("button", { name: "팝업 닫기" });
    await user.click(closeButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(customFallbackPath);
      expect(mockBack).not.toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("팝업이 열렸을 때 닫기 버튼에 포커스가 가야 합니다.", async () => {
    render(<ErrorPopup error={new Error("테스트")} />);
    const closeButton = screen.getByRole("button", { name: "팝업 닫기" });
    await waitFor(() => expect(closeButton).toHaveFocus());
  });
});
