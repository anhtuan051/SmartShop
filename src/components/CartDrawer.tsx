import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatVND } from '../utils/format';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    discount, 
    shipping, 
    total,
    promoCode,
    applyPromoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode);
      setInputCode('');
    }
  };

  const freeShippingThreshold = 500000;
  const progressToFreeShip = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      >
        <div 
          className="fixed inset-y-0 right-0 max-w-full flex pl-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Giỏ Hàng Của Bạn ({items.length})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Đóng giỏ hàng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress bar */}
            <div className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-100 text-xs">
              {remainingForFreeShip > 0 ? (
                <div>
                  <p className="text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Mua thêm <strong className="text-blue-600">{formatVND(remainingForFreeShip)}</strong> để nhận Miễn phí giao hàng</span>
                  </p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressToFreeShip}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Chúc mừng! Bạn đã được Miễn phí giao hàng toàn quốc</span>
                </p>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-700">Giỏ hàng đang trống</h3>
                    <p className="text-xs text-slate-400 mt-1">Hãy thêm sản phẩm công nghệ bạn yêu thích vào giỏ nhé!</p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:shadow-md transition-all cursor-pointer"
                  >
                    Tiếp tục khám phá
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all shadow-xs"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-18 h-18 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-slate-300 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-[11px] text-purple-600 font-semibold">
                            {formatVND(item.product.price)}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-white text-slate-600 rounded-l-md transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-white text-slate-600 rounded-r-md transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-slate-900">
                            {formatVND(item.product.price * item.quantity)}
                          </span>
                        </div>

                      </div>
                    </div>
                  ))}

                  {/* Clear cart action */}
                  <div className="text-right pt-1">
                    <button
                      onClick={clearCart}
                      className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors underline cursor-pointer"
                    >
                      Xóa tất cả ({items.length} món)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 space-y-4">
                
                {/* Promo Code Form */}
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Mã giảm giá (Thử: SMART10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </form>

                {promoCode && (
                  <div className="flex items-center justify-between text-[11px] bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-200">
                    <span>Mã đang dùng: <strong>{promoCode}</strong></span>
                    <span className="font-bold">Đã giảm {formatVND(discount)}</span>
                  </div>
                )}

                {/* Calculation breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="font-medium text-slate-800">{formatVND(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Giảm giá</span>
                      <span>-{formatVND(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Phí giao hàng</span>
                    <span>{shipping === 0 ? <strong className="text-emerald-600">Miễn phí</strong> : formatVND(shipping)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                    <span>Tổng tiền thanh toán</span>
                    <span className="text-base sm:text-lg text-blue-600">{formatVND(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Tiến Hành Đặt Hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(false);
        }}
      />
    </>
  );
};
