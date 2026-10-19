
import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  AlertCircle,
  ShoppingCart,
  Eye,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import { Product, ChatMessage } from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';
import { formatVND } from '../utils/format';
import { useCart } from '../context/CartContext';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProductDetails: (product: Product) => void;
}

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    laptop: 'laptop',
    phone: 'điện thoại',
    audio: 'tai nghe và âm thanh',
    accessories: 'phụ kiện',
  };

  return names[category] || category;
};

const generateSmartReply = (
  userQuery: string
): { reply: string; products: Product[] } => {
  const q = normalizeText(userQuery);
  let candidates = [...SAMPLE_PRODUCTS];

  // Xác định danh mục người dùng muốn tìm
  let category = '';

  if (
    /\b(laptop|macbook)\b/.test(q) ||
    q.includes('may tinh') ||
    q.includes('van phong')
  ) {
    category = 'laptop';
  } else if (
    q.includes('dien thoai') ||
    q.includes('iphone') ||
    q.includes('samsung') ||
    q.includes('chup anh')
  ) {
    category = 'phone';
  } else if (
    q.includes('tai nghe') ||
    q.includes('chong on') ||
    q.includes('am thanh') ||
    q.includes('airpods') ||
    q.includes('sony')
  ) {
    category = 'audio';
  } else if (
    q.includes('phu kien') ||
    q.includes('sac nhanh') ||
    q.includes('chuot') ||
    q.includes('ban phim')
  ) {
    category = 'accessories';
  }

  if (category) {
    candidates = candidates.filter(
      (p) => normalizeText(p.category) === category
    );
  }

  // Nhận biết ngân sách, ví dụ: 5 triệu, 15 triệu, 20tr
  const budgetMatch = q.match(
    /(\d+(?:[.,]\d+)?)\s*(trieu|tr|m)\b/
  );

  let budget: number | null = null;

  if (budgetMatch) {
    budget =
      Number(budgetMatch[1].replace(',', '.')) * 1_000_000;
  }

  if (
    budget !== null &&
    (q.includes('duoi') ||
      q.includes('toi da') ||
      q.includes('khong qua') ||
      q.includes('tam') ||
      q.includes('khoang') ||
      q.includes('trong tam'))
  ) {
    candidates = candidates.filter((p) => p.price <= budget!);
  }

  // Nếu người dùng nói rõ tên sản phẩm, ưu tiên tên đó
  const productMatches = candidates
    .map((product) => {
      const name = normalizeText(product.name);
      let score = 0;

      const words = q
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length >= 2);

      for (const word of words) {
        if (name.includes(word)) score += 3;
      }

      if (product.isBestSeller) score += 1;
      if (product.isFeatured) score += 1;

      return { product, score };
    })
    .sort((a, b) => b.score - a.score);

  let matched: Product[] = [];

  const isBestSellerQuery =
    q.includes('ban chay') ||
    q.includes('noi bat') ||
    q.includes('hot');

  if (isBestSellerQuery) {
    matched = candidates.filter(
      (p) => p.isBestSeller || p.isFeatured
    );
  } else {
    matched = productMatches
      .filter((item) => item.score > 1)
      .map((item) => item.product);
  }

  // Nếu không khớp tên cụ thể, gợi ý sản phẩm trong danh mục
  if (matched.length === 0 && candidates.length > 0) {
    matched = [...candidates].sort((a, b) => {
      const scoreA =
        (a.isBestSeller ? 1 : 0) + (a.isFeatured ? 1 : 0);
      const scoreB =
        (b.isBestSeller ? 1 : 0) + (b.isFeatured ? 1 : 0);

      return scoreB - scoreA;
    });
  }

  matched = matched.slice(0, 3);

  let reply: string;

  if (matched.length === 0) {
    reply =
      'Mình chưa tìm thấy sản phẩm phù hợp trong danh sách hiện có. ' +
      'Bạn thử đổi danh mục hoặc điều chỉnh ngân sách nhé.';
  } else if (isBestSellerQuery) {
    reply =
      'Đây là những sản phẩm nổi bật trong dữ liệu SmartShop. ' +
      'Bạn có thể xem giá và thông tin chi tiết bên dưới nhé:';
  } else if (budget !== null) {
    reply =
      `Mình tìm được ${matched.length} sản phẩm phù hợp với bộ lọc hiện tại. ` +
      'Bạn hãy xem giá từng sản phẩm bên dưới nhé:';
  } else if (category) {
    reply =
      `Đây là những sản phẩm ${getCategoryName(category)} ` +
      'phù hợp nhất mình tìm được trong SmartShop:';
  } else {
    reply =
      'Mình đã tìm trong danh sách sản phẩm SmartShop. ' +
      'Đây là những lựa chọn gần với yêu cầu của bạn nhất:';
  }

  return { reply, products: matched };
};

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onViewProductDetails,
}) => {
  const { addToCart } = useCart();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text:
        'Xin chào! Em là Trợ lý SmartShop. ' +
        'Em có thể giúp anh/chị tìm sản phẩm theo danh mục, tên và ngân sách. ' +
        'Anh/chị đang quan tâm đến sản phẩm nào ạ?',
      timestamp: 'Vừa xong',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Laptop học tập dưới 20 triệu',
    'Điện thoại chụp ảnh đẹp',
    'Tai nghe chống ồn',
    'Phụ kiện sạc nhanh',
    'Tìm sản phẩm bán chạy',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? input).trim();

    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Tìm kiếm cục bộ, không gọi API và không phát sinh phí API
    window.setTimeout(() => {
      const { reply, products } = generateSmartReply(text);

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        recommendedProducts: products,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text:
          'Em đã sẵn sàng! Anh/chị muốn tìm sản phẩm nào, ' +
          'thuộc danh mục nào hoặc có ngân sách bao nhiêu ạ?',
        timestamp: 'Vừa xong',
      },
    ]);
    setInput('');
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[650px] max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                  SmartShop AI Advisor
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Tư vấn chọn thiết bị công nghệ thông minh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Làm mới cuộc trò chuyện"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Đóng chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo notice */}
        <div className="bg-purple-50 border-b border-purple-100 px-4 py-2 flex items-center gap-2 text-xs text-purple-900">
          <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            <strong>Chế độ tư vấn cục bộ:</strong> Tìm kiếm từ dữ liệu
            sản phẩm có sẵn, không cần kết nối API AI.
          </span>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-[85%] sm:max-w-[78%] space-y-2">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Recommended products */}
                {msg.recommendedProducts &&
                  msg.recommendedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Sản phẩm đề xuất cho bạn:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.recommendedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
                          >
                            <div className="flex gap-2.5">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-14 h-14 rounded-lg object-cover bg-slate-50 shrink-0"
                              />

                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] text-purple-600 font-bold block">
                                  {prod.categoryName}
                                </span>
                                <h5 className="text-xs font-bold text-slate-800 line-clamp-1">
                                  {prod.name}
                                </h5>
                                <p className="text-xs font-extrabold text-blue-600 mt-1">
                                  {formatVND(prod.price)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => {
                                  onViewProductDetails(prod);
                                  onClose();
                                }}
                                className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Xem</span>
                              </button>

                              <button
                                onClick={() => addToCart(prod, 1)}
                                className="flex-1 py-1 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                <span>Thêm giỏ</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <span className="text-[10px] text-slate-400 block px-1">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span>SmartShop đang tìm sản phẩm phù hợp...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        <div className="p-2 sm:px-4 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0 ml-1" />
          <span className="text-[11px] text-slate-400 shrink-0">
            Gợi ý nhanh:
          </span>

          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isTyping}
              className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-medium transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat input */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập sản phẩm hoặc ngân sách..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
