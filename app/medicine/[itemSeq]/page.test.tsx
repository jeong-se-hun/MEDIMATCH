import { render, screen, waitFor } from "@testing-library/react";
import MedicinePage, { generateMetadata } from "./page";
import {
  getMedicineDetailBySeq,
  getMedicineIngredient,
} from "@/lib/api/medicineApi";
import { Mock, vi } from "vitest";
import { MEDICINE_NOT_FOUND } from "@/lib/constants/errors";

vi.mock("next/image", () => ({
  default: (props: any) => {
    return (
      <img
        {...props}
        alt={props.alt}
        priority={props.priority ? "true" : undefined}
      />
    );
  },
}));

vi.mock("next/link", () => ({
  default: (props: any) => {
    return <a {...props} />;
  },
}));

// API 함수 모킹
vi.mock("@/lib/api/medicineApi", () => ({
  getMedicineDetailBySeq: vi.fn(),
  getMedicineIngredient: vi.fn(),
}));

vi.mock("@/lib/utils/safeFetch", () => ({
  safeFetch: vi.fn(async (fetcher) => {
    try {
      const data = await fetcher();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }),
}));

// 하위 컴포넌트 모킹
vi.mock("@/components/medicine/MedicineInfoTabs", () => ({
  default: vi.fn(() => <div data-testid="medicine-info-tabs" />),
}));
vi.mock("@/components/common/BackButton", () => ({
  default: vi.fn(() => <button data-testid="back-button" />),
}));
vi.mock("@/components/common/ErrorPopup", () => ({
  default: vi.fn(({ error }) => (
    <div data-testid="error-popup">Error: {error.message}</div>
  )),
}));
vi.mock("@/components/medicine/RecommendedMedicines", () => ({
  default: vi.fn(() => <div data-testid="recommended-medicines" />),
}));
vi.mock("@/components/medicine/IngredientTable", () => ({
  default: vi.fn(() => <div data-testid="ingredient-table" />),
}));

const mockMedicineDetail = {
  itemSeq: "202000000",
  itemName: "테스트 약품",
  entpName: "테스트 제약",
  efcyQesitm: "테스트 효능",
  itemImage: "/test.jpg",
};

const mockIngredient = {
  MATERIAL_NAME:
    "총량 : 1정(774mg)|성분명 : 테스트성분|분량 : 325|단위 : 밀리그램|규격 : KP|성분정보 : |비고 :",
};

describe("Medicine Page 렌더링", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    (getMedicineDetailBySeq as Mock).mockResolvedValue(mockMedicineDetail);
    (getMedicineIngredient as Mock).mockResolvedValue(mockIngredient);
  });

  describe("generateMetadata", () => {
    test("약품 정보가 있을 때 올바른 메타데이터를 생성", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ itemSeq: "202000000" }),
      });

      expect(metadata.title).toBe(
        `${mockMedicineDetail.itemName} - 상세 정보 | MEDIMATCH`
      );
      expect(metadata.description).toBe(mockMedicineDetail.efcyQesitm);
      expect(metadata.openGraph?.images).toEqual([
        mockMedicineDetail.itemImage,
      ]);
      expect(metadata.openGraph?.url).toBe(
        `/medicine/${mockMedicineDetail.itemSeq}`
      );
    });

    test("약품 정보가 없을 때 기본 메타데이터를 생성", async () => {
      (getMedicineDetailBySeq as Mock).mockResolvedValue(null);

      const metadata = await generateMetadata({
        params: Promise.resolve({ itemSeq: "999999999" }),
      });

      expect(metadata.title).toBe("약품 정보를 찾을 수 없습니다.");
      expect(metadata.description).toBe("다른 약품을 검색해보세요");
      expect(metadata.openGraph).toBeUndefined();
    });

    test("메타데이터 생성 중 오류가 발생하면 기본 메타데이터를 반환", async () => {
      (getMedicineDetailBySeq as Mock).mockRejectedValue(
        new Error("API Error")
      );

      const metadata = await generateMetadata({
        params: Promise.resolve({ itemSeq: "202000000" }),
      });

      expect(metadata.title).toBe("약품 정보를 찾을 수 없습니다.");
      expect(metadata.description).toBe("다른 약품을 검색해보세요");
      expect(metadata.openGraph).toBeUndefined();
    });
  });

  // Medicine 페이지 렌더링 테스트
  describe("Medicine Page Rendering", () => {
    test("약품 정보가 성공적으로 로드될 때 페이지가 올바르게 렌더링", async () => {
      render(
        await MedicinePage({
          params: Promise.resolve({ itemSeq: "202000000" }),
        })
      );

      expect(await screen.findByText("테스트 약품")).toBeInTheDocument();
      expect(screen.getByText("테스트 제약")).toBeInTheDocument();
      expect(screen.getByAltText("테스트 약품 이미지")).toBeInTheDocument();
      expect(screen.getByTestId("back-button")).toBeInTheDocument();
      expect(screen.getByTestId("medicine-info-tabs")).toBeInTheDocument();
      expect(screen.getByTestId("ingredient-table")).toBeInTheDocument();
      expect(screen.getByTestId("recommended-medicines")).toBeInTheDocument();
    });

    test("약품 정보를 찾을 수 없을 때 ErrorPopup이 렌더링", async () => {
      (getMedicineDetailBySeq as Mock).mockResolvedValue(null);

      render(
        await MedicinePage({
          params: Promise.resolve({ itemSeq: "999999999" }),
        })
      );

      expect(await screen.findByTestId("error-popup")).toBeInTheDocument();
      expect(
        screen.getByText(`Error: ${MEDICINE_NOT_FOUND}`)
      ).toBeInTheDocument();
    });

    test("약품 상세 정보 API 호출이 실패할 때 ErrorPopup이 렌더링", async () => {
      const apiError = new Error("API 호출 실패");
      (getMedicineDetailBySeq as Mock).mockRejectedValue(apiError);

      render(
        await MedicinePage({
          params: Promise.resolve({ itemSeq: "202000000" }),
        })
      );

      expect(await screen.findByTestId("error-popup")).toBeInTheDocument();
      expect(
        screen.getByText(`Error: ${apiError.message}`)
      ).toBeInTheDocument();
    });
  });
});
