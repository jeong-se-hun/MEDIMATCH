export function isPageNoValid(pageNoString: string): boolean {
  const pageNo = parseInt(pageNoString, 10);
  return !isNaN(pageNo) && pageNo >= 1;
}
