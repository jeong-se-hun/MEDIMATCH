import { vi, Mock } from "vitest";
import fetchClient from "./api";
import { SearchType } from "@/components/search/SearchForm";
import {
  FETCH_EFFICACY_FAILED,
  FETCH_INGREDIENT_FAILED,
  FETCH_MEDICINE_DETAIL_FAILED,
  FETCH_MEDICINE_INGREDIENTS_FAILED,
  FETCH_SEARCH_FAILED,
  INVALID_CODE_ERROR,
  MEDICINE_NOT_FOUND,
} from "@/lib/constants/errors";
import {
  IngredientItem,
  IngredientResponse,
  MedicineItem,
  MedicinePermissionItem,
  MedicinePermissionResponse,
  MedicineResponse,
} from "@/types/medicine";
import { suppressConsoleError } from "@/test/utils/testUtils";

vi.mock("./api", () => ({
  default: vi.fn(),
}));

let medicineApi: {
  getMedicineList: typeof import("./medicineApi").getMedicineList;
  getMedicineDetailBySeq: typeof import("./medicineApi").getMedicineDetailBySeq;
  getMedicineDetailByEfficacy: typeof import("./medicineApi").getMedicineDetailByEfficacy;
  getMedicineIngredient: typeof import("./medicineApi").getMedicineIngredient;
  getMedicineListByIngredient: typeof import("./medicineApi").getMedicineListByIngredient;
};

describe("medicineApi", () => {
  beforeEach(async () => {
    vi.resetModules();

    vi.stubGlobal("process", {
      ...process,
      env: {
        API_KEY: "test_api_key",
      },
    });

    medicineApi = await import("./medicineApi");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 의약품 리스트 조회
  describe("getMedicineList", () => {
    test("성공 시, 의약품 리스트 반환", async () => {
      const mockItem: MedicineItem = {
        itemName: "타이레놀정500밀리그램",
        itemSeq: "202301011234",
        entpName: "한국제약",
        efcyQesitm: "",
        useMethodQesitm: "",
        atpnWarnQesitm: "",
        atpnQesitm: "",
        intrcQesitm: "",
        seQesitm: "",
        depositMethodQesitm: "",
      };

      const mockResponse: MedicineResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: { items: [mockItem], pageNo: 1, totalCount: 1, numOfRows: 10 },
      };

      (fetchClient as Mock).mockResolvedValue(mockResponse);

      const result = await medicineApi.getMedicineList({
        query: "타이레놀",
        searchType: SearchType.MEDICINE,
      });

      expect(fetchClient).toHaveBeenCalledWith(
        expect.stringContaining(`itemName=${encodeURIComponent("타이레놀")}`)
      );

      expect(result).toEqual(mockResponse);
    });

    test("query가 없으면 null 반환", async () => {
      const result = await medicineApi.getMedicineList({
        query: "",
        searchType: SearchType.MEDICINE,
      });
      expect(result).toBeNull();
      expect(fetchClient).not.toHaveBeenCalled();
    });

    test("API 에러 시, FETCH_SEARCH_FAILED 에러", async () => {
      suppressConsoleError();

      (fetchClient as Mock).mockRejectedValue(new Error("API Error"));

      await expect(
        medicineApi.getMedicineList({
          query: "타이레놀",
          searchType: SearchType.MEDICINE,
        })
      ).rejects.toThrow(FETCH_SEARCH_FAILED);
    });
  });

  // 의약품 상세 정보 조회
  describe("getMedicineDetailBySeq", () => {
    const itemSeq = "12345";

    test("성공 시, 의약품 상세 정보 반환", async () => {
      const mockItem: MedicineItem = {
        itemSeq,
        itemName: "테스트약",
        entpName: "",
        efcyQesitm: "",
        useMethodQesitm: "",
        atpnWarnQesitm: "",
        atpnQesitm: "",
        intrcQesitm: "",
        seQesitm: "",
        depositMethodQesitm: "",
      };

      const mockResponse: MedicineResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: { items: [mockItem], totalCount: 1, pageNo: 1, numOfRows: 1 },
      };
      (fetchClient as Mock).mockResolvedValue(mockResponse);

      const result = await medicineApi.getMedicineDetailBySeq(itemSeq);

      expect(fetchClient).toHaveBeenCalledWith(
        expect.stringContaining(itemSeq)
      );
      expect(result).toEqual(mockItem);
    });

    test("itemSeq가 없으면 INVALID_CODE_ERROR 에러", async () => {
      await expect(medicineApi.getMedicineDetailBySeq("")).rejects.toThrow(
        INVALID_CODE_ERROR
      );
    });

    test("결과가 없으면 MEDICINE_NOT_FOUND 에러", async () => {
      suppressConsoleError();

      const mockResponse: MedicineResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: { items: [], totalCount: 0, pageNo: 1, numOfRows: 1 },
      };
      (fetchClient as Mock).mockResolvedValue(mockResponse);

      await expect(medicineApi.getMedicineDetailBySeq(itemSeq)).rejects.toThrow(
        MEDICINE_NOT_FOUND
      );
    });

    test("API 에러 시, FETCH_MEDICINE_DETAIL_FAILED 에러", async () => {
      suppressConsoleError();

      (fetchClient as Mock).mockRejectedValue(new Error("API Error"));
      await expect(medicineApi.getMedicineDetailBySeq(itemSeq)).rejects.toThrow(
        FETCH_MEDICINE_DETAIL_FAILED
      );
    });
  });

  // 효능 기반 의약품 리스트 조회
  describe("getMedicineDetailByEfficacy", () => {
    const efcyQesitm = "두통";

    test("성공 시, 동일 효능 의약품 리스트 반환", async () => {
      const mockResponse: MedicineResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: {
          items: [
            {
              itemName: "게보린",
              efcyQesitm,
              entpName: "",
              itemSeq: "",
              useMethodQesitm: "",
              atpnWarnQesitm: "",
              atpnQesitm: "",
              intrcQesitm: "",
              seQesitm: "",
              depositMethodQesitm: "",
            },
          ],
          totalCount: 1,
          pageNo: 1,
          numOfRows: 10,
        },
      };
      (fetchClient as Mock).mockResolvedValue(mockResponse);

      const result = await medicineApi.getMedicineDetailByEfficacy({
        efcyQesitm,
      });

      expect(fetchClient).toHaveBeenCalledWith(
        expect.stringContaining(`efcyQesitm=${encodeURIComponent(efcyQesitm)}`)
      );
      expect(result).toEqual(mockResponse);
    });

    test("efcyQesitm이 없으면 null 반환", async () => {
      const result = await medicineApi.getMedicineDetailByEfficacy({
        efcyQesitm: "",
      });
      expect(result).toBeNull();
    });

    test("결과가 없으면 null 반환", async () => {
      const mockResponse: MedicineResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: { items: [], totalCount: 0, pageNo: 1, numOfRows: 10 },
      };
      (fetchClient as Mock).mockResolvedValue(mockResponse);

      const result = await medicineApi.getMedicineDetailByEfficacy({
        efcyQesitm: "희귀병",
      });
      expect(result).toBeNull();
    });

    test("API 에러 시, FETCH_EFFICACY_FAILED 에러", async () => {
      suppressConsoleError();

      (fetchClient as Mock).mockRejectedValue(new Error("API Error"));
      await expect(
        medicineApi.getMedicineDetailByEfficacy({ efcyQesitm })
      ).rejects.toThrow(FETCH_EFFICACY_FAILED);
    });
  });

  // 의약품 주성분 상세 정보 조회
  describe("getMedicineIngredient", () => {
    const itemSeq = "54321";

    test("성공 시, 의약품 주성분 정보 반환", async () => {
      const mockItem: IngredientItem = {
        ITEM_SEQ: itemSeq,
        ITEM_NAME: "아세트아미노펜",
        ENTP_NAME: "",
        CHART: "",
        MATERIAL_NAME: "",
        INSERT_FILE: "",
        MAIN_ITEM_INGR: "",
        INGR_NAME: "",
        ITEM_ENG_NAME: "",
        MAIN_INGR_ENG: "",
      };

      const mockResponse: IngredientResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: { items: [mockItem], totalCount: 1, pageNo: 1, numOfRows: 1 },
      };

      (fetchClient as Mock).mockResolvedValue(mockResponse);

      const result = await medicineApi.getMedicineIngredient(itemSeq);

      expect(fetchClient).toHaveBeenCalledWith(
        expect.stringContaining(`item_seq=${itemSeq}`)
      );

      expect(result).toEqual(mockItem);
    });

    test("itemSeq가 없으면 null 반환", async () => {
      const result = await medicineApi.getMedicineIngredient("");

      expect(result).toBeNull();
      expect(fetchClient).not.toHaveBeenCalled();
    });

    test("결과가 없으면 null 반환", async () => {
      (fetchClient as Mock).mockResolvedValue({
        body: { items: [] },
      });
      const result = await medicineApi.getMedicineIngredient("12345");
      expect(result).toBeNull();
    });

    test("API 에러 시, FETCH_MEDICINE_INGREDIENTS_FAILED 에러", async () => {
      suppressConsoleError();

      (fetchClient as Mock).mockRejectedValue(new Error("API Error"));

      await expect(medicineApi.getMedicineIngredient(itemSeq)).rejects.toThrow(
        FETCH_MEDICINE_INGREDIENTS_FAILED
      );
    });
  });

  // 의약품 주성분으로 리스트 조회
  describe("getMedicineListByIngredient", () => {
    const item_ingr_name = "Acetaminophen";

    test("성공 시, 동일 성분 의약품 리스트 반환", async () => {
      const mockItem: MedicinePermissionItem = {
        BIZRNO: "1234567890",
        ITEM_SEQ: "1234567890",
        ITEM_NAME: "타이레놀",
        PRDUCT_TYPE: "약",
        PRDUCT_PRMISN_NO: "1234567890",
        ITEM_INGR_NAME: "Acetaminophen",
        ITEM_INGR_CNT: "500mg",
        BIG_PRDT_IMG_URL: "",
        ITEM_ENG_NAME: "",
        ENTP_NAME: "",
        PRDLST_STDR_CODE: "",
      };

      const mockResponse: MedicinePermissionResponse = {
        header: { resultCode: "00", resultMsg: "NORMAL SERVICE." },
        body: { items: [mockItem], totalCount: 1, pageNo: 1, numOfRows: 1 },
      };

      (fetchClient as Mock).mockResolvedValue(mockResponse);

      const result = await medicineApi.getMedicineListByIngredient({
        item_ingr_name,
      });

      expect(fetchClient).toHaveBeenCalledWith(
        expect.stringContaining(`item_ingr_name=${item_ingr_name}`)
      );
      expect(result).toEqual(mockResponse);
    });

    test("item_ingr_name이 없으면 null 반환", async () => {
      const result = await medicineApi.getMedicineListByIngredient({
        item_ingr_name: "",
      });
      expect(result).toBeNull();
      expect(fetchClient).not.toHaveBeenCalled();
    });

    test("API 에러 시, FETCH_INGREDIENT_FAILED 에러", async () => {
      suppressConsoleError();

      (fetchClient as Mock).mockRejectedValue(new Error("API Error"));
      await expect(
        medicineApi.getMedicineListByIngredient({ item_ingr_name })
      ).rejects.toThrow(FETCH_INGREDIENT_FAILED);
    });
  });
});
