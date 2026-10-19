import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Flame,
  Search,
  ArrowUpDown,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import type { Product, CategoryType } from "./types";
import { SAMPLE_PRODUCTS, CATEGORIES_LIST } from "./data/products";
import { smartSearch } from "./utils/smartSearch";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { CategorySection } from "./components/CategorySection";
import { ProductCard } from "./components/ProductCard";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer } from "./components/CartDrawer";
import { AuthModal } from "./components/AuthModal";
import { AiAssistantModal } from "./components/AiAssistantModal";
import { OrderHistoryModal } from "./components/OrderHistoryModal";
import { Footer } from "./components/Footer";
import { Toast } from "./components/Toast";

const MAX_PRICE_DEFAULT = 60_000_000;

const MainShop: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "home" | "products" | "categories"
  >("home");

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "rating"
  >("default");

  const [maxPrice, setMaxPrice] = useState<number>(
    MAX_PRICE_DEFAULT
  );

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Trạng thái mở cửa sổ lịch sử đơn hàng.
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] =
    useState(false);

  // Nhận sự kiện khi người dùng bấm "Đơn hàng của tôi"
  // trong Navbar.tsx.
  useEffect(() => {
    const handleShowOrders = () => {
      setIsOrderHistoryOpen(true);
    };

    window.addEventListener(
      "smartshop-show-orders",
      handleShowOrders
    );

    return () => {
      window.removeEventListener(
        "smartshop-show-orders",
        handleShowOrders
      );
    };
  }, []);

  // Tìm kiếm sản phẩm.
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory("all");
    setActiveTab("products");
  };

  // Lọc sản phẩm theo từ khóa, danh mục, giá và sắp xếp.
  const filteredProducts = useMemo(() => {
    const searchResult = smartSearch(
      searchQuery,
      SAMPLE_PRODUCTS
    );

    const filtered = searchResult.products.filter((product) => {
      const matchCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const matchPrice = product.price <= maxPrice;

      return matchCategory && matchPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }

      if (sortBy === "price-desc") {
        return b.price - a.price;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return 0;
    });
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  // Sản phẩm nổi bật trên trang chủ.
  const featuredProducts = useMemo(
    () =>
      SAMPLE_PRODUCTS.filter(
        (product) => product.isFeatured || product.isBestSeller
      ).slice(0, 4),
    []
  );

  const handleShopNow = () => {
    setActiveTab("products");

    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 0);
  };

  const handleSelectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setActiveTab("products");
    handleShopNow();
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("default");
    setMaxPrice(MAX_PRICE_DEFAULT);
    setActiveTab("products");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-purple-100 selection:text-purple-900">
      {/* Thanh điều hướng */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        onOpenAiChat={() => setIsAiModalOpen(true)}
      />

      <main className="flex-1">
        {/* Trang chủ */}
        {activeTab === "home" && (
          <>
            <HeroBanner
              onShopNow={handleShopNow}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              setSearchQuery={handleSearchChange}
              onOpenAi={() => setIsAiModalOpen(true)}
            />

            <CategorySection
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Sản phẩm nổi bật */}
            <section className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                        Sản Phẩm Nổi Bật Nhất
                      </h2>
                      <p className="text-xs text-slate-500">
                        Được khách hàng SmartShop tin chọn nhiều nhất
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleShopNow}
                    className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Xem tất cả</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(item) =>
                        setSelectedProduct(item)
                      }
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Banner trợ lý AI */}
            <section className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white p-6 sm:p-10 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="relative z-10 max-w-xl space-y-2 text-center md:text-left">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider inline-block">
                      ⚡ Ưu Đãi Mở Bán
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Bạn Chưa Biết Chọn Thiết Bị Nào Phù Hợp?
                    </h3>

                    <p className="text-xs sm:text-sm text-purple-100">
                      Nhập nhu cầu và ngân sách để trải nghiệm
                      Trợ lý AI SmartShop và tìm sản phẩm phù hợp.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="relative z-10 px-6 py-3.5 rounded-2xl bg-white text-purple-700 hover:bg-purple-50 font-extrabold text-sm shadow-xl flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Thử Ngay Trợ Lý AI</span>
                  </button>

                  <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Danh sách sản phẩm */}
        <section
          id="products-section"
          className="py-8 scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bộ lọc */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Danh Sách Sản Phẩm
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Hiển thị{" "}
                    <strong>{filteredProducts.length}</strong>{" "}
                    sản phẩm
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />

                  <label
                    htmlFor="sort-products"
                    className="text-xs font-semibold text-slate-600"
                  >
                    Sắp xếp:
                  </label>

                  <select
                    id="sort-products"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value as
                          | "default"
                          | "price-asc"
                          | "price-desc"
                          | "rating"
                      )
                    }
                    className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
                  >
                    <option value="default">Mặc định</option>
                    <option value="price-asc">
                      Giá: Thấp đến Cao
                    </option>
                    <option value="price-desc">
                      Giá: Cao đến Thấp
                    </option>
                    <option value="rating">
                      Đánh giá cao nhất
                    </option>
                  </select>
                </div>
              </div>

              {/* Danh mục */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {CATEGORIES_LIST.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        setSelectedCategory(
                          category.id as CategoryType
                        )
                      }
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {(selectedCategory !== "all" ||
                  searchQuery !== "" ||
                  sortBy !== "default" ||
                  maxPrice !== MAX_PRICE_DEFAULT) && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Đặt lại bộ lọc</span>
                  </button>
                )}
              </div>

              {/* Từ khóa đang tìm */}
              {searchQuery && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-600">
                  <span>
                    Kết quả cho:{" "}
                    <strong>"{searchQuery}"</strong>
                  </span>

                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              )}

              {/* Lọc theo giá */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label
                    htmlFor="max-price"
                    className="text-xs font-semibold text-slate-600"
                  >
                    Giá tối đa
                  </label>

                  <span className="text-xs font-bold text-blue-600">
                    {maxPrice.toLocaleString("vi-VN")} ₫
                  </span>
                </div>

                <input
                  id="max-price"
                  type="range"
                  min={1_000_000}
                  max={MAX_PRICE_DEFAULT}
                  step={500_000}
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(Number(event.target.value))
                  }
                  className="w-full accent-blue-600"
                />

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>1 triệu</span>
                  <span>60 triệu</span>
                </div>
              </div>
            </div>

            {/* Kết quả sản phẩm */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={(item) =>
                      setSelectedProduct(item)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Không tìm thấy sản phẩm nào
                  </h3>

                  <p className="text-xs text-slate-500 mt-2">
                    Thử đổi từ khóa, chọn danh mục khác hoặc
                    tăng mức giá tối đa.
                  </p>
                </div>

                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Nút mở trợ lý AI */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiModalOpen(true)}
          aria-label="Mở Trợ lý AI SmartShop"
          className="group relative flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-full shadow-xl hover:scale-105 transition-transform border border-white/20"
        >
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 blur-md pointer-events-none" />

          <span className="relative flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-xs sm:text-sm">
              Trợ Lý AI
            </span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
              Demo
            </span>
          </span>
        </button>
      </div>

      {/* Các cửa sổ chức năng */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer />

      <AuthModal />

      {/* Lịch sử đơn hàng */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onViewProductDetails={(product) =>
          setSelectedProduct(product)
        }
      />

      <Toast />

      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenAi={() => setIsAiModalOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainShop />
      </CartProvider>
    </AuthProvider>
  );
}