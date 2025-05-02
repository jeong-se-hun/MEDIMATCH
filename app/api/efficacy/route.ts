import { NextRequest, NextResponse } from "next/server";
import { getMedicineDetailByEfficacy } from "@/lib/api/medicineApi";
import { FETCH_EFFICACY_FAILED } from "@/lib/constants/errors";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const efcyQesitm = searchParams.get("efcyQesitm") || "";
    const pageNo = searchParams.get("pageNo") || "1";

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
