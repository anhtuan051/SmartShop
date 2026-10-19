import React from 'react';
import { 
  ShoppingBag, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Heart,
  Sparkles
} from 'lucide-react';
import { CategoryType } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryType) => void;
  onOpenAi: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAi }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Store Brand */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Shop</span>
                </span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-purple-900 text-purple-300 rounded-md">VN</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SmartShop là điểm đến hàng đầu cho các thiết bị công nghệ hiện đại. Cung cấp điện thoại thông minh, laptop chuyên nghiệp, thiết bị âm thanh đỉnh cao cùng trợ lý tư vấn AI thông minh.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>

            <div>
              <button
                onClick={onOpenAi}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700/50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Mở Trợ lý AI Tư vấn</span>
              </button>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Danh Mục
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('phone')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Điện thoại thông minh
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('laptop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Laptop & Máy tính
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('audio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tai nghe & Âm thanh
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('accessories')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Phụ kiện công nghệ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-white transition-colors cursor-pointer text-purple-400"
                >
                  Tất cả sản phẩm →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies & Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-slate-300">Chính sách bảo hành 1 đổi 1 trong 30 ngày</li>
              <li className="hover:text-slate-300">Chính sách vận chuyển & giao hàng hỏa tốc</li>
              <li className="hover:text-slate-300">Chính sách bảo mật thông tin khách hàng</li>
              <li className="hover:text-slate-300">Hướng dẫn thanh toán & trả góp 0%</li>
              <li className="hover:text-slate-300">Tra cứu hóa đơn điện tử</li>
            </ul>
          </div>

          {/* Col 4: Contact & Demo Notice */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Thông Tin Liên Hệ
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Hotline: 0123456789 (8:00 - 21:30)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Email: tuandz@smartshop.vn</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Trụ sở: 66B Nguyễn Sỹ Sách, Phường 15, Quận Tân Bình, TP.HCM</span>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                Phương thức thanh toán hỗ trợ:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">COD</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">VietQR</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Visa / Master</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">MoMo</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & demo disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 SmartShop. Bản quyền thuộc về SmartShop Việt Nam.</p>
          <p className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Thiết kế bởi React & CSS</span>
            <span className="mx-1">•</span>
            <span className="text-purple-400 font-medium">Bản Demo Giao Diện Hoàn Chỉnh</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
