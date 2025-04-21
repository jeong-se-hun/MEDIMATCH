// 의약품 API의 개별 항목 타입 (medicineApi)
export interface MedicineItem {
  // 필수 항목
  resultCode: string; // 결과코드 (4자리)
  resultMsg: string; // 결과메시지 (최대 50자)

  // 옵션 항목
  numOfRows: number; // 한 페이지 결과 수 (최대 3자리)
  pageNo: number; // 페이지 번호 (최대 5자리)
  totalCount: number; // 전체 결과 수 (최대 7자리)
  entpName: string; // 업체명 (최대 4000자)
  itemName: string; // 제품명 (최대 4000자)
  itemSeq: string; // 품목기준코드 (최대 4000자)
  efcyQesitm: string; // 문항1(효능) (최대 4억자)
  useMethodQesitm: string; // 문항2(사용법) (최대 4억자)
  atpnWarnQesitm: string; // 문항3(주의사항경고) (최대 4억자)
  atpnQesitm: string; // 문항4(주의사항) (최대 4억자)
  intrcQesitm: string; // 문항5(상호작용) (최대 4억자)
  seQesitm: string; // 문항6(부작용) (최대 4억자)
  depositMethodQesitm: string; // 문항7(보관법) (최대 4억자)
  itemImage?: string; // 낱알이미지 (최대 3000자)
}

export interface MedicineResponse {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    items: MedicineItem[];
    numOfRows: number;
    pageNo: number;
    totalCount: number;
  };
}

// 주성분 API의 개별 항목 타입
export interface IngredientItem {
  ENTRPS: "string"; // 업체명
  PRDUCT: "string"; // 제품명
  MTRAL_CODE: "string"; // 주성분코드
  MTRAL_NM: "string"; // 주성분명
  QNT: "string"; // 용량
  INGD_UNIT_CD: "string"; // 용량단위
  ITEM_SEQ: "string"; // 품목기준코드
  MAIN_INGR_ENG: "string"; // 주성분영문명
}

// 주성분 API 전체 응답 타입
export interface IngredientResponse {
  header: {
    resultMsg: string;
    resultCode: string;
  };
  body: {
    items: IngredientItem[];
    pageNo: number;
    numOfRows: number;
    totalCount: number;
  };
}
