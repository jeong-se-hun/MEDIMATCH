import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MedicineInfoTabs from "./MedicineInfoTabs";
import { MedicineItem } from "@/types/medicine";

const mockMedicine: MedicineItem = {
  itemSeq: "123",
  itemName: "테스트 약품",
  entpName: "테스트 제약",
  efcyQesitm: "테스트 효능 내용",
  useMethodQesitm: "테스트 용법 내용",
  atpnWarnQesitm: "테스트 주의사항 경고 내용",
  atpnQesitm: "테스트 주의사항 내용",
  intrcQesitm: "테스트 상호작용 내용",
  seQesitm: "테스트 부작용 내용",
  depositMethodQesitm: "테스트 보관방법 내용",
  itemImage: "test.jpg",
};

describe("MedicineInfoTabs", () => {
  test("모든 탭 버튼이 렌더링", () => {
    render(<MedicineInfoTabs medicine={mockMedicine} />);
    expect(screen.getByRole("tab", { name: "효능·효과" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "용법·용량" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "주의사항" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "상호작용" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "부작용" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "보관방법" })).toBeInTheDocument();
  });

  test("초기 렌더링 시 '효능·효과' 탭 활성화 및 내용 표시", () => {
    render(<MedicineInfoTabs medicine={mockMedicine} />);

    const efficacyTabButton = screen.getByRole("tab", { name: "효능·효과" });
    expect(efficacyTabButton).toHaveClass("bg-primary text-white");
    expect(efficacyTabButton).toHaveAttribute("aria-selected", "true");

    expect(screen.getByText("테스트 효능 내용")).toBeInTheDocument();
  });

  test("다른 탭을 클릭하면 활성 탭과 내용이 변경", async () => {
    render(<MedicineInfoTabs medicine={mockMedicine} />);

    const usageTabButton = screen.getByRole("tab", { name: "용법·용량" });
    await userEvent.click(usageTabButton);

    expect(usageTabButton).toHaveClass("bg-primary text-white");
    expect(usageTabButton).toHaveAttribute("aria-selected", "true");

    expect(screen.getByText("테스트 용법 내용")).toBeInTheDocument();

    const efficacyTabButton = screen.getByRole("tab", { name: "효능·효과" });
    expect(efficacyTabButton).not.toHaveClass("bg-primary text-white");
    expect(efficacyTabButton).toHaveAttribute("aria-selected", "false");
  });

  test("medicine 객체가 null일 때 '정보가 제공되지 않았습니다.' 메시지 표시", () => {
    render(<MedicineInfoTabs medicine={null} />);

    const efficacyTabButton = screen.getByRole("tab", { name: "효능·효과" });
    expect(efficacyTabButton).toHaveClass("bg-primary text-white");
    expect(efficacyTabButton).toHaveAttribute("aria-selected", "true");

    expect(
      screen.getByText("효능·효과 정보가 제공되지 않았습니다.")
    ).toBeInTheDocument();
  });

  test("데이터가 없는 탭을 클릭하면 '정보가 제공되지 않았습니다.' 메시지가 표시", async () => {
    render(
      <MedicineInfoTabs medicine={{ ...mockMedicine, useMethodQesitm: "" }} />
    );

    const usageTabButton = screen.getByRole("tab", { name: "용법·용량" });
    await userEvent.click(usageTabButton);

    expect(
      screen.getByText("용법·용량 정보가 제공되지 않았습니다.")
    ).toBeInTheDocument();
  });
});
