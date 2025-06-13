import { render, screen } from "@testing-library/react";
import SearchPage from "./page";
import { SearchType } from "@/components/search/SearchForm";
import "@testing-library/jest-dom";
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

vi.mock("@/components/search/MedicineList", () => ({
  default: vi.fn(({ query, searchType }) => (
    <div aria-label="검색 결과 목록">
      {query || searchType ? (
        <p>
          검색어: {query}, 검색 타입: {searchType}
        </p>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  )),
}));

describe("Search Page 렌더링", () => {
  test("searchParams가 없을 때 렌더링 확인", async () => {
    render(await SearchPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("img", { name: "logo image" })).toBeInTheDocument();
    expect(screen.getByText("MEDI MATCH")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "홈 페이지로 이동" })
    ).toHaveAttribute("href", "/");

    expect(screen.getByRole("textbox", { name: "검색어 입력" })).toHaveValue(
      ""
    );
    expect(screen.getByRole("radio", { name: "약 이름" })).toBeChecked();

    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });

  test("searchParams가 있을 때 렌더링 확인", async () => {
    const initialSearchParams = {
      query: "타이레놀",
      searchType: SearchType.MEDICINE,
    };
    render(
      await SearchPage({ searchParams: Promise.resolve(initialSearchParams) })
    );

    expect(screen.getByRole("textbox", { name: "검색어 입력" })).toHaveValue(
      "타이레놀"
    );
    expect(screen.getByRole("radio", { name: "약 이름" })).toBeChecked();

    expect(
      screen.getByText("검색어: 타이레놀, 검색 타입: medicine")
    ).toBeInTheDocument();
  });
});
