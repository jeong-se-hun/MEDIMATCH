import { NextRequest, NextResponse } from "next/server";
import { getMedicineDetailByEfficacy } from "@/lib/api/medicineApi";
import { FETCH_EFFICACY_FAILED } from "@/lib/constants/errors";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const efcyQesitm = searchParams.get("efcyQesitm") || "";
    const pageNo = searchParams.get("pageNo") || "1";

    if (!efcyQesitm.trim()) {
      console.error(`API 호출 실패: efcyQesitm 값 누락`);
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
