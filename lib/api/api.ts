const DEFAULT_REVALIDATE = 86400; // 24 * 60 * 60 (1일 초 단위)
const DEFAULT_CACHE: RequestCache = "force-cache";

// API 요청을 위한 범용 fetch 래퍼
export default async function fetchClient<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      next: { revalidate: DEFAULT_REVALIDATE },
      cache: DEFAULT_CACHE,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}
