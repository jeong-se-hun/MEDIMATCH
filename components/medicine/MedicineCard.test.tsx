import { render, screen } from "@testing-library/react";
import MedicineCard from "./MedicineCard";
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

describe("MedicineCard 렌더링 테스트", () => {
  const defaultProps = {
    itemSeq: "12345",
    itemName: "테스트 약품",
    entpName: "테스트 제약",
  };

  test("필수 props로 컴포넌트가 올바르게 렌더링되는지 확인", () => {
    render(<MedicineCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.itemName)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.entpName)).toBeInTheDocument();

    const image = screen.getByAltText(defaultProps.itemName);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", MEDICINE_PLACEHOLDER_IMAGE);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/medicine/${defaultProps.itemSeq}`);
  });

  test("itemImage prop이 제공되었을 때 해당 이미지가 렌더링되는지 확인", () => {
    const customImage = "/custom-image.png";
    render(<MedicineCard {...defaultProps} itemImage={customImage} />);

    const image = screen.getByAltText(defaultProps.itemName);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", customImage);
  });
});
