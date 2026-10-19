import React from 'react';
import { ShoppingCart, Eye, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { formatVND } from '../utils/format';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart, items } = useCart();

  const isAlreadyInCart = items.some((item) => item.product.id === product.id);

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl hover:border-purple-200/80 transition-all duration-300">
      
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-50 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges on top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-rose-500 text-white font-bold text-[11px] shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white font-bold text-[10px] tracking-wide uppercase shadow-sm">
              Bán chạy
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-lg bg-purple-600 text-white font-bold text-[10px] tracking-wide uppercase shadow-sm">
              Mới
            </span>
          )}
        </div>

        {/* Quick view button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-700 hover:text-blue-600 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
          title="Xem nhanh chi tiết"
          aria-label="Xem chi tiết sản phẩm"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Brand pill */}
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 shadow-xs">
          {product.brand}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Rating and category */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
          <span className="text-purple-600 font-semibold tracking-wide text-[11px]">
            {product.categoryName}
          </span>
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="font-bold text-slate-800 text-sm leading-snug hover:text-blue-600 transition-colors line-clamp-2 min-h-10 cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mt-2 mb-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-extrabold text-blue-600">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Key highlight specs tag preview */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 text-xs font-semibold transition-all text-center cursor-pointer"
          >
            Xem chi tiết
          </button>

          <button
            onClick={() => addToCart(product, 1)}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs transition-all duration-200 active:scale-95 cursor-pointer shadow-xs ${
              isAlreadyInCart
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
            }`}
            title="Thêm vào giỏ hàng"
          >
            {isAlreadyInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã thêm</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Mua ngay</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};
