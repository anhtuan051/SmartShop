import React from 'react';
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Layers, 
  Sparkles,
  ArrowUpRight 
} from 'lucide-react';
import { CategoryType } from '../types';
import { CATEGORIES_LIST } from '../data/products';

interface CategorySectionProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      case 'Layers':
        return <Layers className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              Khám Phá Danh Mục
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sản Phẩm Công Nghệ Theo Nhu Cầu
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-0">
            Hàng chính hãng bảo hành tiêu chuẩn 12-24 tháng
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as CategoryType)}
                className={`group relative p-4 rounded-2xl text-left border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'bg-white text-slate-800 border-slate-100 hover:border-purple-200 hover:shadow-md'
                }`}
              >
                {/* Decorative background glow on hover */}
                <div
                  className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-xl transition-opacity duration-300 ${
                    isSelected
                      ? 'bg-white/20'
                      : 'bg-purple-100/50 group-hover:opacity-100 opacity-0'
                  }`}
                />

                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 group-hover:bg-purple-50 text-blue-600 group-hover:text-purple-600'
                    }`}
                  >
                    {getIcon(cat.icon)}
                  </div>
                  <ArrowUpRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      isSelected ? 'text-white/80' : 'text-slate-300 group-hover:text-purple-500'
                    }`}
                  />
                </div>

                <div className="relative z-10">
                  <h3
                    className={`font-bold text-sm sm:text-base leading-tight mb-1 ${
                      isSelected ? 'text-white' : 'text-slate-800 group-hover:text-blue-600'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p
                    className={`text-xs line-clamp-1 ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {cat.description}
                  </p>
                  <span
                    className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-purple-50 group-hover:text-purple-600'
                    }`}
                  >
                    {cat.count} sản phẩm
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
