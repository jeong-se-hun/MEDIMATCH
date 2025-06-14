import { render, screen, within } from "@testing-library/react";
import IngredientTable from "./IngredientTable";
import { parseIngredientString } from "@/lib/utils/medicineUtils";
import { Mock, vi } from "vitest";

vi.mock("@/lib/utils/medicineUtils", () => ({
  parseIngredientString: vi.fn(),
}));

describe("IngredientTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each([
    { case: "undefined", value: undefined },
    { case: "빈 문자열", value: "" },
    { case: "공백 문자열", value: " " },
  ])("성분 문자열이 $case 일 때, 정보 없음 메시지 노출출", ({ value }) => {
    (parseIngredientString as Mock).mockReturnValue([]);

    render(<IngredientTable ingredientString={value} />);

    expect(screen.getByText("성분 상세 정보가 없습니다.")).toBeInTheDocument();
  });

  test("유효한 성분 문자열이 제공될 때 성분 테이블을 렌더링", () => {
    const mockIngredients = [
      {
        classification: "주성분",
        ingredientName: "성분A",
        quantity: "100",
        unit: "mg",
      },
      {
        classification: "첨가제",
        ingredientName: "성분B",
        quantity: "50",
        unit: "mg",
      },
    ];
    (parseIngredientString as Mock).mockReturnValue(mockIngredients);

    render(<IngredientTable ingredientString="유효한 성분 문자열" />);

    const table = screen.getByRole("table");

    // 첫 번째 성분
    const cellForClassificationA = within(table).getByRole("cell", {
      name: "주성분",
    });
    expect(cellForClassificationA).toBeInTheDocument();
    const cellForIngredientA = within(table).getByRole("cell", {
      name: "성분A",
    });
    expect(cellForIngredientA).toBeInTheDocument();
    const cellForQuantityA = within(table).getByRole("cell", {
      name: "100 mg",
    });
    expect(cellForQuantityA).toBeInTheDocument();

    // 두 번째 성분
    const cellForClassificationB = within(table).getByRole("cell", {
      name: "첨가제",
    });
    expect(cellForClassificationB).toBeInTheDocument();
    const cellForIngredientB = within(table).getByRole("cell", {
      name: "성분B",
    });
    expect(cellForIngredientB).toBeInTheDocument();
    const cellForQuantityB = within(table).getByRole("cell", {
      name: "50 mg",
    });
    expect(cellForQuantityB).toBeInTheDocument();
  });
});
