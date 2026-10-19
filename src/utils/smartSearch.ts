
import type { Product, CategoryType } from "../types";

export interface SmartSearchResult {
  products: Product[];
  message: string;
}

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();

export function smartSearch(
  query: string,
  products: Product[]
): SmartSearchResult {
  const normalized = normalizeText(query);

  if (!normalized) {
    return {
      products,
      message: "Hiển thị tất cả sản phẩm."
    };
  }

  let result = [...products];

  // 1. Lọc theo danh mục
  let category: CategoryType | null = null;

  if (
    /\b(dien thoai|smartphone|iphone|samsung galaxy|xiaomi|pixel)\b/.test(normalized)
  ) {
    category = "phone";
  } else if (
    /\b(laptop|may tinh xach tay|macbook|notebook|gaming|choi game)\b/.test(normalized)
  ) {
    category = "laptop";
  } else if (
    /\b(tai nghe|headphone|earphone|airpods|buds|loa)\b/.test(normalized)
  ) {
    category = "audio";
  } else if (
    /\b(phu kien|sac|cu sac|chuot|ban phim|power bank|pin du phong)\b/.test(normalized)
  ) {
    category = "accessories";
  }

  if (category) {
    result = result.filter(
      (product) => product.category === category
    );
  }

  // 2. Lọc theo thương hiệu
  const brands = [
    "apple",
    "samsung",
    "xiaomi",
    "google",
    "dell",
    "asus",
    "acer",
    "sony",
    "marshall",
    "anker",
    "logitech",
    "keychron",
    "ugreen"
  ];

  const matchedBrand = brands.find((brand) =>
    normalized.includes(brand)
  );

  if (matchedBrand) {
    result = result.filter(
      (product) =>
        normalizeText(product.brand).includes(matchedBrand) ||
        normalizeText(product.name).includes(matchedBrand)
    );
  }

  // 3. Lọc theo giá tối đa
  const priceMatch = normalized.match(
    /\b(duoi|nho hon|toi da|khong qua|tam gia)\s*(\d+(?:[.,]\d+)?)\s*(trieu|tr|nghin|ngan|k)?\b/
  );

  if (priceMatch) {
    const amount = Number(priceMatch[2].replace(",", "."));
    const unit = priceMatch[3];

    let maxPrice = amount;

    if (unit === "trieu" || unit === "tr") {
      maxPrice = amount * 1_000_000;
    } else if (unit === "nghin" || unit === "ngan" || unit === "k") {
      maxPrice = amount * 1_000;
    } else if (amount < 100_000) {
      maxPrice = amount * 1_000_000;
    }

    result = result.filter(
      (product) => product.price <= maxPrice
    );
  }

  // 4. Sắp xếp kết quả
  if (/\b(gia re|tiet kiem|binh dan|re)\b/.test(normalized)) {
    result.sort((a, b) => a.price - b.price);
  } else if (
    /\b(cao cap|tot nhat|manh nhat|hieu nang cao)\b/.test(normalized)
  ) {
    result.sort((a, b) => b.price - a.price);
  } else if (
    /\b(danh gia cao|rating cao|tot)\b/.test(normalized)
  ) {
    result.sort((a, b) => b.rating - a.rating);
  } else if (/\b(ban chay|bestseller)\b/.test(normalized)) {
    result.sort(
      (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller)
    );
  }

  return {
    products: result,
    message:
      result.length > 0
        ? `Tìm thấy ${result.length} sản phẩm phù hợp.`
        : "Không tìm thấy sản phẩm phù hợp. Thử đổi từ khóa hoặc mức giá nhé."
  };
}
