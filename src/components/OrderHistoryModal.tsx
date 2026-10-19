
import React, { useEffect, useState } from 'react';
import { X, Package, ClipboardList } from 'lucide-react';
import type { OrderData } from '../types';
import { formatVND } from '../utils/format';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [orders, setOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const loadOrders = () => {
      try {
        const saved = localStorage.getItem('smartshop_orders');
        const parsed: unknown = saved ? JSON.parse(saved) : [];
        setOrders(Array.isArray(parsed) ? parsed as OrderData[] : []);
      } catch (error) {
        console.error('Không thể đọc lịch sử đơn hàng:', error);
        setOrders([]);
      }
    };

    loadOrders();

    window.addEventListener('smartshop-orders-updated', loadOrders);
    return () => {
      window.removeEventListener('smartshop-orders-updated', loadOrders);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Đơn hàng của tôi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Lịch sử đơn hàng trên thiết bị này
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
            aria-label="Đóng lịch sử đơn hàng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5">
          {orders.length === 0 ? (
            <div className="py-10 text-center">
              <ClipboardList className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <h3 className="font-bold text-slate-800">
                Chưa có đơn hàng
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Đặt hàng thành công, đơn hàng sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            orders.map((order, index) => (
              <div
                key={order.orderId || index}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-3">
                  <div>
                    <p className="font-bold text-blue-700">
                      Mã đơn: {order.orderId}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.date}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Đã ghi nhận
                  </span>
                </div>

                <div className="space-y-2 py-3">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={`${item.product.id}-${itemIndex}`}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="flex items-center gap-2 text-slate-700">
                        <Package className="h-4 w-4 shrink-0 text-slate-400" />
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="shrink-0 font-medium">
                        {formatVND(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 text-sm">
                  <p className="text-slate-600">
                    Người nhận: {order.customerName}
                  </p>
                  <p className="mt-1 text-slate-600">
                    Địa chỉ: {order.address}
                  </p>
                  <p className="mt-1 text-slate-600">
                    Thanh toán: {order.paymentMethod}
                  </p>
                  <div className="mt-3 flex justify-between font-bold">
                    <span>Tổng tiền</span>
                    <span className="text-blue-700">
                      {formatVND(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
