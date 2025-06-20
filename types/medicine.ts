// 의약품 API의 개별 항목 타입 (medicineApi)
export interface MedicineItem {
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
  ITEM_SEQ: string; // 품목기준코드
  ITEM_NAME: string; // 품목명
  ENTP_NAME: string; // 업체명
  CHART: string; // 성상
  MATERIAL_NAME: string; // 원료성분
  INSERT_FILE: string; // 첨부문서 정보
  MAIN_ITEM_INGR: string; // 유효성분 정보
  INGR_NAME: string; // 첨가제 정보
  ITEM_ENG_NAME: string; // 품목영문명
  MAIN_INGR_ENG: string; // 주성분영문명
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

// 약품 제품 허가 목록 API의 개별 항목 타입 (getDrugPrdtPrmsnInq06)
export interface MedicinePermissionItem {
  BIZRNO: string; // 사업자등록번호
  ITEM_SEQ: string; // 품목기준코드
  ITEM_NAME: string; // 제품명
  ITEM_ENG_NAME: string; // 제품영문명
  ENTP_NAME: string; // 업체명
  PRDLST_STDR_CODE: string; // 품목일련번호
  PRDUCT_TYPE: string; // 분류명
  PRDUCT_PRMISN_NO: string; // 품목일련번호
  ITEM_INGR_NAME: string; // 주성분명
  ITEM_INGR_CNT: string; // 주성분 수량량
  BIG_PRDT_IMG_URL: string; // 제품 이미지 URL
}

// 약품 제품 허가 목록 API 전체 응답 타입 (getDrugPrdtPrmsnInq06)
export interface MedicinePermissionResponse {
  header: {
    resultMsg: string;
    resultCode: string;
  };
  body: {
    items: MedicinePermissionItem[];
    pageNo: number;
    numOfRows: number;
    totalCount: number;
  };
}
