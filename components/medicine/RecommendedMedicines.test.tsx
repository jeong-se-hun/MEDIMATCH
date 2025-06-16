import { vi } from "vitest";
import RecommendedMedicines from "./RecommendedMedicines";
import { RecommendedMedicinesProps } from "./RecommendedMedicines";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// 하위 컴포넌트 모킹
vi.mock("@/components/medicine/RecommendedByIngredient", () => ({
  default: vi.fn(() => <div data-testid="recommended-by-ingredient" />),
}));
vi.mock("@/components/medicine/RecommendedByEfficacy", () => ({
  default: vi.fn(() => <div data-testid="recommended-by-efficacy" />),
}));

describe("RecommendedMedicines 렌더링", () => {
  const defaultProps: RecommendedMedicinesProps = {
    ingredient: {
      ITEM_SEQ: "202000000",
      ITEM_NAME: "테스트 약품",
      ENTP_NAME: "테스트 제약",
      CHART: "테스트 이미지",
      MATERIAL_NAME: "테스트 재료",
      INSERT_FILE: "테스트 파일",
      MAIN_ITEM_INGR: "",
      INGR_NAME: "",
      ITEM_ENG_NAME: "",
      MAIN_INGR_ENG: "",
    },
    medicine: {
      entpName: "테스트 제약",
      itemName: "테스트 약품",
      itemSeq: "202000000",
      efcyQesitm: "테스트 효능",
      useMethodQesitm: "테스트 용법",
      atpnWarnQesitm: "테스트 주의사항 경고",
      atpnQesitm: "",
      intrcQesitm: "",
      seQesitm: "",
      depositMethodQesitm: "",
    },
  };

  test("초기 탭 Ingredient 활성화 및 RecommendedByIngredient 렌더링", () => {
    render(<RecommendedMedicines {...defaultProps} />);

    const ingredientTabButton = screen.getByRole("tab", {
      name: "동일 성분 약품",
    });
    expect(ingredientTabButton).toHaveAttribute("aria-selected", "true");

    const ingredientPanel = screen.getByTestId("recommended-by-ingredient");
    expect(ingredientPanel).toBeVisible();

    const efficacyTabButton = screen.getByRole("tab", {
      name: "동일 효능 약품",
    });
    expect(efficacyTabButton).toHaveAttribute("aria-selected", "false");

    const efficacyPanel = screen.getByTestId("recommended-by-efficacy");
    expect(efficacyPanel).not.toBeVisible();
  });

  test("medicine 탭으로 전환 시 탭 활성화 및 RecommendedByEfficacy 렌더링", async () => {
    const user = userEvent.setup();
    render(<RecommendedMedicines {...defaultProps} />);

    const efficacyTabButton = screen.getByRole("tab", {
      name: "동일 효능 약품",
    });
    expect(efficacyTabButton).toHaveAttribute("aria-selected", "false");

    const efficacyPanel = screen.getByTestId("recommended-by-efficacy");
    expect(efficacyPanel).not.toBeVisible();

    await user.click(efficacyTabButton);

    expect(efficacyTabButton).toHaveAttribute("aria-selected", "true");
    expect(efficacyPanel).toBeVisible();
  });
});
