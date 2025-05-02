import { NextRequest, NextResponse } from "next/server";
import { getMedicineListByIngredient } from "@/lib/api/medicineApi";
import { FETCH_INGREDIENT_FAILED } from "@/lib/constants/errors";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const item_ingr_name = searchParams.get("item_ingr_name") || "";
    const pageNo = searchParams.get("pageNo") || "1";

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
