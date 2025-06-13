import { render, screen, waitFor } from "@testing-library/react";
import MedicineList from "./MedicineList";
import { SearchType } from "./SearchForm";
import { vi, Mock } from "vitest";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { MedicineItem, MedicineResponse } from "@/types/medicine";
import { FETCH_SEARCH_FAILED } from "@/lib/constants/errors";

vi.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: vi.fn(),
}));

vi.mock("react-intersection-observer", () => ({
  useInView: vi.fn(() => ({ ref: null, inView: false })),
}));

vi.mock("./MedicineListItem", () => ({
  default: ({ medicine }: { medicine: MedicineItem }) => (
    <div data-testid="medicine-list-item">
      <h2>{medicine.itemName}</h2>
    </div>
  ),
}));

describe("MedicineList 컴포넌트", () => {
  const mockUseInfiniteQuery = useInfiniteQuery as Mock;
  const mockUseInView = useInView as Mock;

  beforeEach(() => {
    mockUseInfiniteQuery.mockReset();
    mockUseInView.mockReset();
  });

  describe("로딩 및 에러 상태 렌더링", () => {
    test("로딩중일 때 로딩 스피너 표시", () => {
      mockUseInfiniteQuery.mockReturnValue({
        data: undefined,
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetching: true,
        error: null,
      });
      mockUseInView.mockReturnValue({ ref: null, inView: false });

      render(
        <MedicineList query="타이레놀" searchType={SearchType.MEDICINE} />
      );

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(
        screen.queryByText("검색 결과가 없습니다.")
      ).not.toBeInTheDocument();
    });

    test("에러 발생 시 에러 메시지 표시", () => {
      mockUseInfiniteQuery.mockReturnValue({
        data: undefined,
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetching: false,
        error: new Error(FETCH_SEARCH_FAILED),
      });
      mockUseInView.mockReturnValue({ ref: null, inView: false });

      render(<MedicineList query="" searchType={SearchType.MEDICINE} />);

      expect(screen.getByText(FETCH_SEARCH_FAILED)).toBeInTheDocument();
      expect(
        screen.queryByTestId("medicine-list-item")
      ).not.toBeInTheDocument();
    });
  });

  describe("데이터 기반 렌더링 테스트", () => {
    test("검색 결과가 없을 때 결과 없음 메시지를 표시한다", () => {
      const mockData: MedicineResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: { items: [], numOfRows: 10, pageNo: 1, totalCount: 0 },
      };
      mockUseInfiniteQuery.mockReturnValue({
        data: { pages: [mockData], pageParams: [1] },
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetching: false,
        error: null,
      });
      mockUseInView.mockReturnValue({ ref: null, inView: false });

      render(<MedicineList query="없는약" searchType={SearchType.MEDICINE} />);

      expect(screen.getByText("총 0개")).toBeInTheDocument();

      expect(
        screen.getByText('"없는약" 약 이름 검색 결과가 없습니다')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("medicine-list-item")
      ).not.toBeInTheDocument();
    });

    test("검색 결과가 있을 때, 약품 목록과 총 개수를 올바르게 렌더링한다", () => {
      const mockMedicine: MedicineItem = {
        itemSeq: "1",
        itemName: "테스트 약품1",
        entpName: "테스트 제약1",
        efcyQesitm: "효능1",
        useMethodQesitm: "용법1",
        atpnWarnQesitm: "경고1",
        atpnQesitm: "주의1",
        intrcQesitm: "상호작용1",
        seQesitm: "부작용1",
        depositMethodQesitm: "보관1",
        numOfRows: 0,
        pageNo: 0,
        totalCount: 0,
      };
      const mockData: MedicineResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: {
          items: [mockMedicine],
          numOfRows: 10,
          pageNo: 1,
          totalCount: 1,
        },
      };
      mockUseInfiniteQuery.mockReturnValue({
        data: { pages: [mockData], pageParams: [1] },
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetching: false,
        error: null,
      });
      mockUseInView.mockReturnValue({ ref: null, inView: false });

      render(
        <MedicineList query="테스트 약품" searchType={SearchType.MEDICINE} />
      );
      const headingElement = screen.getByRole("heading", {
        name: /검색 결과/i,
      });
      expect(headingElement).toHaveTextContent('"테스트 약품" 검색 결과');
      expect(screen.getByText("총 1개")).toBeInTheDocument();
      expect(screen.getByTestId("medicine-list-item")).toBeInTheDocument();
      expect(screen.getByText("테스트 약품1")).toBeInTheDocument();
    });
  });

  describe("무한 스크롤 상호작용 테스트", () => {
    test("다음 페이지가 있고 inView가 true일 때 fetchNextPage가 호출된다", async () => {
      const mockFetchNextPage = vi.fn();
      const mockMedicine: MedicineItem = {
        itemSeq: "1",
        itemName: "테스트 약품1",
        entpName: "테스트 제약1",
        efcyQesitm: "효능1",
        useMethodQesitm: "용법1",
        atpnWarnQesitm: "경고1",
        atpnQesitm: "주의1",
        intrcQesitm: "상호작용1",
        seQesitm: "부작용1",
        depositMethodQesitm: "보관1",
        numOfRows: 0,
        pageNo: 0,
        totalCount: 0,
      };
      const mockData: MedicineResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: {
          items: [mockMedicine],
          numOfRows: 10,
          pageNo: 1,
          totalCount: 20,
        },
      };
      mockUseInfiniteQuery.mockReturnValue({
        data: { pages: [mockData], pageParams: [1] },
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetching: false,
        error: null,
      });

      mockUseInView.mockReturnValue({ ref: vi.fn(), inView: true });
      render(<MedicineList query="테스트" searchType={SearchType.MEDICINE} />);

      await waitFor(() => {
        expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
      });
    });
  });
});
