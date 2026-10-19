import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  Check, 
  Share2 
} from 'lucide-react';
import { Product } from '../types';
import { formatVND } from '../utils/format';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, showToast } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  if (!product) return null;

  const images = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Xem sản phẩm ${product.name} tại SmartShop`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Chia sẻ sản phẩm"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left: Gallery Images */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <img
                  src={images[selectedImageIndex] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {product.discountPercent && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-rose-500 text-white font-bold text-xs rounded-lg shadow-sm">
                    Tiết kiệm {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-blue-600 ring-2 ring-blue-100'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-slate-600">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">Chính hãng 100%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold">Giao nhanh toàn quốc</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold">30 ngày đổi mới</span>
                </div>
              </div>
            </div>

            {/* Right: Details & Purchase */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                
                {/* Category and brand */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md">
                    {product.categoryName}
                  </span>
                  <span className="text-xs font-medium text-slate-400">• Thương hiệu {product.brand}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-4 my-3 text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-700 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-amber-500/80 font-normal">({product.reviewCount} đánh giá)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Còn hàng tại SmartShop</span>
                  </div>
                </div>

                {/* Price block */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-purple-50/60 border border-blue-100/80 my-4">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-blue-600">
                      {formatVND(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatVND(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Đã bao gồm thuế VAT 10% và miễn phí vận chuyển cho đơn hàng này
                  </p>
                </div>

                {/* Switchable Tabs: Description vs Specs */}
                <div className="flex border-b border-slate-200 mb-3">
                  <button
                    onClick={() => setActiveTab('desc')}
                    className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'desc'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Đặc điểm nổi bật
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'specs'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Thông số kỹ thuật
                  </button>
                </div>

                {activeTab === 'desc' ? (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {product.description}
                    </p>
                    <ul className="space-y-1.5">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {Object.entries(product.specs).map(([label, val]) => (
                      <div key={label} className="grid grid-cols-5 py-1.5 border-b border-slate-100">
                        <span className="col-span-2 font-semibold text-slate-500">{label}:</span>
                        <span className="col-span-3 text-slate-800 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Quantity selector and Add to Cart action */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  {/* Quantity picker */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors cursor-pointer"
                      title="Giảm số lượng"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors cursor-pointer"
                      title="Tăng số lượng"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm vào giỏ - {formatVND(product.price * quantity)}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
