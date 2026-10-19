import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  Smartphone,
  Laptop,
  Headphones,
  Layers,
  ClipboardList
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CategoryType } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'products' | 'categories';
  setActiveTab: (tab: 'home' | 'products' | 'categories') => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAiChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onOpenAiChat
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const categories = [
    { id: 'phone', name: 'Điện thoại', icon: Smartphone },
    { id: 'laptop', name: 'Laptop', icon: Laptop },
    { id: 'audio', name: 'Tai nghe', icon: Headphones },
    { id: 'accessories', name: 'Phụ kiện', icon: Layers }
  ] as const;

  const handleSelectCategory = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setActiveTab('products');
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleNavClick = (tab: 'home' | 'products' | 'categories') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);

    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const handleShowOrders = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event('smartshop-show-orders'));
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Thanh thông báo */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white text-xs py-1.5 px-4 font-medium text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>
          Khai trương SmartShop: Nhập mã{' '}
          <strong className="text-amber-300 font-bold underline">SMART10</strong>{' '}
          giảm ngay 10% cho đơn hàng đầu tiên!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 focus:outline-hidden group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Shop</span>
                </span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 rounded-md">
                  VN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Công nghệ & Trợ lý thông minh
              </p>
            </div>
          </button>

          {/* Tìm kiếm desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm iPhone 16, MacBook, tai nghe Sony..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-sm text-slate-800 placeholder-slate-400 transition-all outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Menu desktop */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'text-blue-600 font-semibold bg-blue-50'
                  : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Trang chủ
            </button>

            <button
              onClick={() => handleNavClick('products')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'products' && selectedCategory === 'all'
                  ? 'text-blue-600 font-semibold bg-blue-50'
                  : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Sản phẩm
            </button>

            {/* Danh mục */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  categoryDropdownOpen || selectedCategory !== 'all'
                    ? 'text-blue-600 font-semibold bg-blue-50'
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>Danh mục</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {categoryDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleSelectCategory('all')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-slate-700 hover:text-blue-600"
                  >
                    Tất cả danh mục
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  {categories.map((cat) => {
                    const Icon = cat.icon;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id as CategoryType)}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 ${
                          selectedCategory === cat.id
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-purple-500" />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Trợ lý AI */}
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-purple-700 hover:bg-purple-50 group"
              title="Trợ lý AI tư vấn chọn mua sản phẩm"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Trợ lý AI</span>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">
                Demo
              </span>
            </button>
          </nav>

          {/* Tài khoản và giỏ hàng */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-sm font-medium"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-300"
                  />
                  <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Đang đăng nhập:</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    {/* Mục mới: Đơn hàng của tôi */}
                    <button
                      type="button"
                      onClick={handleShowOrders}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                    >
                      <ClipboardList className="w-4 h-4" />
                      <span>Đơn hàng của tôi</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 text-sm font-medium"
              >
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )}

            {/* Giỏ hàng */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-500/20"
              aria-label="Xem giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Giỏ hàng</span>

              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-blue-600 bg-white rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Nút menu điện thoại */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Mở menu di động"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Tìm kiếm mobile */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm điện thoại, laptop, phụ kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[10px] bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu điện thoại */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 text-center rounded-xl text-sm font-medium ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Trang chủ
            </button>

            <button
              onClick={() => handleNavClick('products')}
              className={`p-2.5 text-center rounded-xl text-sm font-medium ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Sản phẩm
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Danh mục thiết bị
            </p>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id as CategoryType)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-sm text-left ${
                      selectedCategory === cat.id
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-purple-600" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nút đơn hàng trên mobile */}
          {isAuthenticated && user && (
            <button
              type="button"
              onClick={handleShowOrders}
              className="w-full flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm"
            >
              <ClipboardList className="w-4 h-4" />
              Đơn hàng của tôi
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAiChat();
            }}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tư vấn mua sắm với Trợ lý AI</span>
          </button>

          {!isAuthenticated && (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="flex-1 py-2 text-center text-sm font-semibold border border-blue-600 text-blue-600 rounded-xl"
              >
                Đăng nhập
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="flex-1 py-2 text-center text-sm font-semibold bg-blue-600 text-white rounded-xl"
              >
                Đăng ký
              </button>
            </div>
          )}

          {isAuthenticated && user && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-600 font-semibold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          )}
        </div>
      )}
    </header>
  );
};