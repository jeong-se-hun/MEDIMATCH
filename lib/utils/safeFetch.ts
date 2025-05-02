export async function safeFetch<T>(fetcher: () => Promise<T>) {
  try {
    const data = await fetcher();
    return { data, error: null };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { data: null, error: error };
    } else {
      return {
        data: null,
        error: new Error("오류가 발생했습니다 잠시 후 다시 시도해주세요."),
      };
    }
  }
}
