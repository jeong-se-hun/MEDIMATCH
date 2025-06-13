import { NextRequest, NextResponse } from "next/server";
import { getMedicineList } from "@/lib/api/medicineApi";
import {
  FETCH_SEARCH_FAILED,
  SEARCH_PARAMS_REQUIRED,
} from "@/lib/constants/errors";
import { SearchType } from "@/components/search/SearchForm";
import { isPageNoValid } from "@/lib/utils/validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const searchType = searchParams.get("searchType");
    const pageNo = searchParams.get("pageNo") || "1";

    if (!isPageNoValid(pageNo)) {
      console.error("[API] 검색 요청 실패: pageNo가 유효하지 않습니다.", {
        pageNo,
      });
      return NextResponse.json(
        {
          message: FETCH_SEARCH_FAILED,
        },
        { status: 400 }
      );
    }

    if (
      !query.trim() ||
      (searchType !== SearchType.MEDICINE && searchType !== SearchType.SYMPTOM)
    ) {
      console.error(
        "[API] 검색 요청 실패: 필수 파라미터 누락 또는 잘못된 검색 타입",
        { query, searchType }
      );
      return NextResponse.json(
        {
          message: SEARCH_PARAMS_REQUIRED,
        },
        { status: 400 }
      );
    }

    const data = await getMedicineList({
      query,
      searchType,
      pageNo,
    });

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : FETCH_SEARCH_FAILED;

    return NextResponse.json(
      {
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
