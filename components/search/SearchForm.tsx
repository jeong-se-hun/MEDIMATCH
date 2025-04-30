import Form from "next/form";

export enum SearchType {
  MEDICINE = "medicine",
  SYMPTOM = "symptom",
}

type SearchFormProps = {
  // 라디오 버튼 초기 선택값 ('medicine' 또는 'symptom')
  defaultSearchType?: SearchType;
  // 검색어 입력창 초기값
  defaultQuery?: string;
};

// 기본 스타일 정의 (
const BASE_INPUT_CLASSES =
  "w-full px-5 py-3 mb-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
const BASE_RADIO_CONTAINER_CLASSES = "flex mb-4 bg-gray-100 p-1 rounded-lg";

export default function SearchForm({
  defaultSearchType = SearchType.MEDICINE,
  defaultQuery = "",
}: SearchFormProps) {
  return (
    <Form
      action="/search"
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      {/* 검색 타입 선택 라디오 버튼 그룹 */}
      <div className={BASE_RADIO_CONTAINER_CLASSES}>
        <label className="flex-1 text-center">
          <input
            type="radio"
            name="searchType"
            value={SearchType.MEDICINE}
            className="sr-only peer"
            defaultChecked={defaultSearchType === SearchType.MEDICINE}
          />

          <span className="block w-full py-2 px-3 rounded-md cursor-pointer transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm">
            약 이름
          </span>
        </label>

        <label className="flex-1 text-center">
          <input
            type="radio"
            name="searchType"
            value={SearchType.SYMPTOM}
            className="sr-only peer"
            defaultChecked={defaultSearchType === SearchType.SYMPTOM}
          />

          <span className="block w-full py-2 px-3 rounded-md cursor-pointer transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm">
            증상
          </span>
        </label>
      </div>

      {/* 검색어 입력 필드 */}

      <div className="relative flex-1">
        <input
          type="text"
          name="query"
          defaultValue={defaultQuery}
          required
          placeholder="검색어를 입력하세요"
          className={BASE_INPUT_CLASSES}
        />
      </div>

      <button className="w-full cursor-pointer bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md">
        검색하기
      </button>
    </Form>
  );
}
