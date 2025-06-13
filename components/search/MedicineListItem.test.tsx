import { render, screen } from "@testing-library/react";
import MedicineListItem from "./MedicineListItem";
import { MedicineItem } from "@/types/medicine";
import { MEDICINE_PLACEHOLDER_IMAGE } from "@/lib/constants/images";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: any) => {
    return <img {...props} />;
  },
}));

vi.mock("next/link", () => ({
  default: (props: any) => {
    return <a {...props} />;
  },
}));

describe("MedicineListItem 렌더링 테스트", () => {
  const medicine: MedicineItem = {
    itemSeq: "12345",
    itemName: "테스트 약품",
    entpName: "테스트 제약",
    efcyQesitm: "테스트 효능",
    useMethodQesitm: "테스트 용법",
    atpnWarnQesitm: "테스트 경고",
    atpnQesitm: "테스트 주의",
    intrcQesitm: "테스트 상호작용",
    seQesitm: "테스트 부작용",
    depositMethodQesitm: "테스트 보관",
  };

  test("컴포넌트가 올바르게 렌더링되는지 확인", () => {
    const itemImage = "/test-image.png";
    render(<MedicineListItem medicine={{ ...medicine, itemImage }} />);

    expect(screen.getByText(medicine.itemName)).toBeInTheDocument();
    expect(screen.getByText(medicine.entpName)).toBeInTheDocument();

    const image = screen.getByRole("img", { name: medicine.itemName });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", itemImage);

    const link = screen.getByRole("link", { name: /테스트 약품/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/medicine/${medicine.itemSeq}`);
  });

  test("itemImage prop이 제공되지 않았을 때 placeholder 이미지가 렌더링되는지 확인", () => {
    render(<MedicineListItem medicine={medicine} />);

    const image = screen.getByRole("img", { name: medicine.itemName });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", MEDICINE_PLACEHOLDER_IMAGE);
  });
});
