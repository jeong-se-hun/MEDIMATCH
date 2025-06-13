import { NextRequest, NextResponse } from "next/server";
import { getMedicineListByIngredient } from "@/lib/api/medicineApi";
import { FETCH_INGREDIENT_FAILED } from "@/lib/constants/errors";
import { isPageNoValid } from "@/lib/utils/validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const item_ingr_name = searchParams.get("item_ingr_name") || "";
    const pageNo = searchParams.get("pageNo") || "1";

    if (!isPageNoValid(pageNo)) {
      console.error(
        "[API] 성분 데이터 조회 실패: pageNo가 유효하지 않습니다.",
        {
          pageNo,
        }
      );
      return NextResponse.json(
        {
          message: FETCH_INGREDIENT_FAILED,
        },
        { status: 400 }
      );
    }

    if (!item_ingr_name.trim()) {
      console.error("[API] 성분 데이터 조회 실패: item_ingr_name 누락");
      return NextResponse.json(
        {
          message: FETCH_INGREDIENT_FAILED,
        },
        { status: 400 }
      );
    }

    const data = await getMedicineListByIngredient({
      item_ingr_name,
      pageNo,
    });

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : FETCH_INGREDIENT_FAILED;

    return NextResponse.json(
      {
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
