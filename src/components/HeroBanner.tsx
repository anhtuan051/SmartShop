import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  ArrowRight, 
  Sparkles, 
  Flame,
  Search
} from 'lucide-react';
import { CategoryType } from '../types';

interface HeroBannerProps {
  onShopNow: () => void;
  onSelectCategory: (cat: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAi: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopNow,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onOpenAi,
}) => {
  const hotKeywords = ['iPhone 16 Pro Max', 'MacBook Air M3', 'Sony WH-1000XM5', 'Sạc Anker 67W'];

  return (
    <div className="relative overflow-hidden pt-4 pb-8 sm:py-8">
      {/* Background soft blurs with purple and blue accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Subtle Grid / Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.25),transparent_50%)] pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-purple-200">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Mùa Mua Sắm Công Nghệ 2026 - Giảm Đến 30%</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
                Thiết Bị Đỉnh Cao <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300">
                  Trợ Lý Mua Sắm AI
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Chào mừng bạn đến với <strong>SmartShop</strong> - thiên đường công nghệ chính hãng. Khám phá điện thoại, laptop, tai nghe cao cấp với chính sách bảo hành 1 đổi 1 và trợ lý AI tư vấn tức thì.
              </p>

              {/* In-hero Search Box */}
              <div className="pt-2 max-w-lg">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm theo tên..."
                    className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:bg-white/15 transition-all"
                  />
                  <button
                    onClick={onShopNow}
                    className="absolute right-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Tìm kiếm
                  </button>
                </div>

                {/* Hot Keywords */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-slate-400">
                  <span className="text-slate-400">Gợi ý:</span>
                  {hotKeywords.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => {
                        setSearchQuery(kw);
                        onShopNow();
                      }}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 text-[11px] transition-colors cursor-pointer"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={onShopNow}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Khám phá sản phẩm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenAi}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 font-semibold text-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span>Nhờ AI tư vấn chọn mua</span>
                </button>
              </div>

            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative border frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl transform rotate-2 scale-95 opacity-60 blur-xs" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900 aspect-4/3">
                  <img
                    src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=900&auto=format&fit=crop"
                    alt="SmartShop Công Nghệ Hàng Đầu"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating product chip on image */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Thiết bị nổi bật tuần này</p>
                      <p className="text-sm font-bold truncate">iPhone 16 Pro Max & M3 Air</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg">
                      Sẵn hàng
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Trust Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">100% Chính Hãng</h4>
              <p className="text-[11px] text-slate-500">Bảo hành nhà sản xuất</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">Miễn Phí Vận Chuyển</h4>
              <p className="text-[11px] text-slate-500">Đơn hàng từ 500.000 ₫</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">Đổi Trả 30 Ngày</h4>
              <p className="text-[11px] text-slate-500">Lỗi 1 đổi 1 tận nơi</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">Hỗ Trợ 24/7 + AI</h4>
              <p className="text-[11px] text-slate-500">Tư vấn chuyên sâu tận tâm</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
