import { render, screen, waitFor } from "@testing-library/react";
import RecommendedByEfficacy from "./RecommendedByEfficacy";
import { MedicineItem, MedicineResponse } from "@/types/medicine";
import { vi, Mock } from "vitest";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { FETCH_EFFICACY_FAILED } from "@/lib/constants/errors";

vi.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: vi.fn(),
}));

vi.mock("react-intersection-observer", () => ({
  useInView: vi.fn(() => ({ ref: null, inView: false })),
}));

// 하위 컴포넌트 모킹
vi.mock("./MedicineCard", () => ({
  default: ({ itemName }: { itemName: string }) => (
    <div data-testid="medicine-card">
      <h3>{itemName}</h3>
    </div>
  ),
}));
vi.mock("../common/LoadingSpinner", () => ({
  default: () => <div data-testid="loading-spinner" aria-label="로딩중" />,
}));

describe("RecommendedByEfficacy 컴포넌트", () => {
  const mockUseInfiniteQuery = useInfiniteQuery as Mock;
  const mockUseInView = useInView as Mock;

  const mockMedicine: MedicineItem = {
    itemSeq: "1",
    itemName: "테스트 약품",
    entpName: "테스트 제약",
    efcyQesitm: "테스트 효능",
    useMethodQesitm: "용법",
    atpnWarnQesitm: "경고",
    atpnQesitm: "주의",
    intrcQesitm: "상호작용",
    seQesitm: "부작용",
    depositMethodQesitm: "보관",
    itemImage: "image.jpg",
  };

  let initialMockInfiniteQueryValue: any;

  beforeEach(() => {
    vi.resetAllMocks();
    initialMockInfiniteQueryValue = {
      data: {
        pages: [
          {
            header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
            body: {
              items: [
                { ...mockMedicine, itemSeq: "2", itemName: "추천 약품1" },
                { ...mockMedicine, itemSeq: "3", itemName: "추천 약품2" },
              ],
              numOfRows: 10,
              pageNo: 1,
              totalCount: 2,
            },
          },
        ],
        pageParams: [1],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetching: false,
      error: null,
    };
    mockUseInfiniteQuery.mockReturnValue(initialMockInfiniteQueryValue);
    mockUseInView.mockReturnValue({ ref: vi.fn(), inView: false });
  });

  test("로딩 중일 때 로딩 스피너를 표시", () => {
    mockUseInfiniteQuery.mockReturnValue({
      ...initialMockInfiniteQueryValue,
      isFetching: true,
    });

    render(<RecommendedByEfficacy medicine={mockMedicine} />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("에러 발생 시 에러 메시지를 표시", () => {
    mockUseInfiniteQuery.mockReturnValue({
      ...initialMockInfiniteQueryValue,
      error: new Error(FETCH_EFFICACY_FAILED),
    });

    render(<RecommendedByEfficacy medicine={mockMedicine} />);
    expect(screen.getByText(FETCH_EFFICACY_FAILED)).toBeInTheDocument();
  });

  test("효능이 일치하는 다른 의약품 정보가 없을 때 메시지 표시", () => {
    mockUseInfiniteQuery.mockReturnValue({
      ...initialMockInfiniteQueryValue,
      data: {
        pages: [{ header: {}, body: { items: [], totalCount: 0 } }],
        pageParams: [1],
      },
    });

    render(<RecommendedByEfficacy medicine={mockMedicine} />);
    expect(
      screen.getByText("효능이 일치하는 다른 의약품 정보가 없습니다.")
    ).toBeInTheDocument();
  });

  test("추천 약품 목록을 올바르게 렌더링", () => {
    render(<RecommendedByEfficacy medicine={mockMedicine} />);

    expect(
      screen.getByRole("heading", { name: "동일 효능 약품 추천" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("비슷한 효능을 가진 다른 약품들을 확인해보세요")
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("medicine-card")).toHaveLength(2);
    expect(screen.getByText("추천 약품1")).toBeInTheDocument();
    expect(screen.getByText("추천 약품2")).toBeInTheDocument();
  });

  test("현재 약품은 추천 목록에서 제외", () => {
    const mockDataWithCurrentMedicine: MedicineResponse = {
      header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
      body: {
        items: [
          { ...mockMedicine, itemSeq: "1", itemName: "테스트 약품" }, // 현재 약품
          { ...mockMedicine, itemSeq: "2", itemName: "추천 약품1" },
        ],
        numOfRows: 10,
        pageNo: 1,
        totalCount: 2,
      },
    };
    mockUseInfiniteQuery.mockReturnValue({
      ...initialMockInfiniteQueryValue,
      data: { pages: [mockDataWithCurrentMedicine], pageParams: [1] },
    });

    render(<RecommendedByEfficacy medicine={mockMedicine} />);
    expect(screen.queryByText("테스트 약품")).not.toBeInTheDocument();
    expect(screen.getByText("추천 약품1")).toBeInTheDocument();
    expect(screen.getAllByTestId("medicine-card")).toHaveLength(1);
  });

  test("inView가 true이고 hasNextPage가 true일 때 fetchNextPage가 호출", async () => {
    const mockFetchNextPage = vi.fn();
    mockUseInfiniteQuery.mockReturnValue({
      ...initialMockInfiniteQueryValue,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
    });
    mockUseInView.mockReturnValue({ ref: vi.fn(), inView: true });

    render(<RecommendedByEfficacy medicine={mockMedicine} />);

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });
  });

  test("medicine.efcyQesitm이 없을 때 useInfiniteQuery가 비활성화", () => {
    const medicineWithoutEfficacy = { ...mockMedicine, efcyQesitm: "" };
    render(<RecommendedByEfficacy medicine={medicineWithoutEfficacy} />);

    expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });
});
