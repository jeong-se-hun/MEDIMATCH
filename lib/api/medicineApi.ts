import { SearchType } from "@/components/search/SearchForm";
import fetchClient from "./api";
import { SearchParams } from "@/app/search/page";
import {
  MedicineResponse,
  MedicineItem,
  IngredientItem,
  IngredientResponse,
  MedicinePermissionResponse,
} from "@/types/medicine";

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

// 의약품 주성분 조회 URL
const INGREDIENT_INFO_URL =
  BASE_URL + "DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnDtlInq05";

// 주성분 으로 의약품 검색
const MEDICINE_PRODUCT_PERMISSION_LIST_URL =
  BASE_URL + "DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnInq06";

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
  itemSeq: MedicineItem["itemSeq"]
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

type MedicineDetailByEfficacyParams = {
  efcyQesitm: MedicineItem["efcyQesitm"];
  pageNo?: string;
  numOfRows?: string;
};

/**
 * 효능 기반 의약품 리스트트 조회
 * @param efcyQesitm 품목기준코드
 */
export async function getMedicineDetailByEfficacy({
  efcyQesitm,
  pageNo = "1",
  numOfRows = "10",
}: MedicineDetailByEfficacyParams): Promise<MedicineResponse | null> {
  if (!efcyQesitm) {
    return null;
  }

  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    efcyQesitm,
    numOfRows,
    pageNo,
    type: "json",
  });

  try {
    const response = await fetchClient<MedicineResponse>(
      `${MEDICINE_INFO_URL}?${params.toString()}`
    );

    if (response?.body?.items && response.body.items.length > 0) {
      return response;
    } else {
      return null;
    }
  } catch (error) {
    console.error("동일 효능 의약품 정보 조회 중 오류 발생:", error);
    throw new Error(
      "동일 효능 의약품 정보 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    );
  }
}

/**
 * 의약품 주성분 상세 정보 조회
 * @param itemSeq 품목기준코드
 */

export async function getMedicineIngredient(
  itemSeq: MedicineItem["itemSeq"]
): Promise<IngredientItem | null> {
  if (!itemSeq) {
    return null;
  }

  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    item_seq: itemSeq,
    numOfRows: "10",
    type: "json",
  });

  try {
    const response = await fetchClient<IngredientResponse>(
      `${INGREDIENT_INFO_URL}?${params.toString()}`
    );

    if (response?.body?.items && response.body.items?.length > 0) {
      return response.body.items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      `의약품 주성분 조회 중 오류 발생  itemName:(${itemSeq}):`,
      error
    );
    throw new Error(`의약품 주성분 조회 중 오류가 발생했습니다.`);
  }
}

type MedicineListByIngredientParams = {
  item_ingr_name: IngredientItem["MAIN_INGR_ENG"];
  pageNo?: string;
  numOfRows?: string;
};

/**
 * 의약품 주성분으로 리스트 조회
 * @param item_ingr_name 주성분명
 * @param pageNo 페이지 번호 (기본값: 1)
 * @param numOfRows 한 페이지 결과 수 (기본값: 10)
 */
export async function getMedicineListByIngredient({
  item_ingr_name,
  pageNo = "1",
  numOfRows = "10",
}: MedicineListByIngredientParams): Promise<MedicinePermissionResponse | null> {
  if (!item_ingr_name) {
    return null;
  }

  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    item_ingr_name,
    numOfRows,
    pageNo,
    type: "json",
  });

  try {
    const response = await fetchClient<MedicinePermissionResponse>(
      `${MEDICINE_PRODUCT_PERMISSION_LIST_URL}?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error("동일 성분 의약품 정보 조회 중 오류 발생:", error);
    throw new Error(
      "동일 성분 의약품 정보 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    );
  }
}
