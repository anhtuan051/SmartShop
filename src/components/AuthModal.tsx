import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login } = useAuth();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Vui lòng nhập email và mật khẩu!', 'error');
      return;
    }

    if (authMode === 'register' && !fullName.trim()) {
      showToast('Vui lòng nhập họ và tên!', 'error');
      return;
    }

    login(email, fullName);
    showToast(
      authMode === 'login'
        ? `Đăng nhập thành công! Chào mừng ${fullName || email.split('@')[0]}`
        : `Đăng ký thành công! Chào mừng ${fullName} đến với SmartShop`,
      'success'
    );
  };

  const handleQuickDemoFill = () => {
    setEmail('khachhang.demo@smartshop.vn');
    setPassword('SmartShop@2026');
    setFullName('Nguyễn Tuấn Anh');
    setPhone('0912 888 999');
    showToast('Đã điền thông tin tài khoản mẫu!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="relative p-6 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Smart<span className="text-purple-300">Shop</span> ID
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Đăng nhập để nhận ưu đãi thành viên và theo dõi đơn hàng
          </p>

          {/* Switcher Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-5">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Đăng Ký
            </button>
          </div>
        </div>

        {/* Demo Warning Pill */}
        <div className="bg-amber-50 border-b border-amber-100 px-5 py-2.5 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Giao diện thử nghiệm (Demo) - Chưa có backend DB</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-[11px] font-bold text-amber-900 underline hover:text-amber-700"
          >
            Điền mẫu
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Địa chỉ Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="tenban@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Mật khẩu *
              </label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => showToast('Chức năng cấp lại mật khẩu demo!', 'info')}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
          >
            {authMode === 'login' ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản Mới'}
          </button>

          {/* Social login mock */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-2 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Hoặc tiếp tục với
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                login('google.user@gmail.com', 'Google Demo User');
                showToast('Đăng nhập bằng Google Demo thành công!', 'success');
              }}
              className="py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="font-bold text-red-500">G</span>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                login('apple.user@icloud.com', 'Apple Demo User');
                showToast('Đăng nhập bằng Apple ID Demo thành công!', 'success');
              }}
              className="py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="font-bold text-slate-900"></span>
              <span>Apple ID</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
