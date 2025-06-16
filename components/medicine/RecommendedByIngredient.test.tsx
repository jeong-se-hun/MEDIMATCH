import { render, screen, waitFor } from "@testing-library/react";
import RecommendedByIngredient from "./RecommendedByIngredient";
import {
  IngredientItem,
  MedicineItem,
  MedicinePermissionResponse,
} from "@/types/medicine";
import { vi, Mock } from "vitest";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { FETCH_INGREDIENT_FAILED } from "@/lib/constants/errors";

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

describe("RecommendedByIngredient 컴포넌트", () => {
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

  const mockIngredient: IngredientItem = {
    ITEM_SEQ: "1",
    ITEM_NAME: "테스트 성분 약품",
    ENTP_NAME: "테스트 제약",
    CHART: "흰색",
    MATERIAL_NAME: "테스트 원료",
    INSERT_FILE: "테스트 첨부문서",
    MAIN_ITEM_INGR: "테스트 유효성분",
    INGR_NAME: "테스트 첨가제",
    ITEM_ENG_NAME: "Test Medicine",
    MAIN_INGR_ENG: "Test Ingredient",
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
                {
                  BIZRNO: "1234567890",
                  ITEM_SEQ: "2",
                  ITEM_NAME: "추천 약품1",
                  ITEM_ENG_NAME: "Recommended Medicine 1",
                  ENTP_NAME: "테스트 제약",
                  PRDLST_STDR_CODE: "PRD1",
                  PRDUCT_TYPE: "일반의약품",
                  PRDUCT_PRMISN_NO: "PM1",
                  ITEM_INGR_NAME: "Test Ingredient",
                  ITEM_INGR_CNT: "100mg",
                  BIG_PRDT_IMG_URL: "image2.jpg",
                },
                {
                  BIZRNO: "1234567890",
                  ITEM_SEQ: "3",
                  ITEM_NAME: "추천 약품2",
                  ITEM_ENG_NAME: "Recommended Medicine 2",
                  ENTP_NAME: "테스트 제약",
                  PRDLST_STDR_CODE: "PRD2",
                  PRDUCT_TYPE: "일반의약품",
                  PRDUCT_PRMISN_NO: "PM2",
                  ITEM_INGR_NAME: "Test Ingredient",
                  ITEM_INGR_CNT: "200mg",
                  BIG_PRDT_IMG_URL: "image3.jpg",
                },
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

    render(
      <RecommendedByIngredient
        ingredient={mockIngredient}
        medicine={mockMedicine}
      />
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("에러 발생 시 에러 메시지를 표시", () => {
    mockUseInfiniteQuery.mockReturnValue({
      ...initialMockInfiniteQueryValue,
      error: new Error(FETCH_INGREDIENT_FAILED),
    });

    render(
      <RecommendedByIngredient
        ingredient={mockIngredient}
        medicine={mockMedicine}
      />
    );
    expect(screen.getByText(FETCH_INGREDIENT_FAILED)).toBeInTheDocument();
  });

  test("성분이 일치하는 다른 의약품 정보가 없을 때 메시지 표시", () => {
    mockUseInfiniteQuery.mockReturnValue({
      ...initialMockInfiniteQueryValue,
      data: {
        pages: [{ header: {}, body: { items: [], totalCount: 0 } }],
        pageParams: [1],
      },
    });

    render(
      <RecommendedByIngredient
        ingredient={mockIngredient}
        medicine={mockMedicine}
      />
    );
    expect(
      screen.getByText("성분이 일치하는 다른 의약품 정보가 없습니다.")
    ).toBeInTheDocument();
  });

  test("추천 약품 목록을 올바르게 렌더링", () => {
    render(
      <RecommendedByIngredient
        ingredient={mockIngredient}
        medicine={mockMedicine}
      />
    );

    expect(
      screen.getByRole("heading", { name: "동일 성분 약품 추천" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "모든 성분이 일치하는 의약품만 보여집니다. 함량은 제품마다 다르며, 상세 페이지에서 확인하세요."
      )
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("medicine-card")).toHaveLength(2);
    expect(screen.getByText("추천 약품1")).toBeInTheDocument();
    expect(screen.getByText("추천 약품2")).toBeInTheDocument();
  });

  test("현재 약품은 추천 목록에서 제외", () => {
    const mockDataWithCurrentMedicine: MedicinePermissionResponse = {
      header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
      body: {
        items: [
          {
            BIZRNO: "1234567890",
            ITEM_SEQ: "1",
            ITEM_NAME: "테스트 약품",
            ITEM_ENG_NAME: "Test Medicine",
            ENTP_NAME: "테스트 제약",
            PRDLST_STDR_CODE: "PRD0",
            PRDUCT_TYPE: "일반의약품",
            PRDUCT_PRMISN_NO: "PM0",
            ITEM_INGR_NAME: "Test Ingredient",
            ITEM_INGR_CNT: "50mg",
            BIG_PRDT_IMG_URL: "image1.jpg",
          }, // 현재 약품
          {
            BIZRNO: "1234567890",
            ITEM_SEQ: "2",
            ITEM_NAME: "추천 약품1",
            ITEM_ENG_NAME: "Recommended Medicine 1",
            ENTP_NAME: "테스트 제약",
            PRDLST_STDR_CODE: "PRD1",
            PRDUCT_TYPE: "일반의약품",
            PRDUCT_PRMISN_NO: "PM1",
            ITEM_INGR_NAME: "Test Ingredient",
            ITEM_INGR_CNT: "100mg",
            BIG_PRDT_IMG_URL: "image2.jpg",
          },
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

    render(
      <RecommendedByIngredient
        ingredient={mockIngredient}
        medicine={mockMedicine}
      />
    );
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

    render(
      <RecommendedByIngredient
        ingredient={mockIngredient}
        medicine={mockMedicine}
      />
    );

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });
  });

  test("ingredient.MAIN_INGR_ENG가 없을 때 useInfiniteQuery가 비활성화", () => {
    const ingredientWithoutMainIngrEng = {
      ...mockIngredient,
      MAIN_INGR_ENG: "",
    };
    render(
      <RecommendedByIngredient
        ingredient={ingredientWithoutMainIngrEng}
        medicine={mockMedicine}
      />
    );

    expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });

  test("ingredient가 null일 때 useInfiniteQuery가 비활성화", () => {
    render(
      <RecommendedByIngredient ingredient={null} medicine={mockMedicine} />
    );

    expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });
});
