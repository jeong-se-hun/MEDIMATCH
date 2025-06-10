import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import SearchForm, { SearchType } from "./SearchForm";
import { Mock, vi } from "vitest";

describe("렌더링 테스트", () => {
  test("기본 렌더링 확인", () => {
    render(<SearchForm defaultQuery="test" />);
    const medicineRadio = screen.getByRole("radio", { name: "약 이름" });
    const symptomRadio = screen.getByRole("radio", { name: "증상" });
    const searchInput = screen.getByRole("textbox", { name: "검색어 입력" });
    const searchButton = screen.getByRole("button", { name: "검색하기" });

    expect(medicineRadio).toBeInTheDocument();
    expect(symptomRadio).toBeInTheDocument();
    expect(searchInput).toHaveValue("test");
    expect(searchButton).toBeInTheDocument();
  });

  test("검색 타입별 렌더링 - MEDICINE ", () => {
    render(<SearchForm defaultSearchType={SearchType.MEDICINE} />);

    const medicineRadio = screen.getByRole("radio", { name: "약 이름" });
    const symptomRadio = screen.getByRole("radio", { name: "증상" });

    expect(medicineRadio).toBeChecked();
    expect(symptomRadio).not.toBeChecked();
  });

  test("검색 타입별 렌더링 - SYMPTOM ", () => {
    render(<SearchForm defaultSearchType={SearchType.SYMPTOM} />);

    const medicineRadio = screen.getByRole("radio", { name: "약 이름" });
    const symptomRadio = screen.getByRole("radio", { name: "증상" });

    expect(medicineRadio).not.toBeChecked();
    expect(symptomRadio).toBeChecked();
  });
});

describe("사용자 상호작용", () => {
  test("라디오 버튼 클릭 시 상태 변경", async () => {
    const user = userEvent.setup();
    render(<SearchForm defaultSearchType={SearchType.MEDICINE} />);

    const medicineRadio = screen.getByRole("radio", { name: "약 이름" });
    const symptomRadio = screen.getByRole("radio", { name: "증상" });

    expect(medicineRadio).toBeChecked();
    expect(symptomRadio).not.toBeChecked();

    await user.click(symptomRadio);

    expect(symptomRadio).toBeChecked();
    expect(medicineRadio).not.toBeChecked();
  });

  test("검색어 입력 테스트", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const searchInput = screen.getByRole("textbox", { name: "검색어 입력" });

    await user.type(searchInput, "타이레놀");
    expect(searchInput).toHaveValue("타이레놀");

    await user.clear(searchInput);
    await user.type(searchInput, "아스피린");
    expect(searchInput).toHaveValue("아스피린");
  });
});

describe("폼 제출 테스트", () => {
  let user: UserEvent;
  let mockSubmit: Mock<(event: SubmitEvent) => void>;

  beforeEach(() => {
    user = userEvent.setup();
    mockSubmit = vi.fn((e: SubmitEvent) => e.preventDefault());

    render(<SearchForm />);

    const form = screen.getByRole("form", { name: "검색 폼" });
    form.addEventListener("submit", mockSubmit);
  });

  test("폼 제출 시 올바른 데이터가 구성됨", async () => {
    const queryInput = screen.getByLabelText("검색어 입력");
    await user.type(queryInput, "타이레놀");

    const submitButton = screen.getByRole("button", { name: /검색하기/i });
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalled();

    const event = mockSubmit.mock.calls[0][0];
    const formData = new FormData(event.target as HTMLFormElement);

    expect(formData.get("searchType")).toBe("medicine");
    expect(formData.get("query")).toBe("타이레놀");
  });

  test("폼 제출 시 SearchType이 올바른 상태로 전달됨", async () => {
    const queryInput = screen.getByLabelText("검색어 입력");
    await user.type(queryInput, "감기");

    const symptomRadio = screen.getByRole("radio", { name: "증상" });
    await user.click(symptomRadio);

    const submitButton = screen.getByRole("button", { name: /검색하기/i });
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalled();

    const event = mockSubmit.mock.calls[0][0];
    const formData = new FormData(event.target as HTMLFormElement);

    expect(formData.get("searchType")).toBe("symptom");
    expect(formData.get("query")).toBe("감기");
  });

  test("검색어가 비어있을 때 폼 제출이 차단됨", async () => {
    const submitButton = screen.getByRole("button", { name: /검색하기/i });
    await user.click(submitButton);

    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
