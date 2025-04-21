import { SearchType } from "@/components/SearchForm";
import fetchClient from "./api";
import { SearchParams } from "@/app/search/page";
import {
  MedicineResponse,
  MedicineItem,
  IngredientItem,
  IngredientResponse,
} from "@/types/medicine";
import { MedicineParams } from "@/app/medicine/[itemSeq]/page";

const SERVICE_KEY = (() => {
  const key = process.env.NEXT_PUBLIC_API_KEY;
  if (!key) {
    console.error("API_KEY 환경 변수가 설정되지 않았습니다.");
    throw new Error("오류가 발생했습니다 잠시 후 다시 시도해주세요.");
  }
  return key;
})();

const BASE_URL = "http://apis.data.go.kr/1471000/";

// 의약품 정보 조회 URL
const MEDICINE_INFO_URL =
  BASE_URL + "DrbEasyDrugInfoService/getDrbEasyDrugList";

// 의약품 주성분분 조회 URL
const INGREDIENT_INFO_URL =
  BASE_URL + "DrugPrdtPrmsnInfoService06/getDrugPrdtMcpnDtlInq06";

// const INGREDIENT_INFO_URL =
//   BASE_URL + "DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnInq06";

type MedicineListParams = SearchParams & {
  pageNo?: number;
};
/**
 * 의약품 리스트 조회
 * @param query 검색어
 * @param searchType 검색 타입
 * @param pageNo 페이지 번호 (기본값: 1)
 */
export async function getMedicineList({
  query,
  searchType,
  pageNo = 1,
}: MedicineListParams): Promise<MedicineResponse | null> {
  if (!query) return null;

  const searchQuery = {
    itemName: searchType === SearchType.MEDICINE ? query : "",
    efcyQesitm: searchType === SearchType.SYMPTOM ? query : "",
  };

  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    pageNo: String(pageNo),
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
    throw new Error(
      "의약품 정보 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    );
  }
}

/**
 * 의약품 상세 정보 조회
 * 품목기준코드(itemSeq)를 사용하여 의약품 상세 정보 조회 (e약은요 API 활용)
 * @param itemSeq 품목기준코드
 */
export async function getMedicineDetailBySeq(
  itemSeq: MedicineParams["itemSeq"]
): Promise<MedicineItem | null> {
  if (!itemSeq) {
    throw new Error(
      "유효하지 않은 의약품 코드입니다. 코드를 다시 확인해주세요."
    );
  }

  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    itemSeq,
    numOfRows: "1",
    type: "json",
  });

  try {
    const response = await fetchClient<MedicineResponse>(
      `${MEDICINE_INFO_URL}?${params.toString()}`
    );

    if (response?.body?.items && response.body.items.length > 0) {
      return response.body.items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(`의약품 상세 정보 조회 중 오류 발생 (${itemSeq}):`, error);
    throw new Error(`의약품 상세 정보 조회 중 오류가 발생했습니다.`);
  }
}

/**
 * 의약품 주성분 상세 정보 조회
 * @param itemName 제품명
 */

export async function getMedicineIngredient(
  itemName: string
): Promise<IngredientItem | null> {
  if (!itemName) {
    throw new Error(
      "유효하지 않은 의약품 코드입니다. 코드를 다시 확인해주세요."
    );
  }

  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    Prduct: itemName,
    numOfRows: "10",
    type: "json",
  });

  try {
    const response = await fetchClient<IngredientResponse>(
      `${INGREDIENT_INFO_URL}?${params.toString()}`
    );

    console.log(response, "response");
    console.log(response.body.items, "items");

    if (response?.body?.items && response.body.items?.length > 0) {
      return response.body.items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      `의약품 주성분 조회 중 오류 발생  itemName:(${itemName}):`,
      error
    );
    throw new Error(`의약품 주성분 조회 중 오류가 발생했습니다.`);
  }
}
