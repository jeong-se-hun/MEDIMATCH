import { SearchType } from "@/components/SearchForm";
import fetchClient from "./api";
import { SearchParams } from "@/app/search/page";
import { MedicineResponse } from "@/types/medicine";

const SERVICE_KEY = process.env.API_KEY;
if (!SERVICE_KEY) {
  throw new Error("API_KEY 환경 변수가 설정되지 않았습니다.");
}
const BASE_URL = "http://apis.data.go.kr/1471000/";

// 의약품 정보 조회 URL
const MEDICINE_INFO_URL =
  BASE_URL + "DrbEasyDrugInfoService/getDrbEasyDrugList";

/**
 * 의약품 정보 조회
 * @param query 검색어
 * @param searchType 검색 타입
 */
export const getMedicineList = async ({
  query,
  searchType,
}: SearchParams): Promise<MedicineResponse | undefined> => {
  if (!query) return undefined;

  const searchQuery = {
    itemName: searchType === SearchType.MEDICINE ? query : "",
    efcyQesitm: searchType === SearchType.SYMPTOM ? query : "",
  };

  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    pageNo: "1",
    numOfRows: "10",
    ...searchQuery,
    type: "json",
  });

  try {
    const response = await fetchClient<MedicineResponse>(
      `${MEDICINE_INFO_URL}?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error("의약품 정보 조회 중 오류 발생:", error);
    throw error;
  }
};
