import { NextRequest, NextResponse } from "next/server";
import { getMedicineDetailByEfficacy } from "@/lib/api/medicineApi";
import { FETCH_EFFICACY_FAILED } from "@/lib/constants/errors";
import { isPageNoValid } from "@/lib/utils/validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const efcyQesitm = searchParams.get("efcyQesitm") || "";
    const pageNo = searchParams.get("pageNo") || "1";

    if (!isPageNoValid(pageNo)) {
      console.error(
        "[API] 효능 데이터 조회 실패: pageNo가 유효하지 않습니다.",
        {
          pageNo,
        }
      );
      return NextResponse.json(
        {
          message: FETCH_EFFICACY_FAILED,
        },
        { status: 400 }
      );
    }

    if (!efcyQesitm.trim()) {
      console.error("[API] 효능 데이터 조회 실패: efcyQesitm 누락");
      return NextResponse.json(
        {
          message: FETCH_EFFICACY_FAILED,
        },
        { status: 400 }
      );
    }

    const data = await getMedicineDetailByEfficacy({ efcyQesitm, pageNo });
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : FETCH_EFFICACY_FAILED;

    return NextResponse.json(
      {
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
