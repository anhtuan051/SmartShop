
import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  Banknote,
  AlertCircle,
  Copy
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatVND } from '../utils/format';
import { OrderData } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    items,
    subtotal,
    discount,
    shipping,
    total,
    clearCart,
    showToast
  } = useCart();

  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'card'>('cod');
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      showToast(
        'Vui lòng điền đủ Họ tên, Số điện thoại và Địa chỉ giao hàng',
        'error'
      );
      return;
    }

    if (items.length === 0) {
      showToast('Giỏ hàng đang trống!', 'error');
      return;
    }

    const orderId =
      'SS' + Math.floor(100000 + Math.random() * 900000);

    const orderData: OrderData = {
      orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'khachhang@smartshop.vn',
      address: address.trim(),
      paymentMethod:
        paymentMethod === 'cod'
          ? 'Thanh toán khi nhận hàng (COD)'
          : paymentMethod === 'bank'
          ? 'Chuyển khoản ngân hàng (QR Code)'
          : 'Thẻ ATM / Thẻ quốc tế Visa/Mastercard',
      items: [...items],
      subtotal,
      discount,
      shipping,
      total,
      date: new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      const savedOrders = localStorage.getItem('smartshop_orders');
      let orders: OrderData[] = [];

      if (savedOrders) {
        const parsed: unknown = JSON.parse(savedOrders);

        if (Array.isArray(parsed)) {
          orders = parsed as OrderData[];
        }
      }

      // Lưu đơn hàng mới lên đầu danh sách
      orders.unshift(orderData);

      localStorage.setItem(
        'smartshop_orders',
        JSON.stringify(orders)
      );

      // Thông báo cho App.tsx cập nhật lịch sử đơn hàng
      window.dispatchEvent(
        new Event('smartshop-orders-updated')
      );

      setCompletedOrder(orderData);
      setIsSuccess(true);
      clearCart();

      showToast('Đặt hàng thành công!', 'success');
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);

      showToast(
        'Không thể lưu đơn hàng. Vui lòng thử lại!',
        'error'
      );
    }
  };

  const copyOrderId = () => {
    if (!completedOrder) return;

    if (!navigator.clipboard) {
      showToast(
        `Mã đơn hàng: ${completedOrder.orderId}`,
        'info'
      );
      return;
    }

    navigator.clipboard
      .writeText(completedOrder.orderId)
      .then(() => {
        showToast(
          `Đã sao chép mã đơn hàng: ${completedOrder.orderId}`,
          'success'
        );
      })
      .catch(() => {
        showToast(
          `Mã đơn hàng: ${completedOrder.orderId}`,
          'info'
        );
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:px-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {isSuccess
                ? 'Đặt Hàng Thành Công'
                : 'Thanh Toán Đơn Hàng'}
            </h2>

            <p className="text-xs text-slate-400">
              {isSuccess
                ? 'Cảm ơn bạn đã trải nghiệm SmartShop'
                : 'Vui lòng kiểm tra thông tin giao hàng'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {!isSuccess ? (
            <form onSubmit={handleSubmitOrder} className="space-y-6">

              {/* Order items recap */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Sản phẩm trong giỏ ({items.length})</span>
                  <span>Tổng: {formatVND(total)}</span>
                </div>

                <div className="max-h-28 overflow-y-auto divide-y divide-slate-100 pr-1">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-1.5 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-600 truncate max-w-[280px]">
                        {item.quantity}x {item.product.name}
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatVND(
                          item.product.price * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Thông tin người nhận
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ và tên *
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số điện thoại *
                    </label>

                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email nhận thông báo
                  </label>

                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa chỉ nhận hàng chi tiết *
                  </label>

                  <textarea
                    rows={2}
                    required
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ghi chú giao hàng (nếu có)
                  </label>

                  <input
                    type="text"
                    placeholder="Giao giờ hành chính, gọi trước khi đến..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Phương thức thanh toán
                </h3>

                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-blue-600 focus:ring-blue-500"
                    />

                    <Banknote className="w-5 h-5 text-emerald-600" />

                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">
                        Thanh toán tiền mặt khi nhận hàng (COD)
                      </p>

                      <p className="text-[11px] text-slate-500">
                        Kiểm tra hàng trước khi thanh toán
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="text-blue-600 focus:ring-blue-500"
                    />

                    <CreditCard className="w-5 h-5 text-blue-600" />

                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">
                        Chuyển khoản ngân hàng (VietQR)
                      </p>

                      <p className="text-[11px] text-slate-500">
                        Quét mã QR chuyển khoản 24/7 tức thì
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính:</span>
                  <span>{formatVND(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Mã giảm giá ưu đãi:</span>
                    <span>-{formatVND(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển:</span>

                  <span>
                    {shipping === 0 ? (
                      <strong className="text-emerald-600">
                        Miễn phí
                      </strong>
                    ) : (
                      formatVND(shipping)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>Tổng tiền thanh toán:</span>

                  <span className="text-lg text-blue-600">
                    {formatVND(total)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all cursor-pointer"
              >
                Xác Nhận Đặt Hàng ({formatVND(total)})
              </button>
            </form>
          ) : (
            completedOrder && (
              /* Order Success Receipt */
              <div className="text-center py-4 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Cảm Ơn Bạn Đã Mua Sắm!
                  </h3>

                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Đơn hàng của bạn đã được ghi nhận trên hệ thống demo
                    của SmartShop.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-3 text-xs max-w-md mx-auto">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500">
                      Mã đơn hàng:
                    </span>

                    <button
                      type="button"
                      onClick={copyOrderId}
                      className="flex items-center gap-1 font-bold text-blue-600 hover:underline"
                    >
                      <span>{completedOrder.orderId}</span>
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Khách hàng:</span>
                    <span className="font-semibold text-slate-800">
                      {completedOrder.customerName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Số điện thoại:</span>
                    <span className="font-semibold text-slate-800">
                      {completedOrder.phone}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Địa chỉ giao:</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">
                      {completedOrder.address}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Thanh toán:</span>
                    <span className="font-semibold text-slate-800">
                      {completedOrder.paymentMethod}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Tổng tiền:</span>

                    <span className="text-blue-600">
                      {formatVND(completedOrder.total)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Tiếp Tục Mua Sắm
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
