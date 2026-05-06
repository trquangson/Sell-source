/**
 * Helper phân trang (Pagination Utility).
 * Tái sử dụng ở bất kỳ đâu cần chia mảng dữ liệu thành từng trang.
 */

/** Số sản phẩm tối đa mỗi trang */
export const ITEMS_PER_PAGE = 6;

/**
 * Lấy dữ liệu của trang hiện tại từ một mảng.
 *
 * @param {Array}  items       - Mảng dữ liệu đầy đủ
 * @param {number} currentPage - Trang hiện tại (bắt đầu từ 1)
 * @param {number} [perPage]   - Số item mỗi trang (mặc định: ITEMS_PER_PAGE)
 * @returns {Array} Mảng con của trang đang hiển thị
 */
export function paginate(items, currentPage, perPage = ITEMS_PER_PAGE) {
  const startIndex = (currentPage - 1) * perPage;
  return items.slice(startIndex, startIndex + perPage);
}

/**
 * Tính tổng số trang.
 *
 * @param {number} totalItems  - Tổng số item
 * @param {number} [perPage]   - Số item mỗi trang (mặc định: ITEMS_PER_PAGE)
 * @returns {number} Tổng số trang
 */
export function getTotalPages(totalItems, perPage = ITEMS_PER_PAGE) {
  return Math.ceil(totalItems / perPage);
}
