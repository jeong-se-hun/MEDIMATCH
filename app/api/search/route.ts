import { NextRequest, NextResponse } from "next/server";
import { getMedicineList } from "@/lib/api/medicineApi";
import {
  FETCH_SEARCH_FAILED,
  SEARCH_PARAMS_REQUIRED,
} from "@/lib/constants/errors";
import { SearchType } from "@/components/search/SearchForm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const searchType = searchParams.get("searchType");
    const pageNo = searchParams.get("pageNo") || "1";

    if (
      !query ||
      (searchType !== SearchType.MEDICINE && searchType !== SearchType.SYMPTOM)
    ) {
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
