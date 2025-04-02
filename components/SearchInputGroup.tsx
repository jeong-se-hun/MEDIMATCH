import { twMerge } from "tailwind-merge"; //

type SearchInputGroupProps = {
  // 라디오 버튼 초기 선택값 ('medicine' 또는 'symptom')
  defaultSearchType?: "medicine" | "symptom";
  // 검색어 입력창 초기값
  defaultQuery?: string;
  // 검색어 입력창에 적용할 추가/변경 Tailwind 클래스 (선택 사항)
  inputClassName?: string;
  // 라디오 버튼 그룹 컨테이너에 적용할 추가/변경 Tailwind 클래스 (선택 사항)
  radioContainerClassName?: string;
};

// 기본 스타일 정의 (
const BASE_INPUT_CLASSES =
  "w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
const BASE_RADIO_CONTAINER_CLASSES = "flex mb-4 bg-gray-100 p-1 rounded-lg";

export default function SearchInputGroup({
  defaultSearchType = "medicine",
  defaultQuery = "",
  inputClassName,
  radioContainerClassName,
}: SearchInputGroupProps) {
  return (
    <>
      {/* 검색 타입 선택 라디오 버튼 그룹 */}
      <div
        className={twMerge(
          BASE_RADIO_CONTAINER_CLASSES,
          radioContainerClassName
        )}
      >
        <label className="flex-1 text-center">
          <input
            type="radio"
            name="searchType"
            value="medicine"
            className="sr-only peer"
            defaultChecked={defaultSearchType === "medicine"}
          />

          <span className="block w-full py-2 px-3 rounded-md cursor-pointer transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm">
            약 이름
          </span>
        </label>

        <label className="flex-1 text-center">
          <input
            type="radio"
            name="searchType"
            value="symptom"
            className="sr-only peer"
            defaultChecked={defaultSearchType === "symptom"}
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
          placeholder="검색어를 입력하세요"
          className={twMerge(BASE_INPUT_CLASSES, inputClassName)}
        />
      </div>
    </>
  );
}
