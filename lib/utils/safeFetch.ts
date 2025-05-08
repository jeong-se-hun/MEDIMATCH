import { GENERIC_ERROR_MESSAGE } from "@/lib/constants/errors";

export async function safeFetch<T>(fetcher: () => Promise<T>) {
  try {
    const data = await fetcher();
    return { data, error: null };
  } catch (error) {
    console.error("[safeFetch] 에러 발생:", error);
    if (error instanceof Error) {
      return { data: null, error: error };
    } else {
      return {
        data: null,
        error: new Error(GENERIC_ERROR_MESSAGE),
      };
    }
  }
}
