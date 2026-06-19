import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Copy, 
  Download, 
  Check, 
  Phone, 
  Lock, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Calendar, 
  Coins, 
  LogOut, 
  FileText, 
  User, 
  MessageSquare, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  Bell, 
  UserCheck, 
  Bike, 
  Car, 
  Printer, 
  FileSpreadsheet, 
  QrCode, 
  Terminal, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  Info,
  Layers,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StockItem, SaleItem, ExpenseItem, StaffAccount } from './types';
import { INITIAL_STOCK, INITIAL_STAFF, INITIAL_EXPENSES, INITIAL_SALES } from './data';
import { JETPACK_COMPOSE_FILES } from './kotlin/JetpackComposeCode';

export default function App() {
  // Global simulation states
  const [stocks, setStocks] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('pura_durian_stocks');
    return saved ? JSON.parse(saved) : INITIAL_STOCK;
  });
  
  const [sales, setSales] = useState<SaleItem[]>(() => {
    const saved = localStorage.getItem('pura_durian_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('pura_durian_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [staff, setStaff] = useState<StaffAccount[]>(() => {
    const saved = localStorage.getItem('pura_durian_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [currentUser, setCurrentUser] = useState<StaffAccount | null>(() => {
    const saved = localStorage.getItem('pura_durian_current_user');
    return saved ? JSON.parse(saved) : INITIAL_STAFF[0];
  });

  const [isAutoLogin, setIsAutoLogin] = useState(() => {
    return localStorage.getItem('pura_durian_autologin') !== 'false';
  });

  // Local persistence sync
  useEffect(() => {
    localStorage.setItem('pura_durian_stocks', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('pura_durian_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('pura_durian_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('pura_durian_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pura_durian_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pura_durian_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pura_durian_autologin', String(isAutoLogin));
  }, [isAutoLogin]);

  // UI state managers
  const [activeScreen, setActiveScreen] = useState<'splash' | 'login' | 'dashboard' | 'sales' | 'stocks' | 'expenses' | 'analytics' | 'settings'>('splash');
  const [currentSelectedDate, setCurrentSelectedDate] = useState('2026-06-19');
  
  // Dialog, details, and message notifications
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [editingSale, setEditingSale] = useState<SaleItem | null>(null);
  
  // Custom Date Picker Dialog States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'stock' | 'sale' | null>(null);
  const [pickerSelectedDate, setPickerSelectedDate] = useState('2026-06-19');
  const [pickerSelectedTime, setPickerSelectedTime] = useState('14:30');
  const [onDatePickerSave, setOnDatePickerSave] = useState<((date: string, time: string) => void) | null>(null);
  
  const [activeReceiptSale, setActiveReceiptSale] = useState<SaleItem | null>(null);
  const [invoiceSelectedDate, setInvoiceSelectedDate] = useState<string>('2026-06-19');

  useEffect(() => {
    if (activeReceiptSale) {
      setInvoiceSelectedDate(activeReceiptSale.date);
    }
  }, [activeReceiptSale]);
  const [showPrintToast, setShowPrintToast] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // OTP simulation states
  const [showOtpBanner, setShowOtpBanner] = useState(false);
  const [loginPhone, setLoginPhone] = useState('087567956');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Active source-code tab selected
  const [selectedSourceIdx, setSelectedSourceIdx] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);

  // Screen splash delay auto trigger
  useEffect(() => {
    if (activeScreen === 'splash') {
      const timer = setTimeout(() => {
        if (isAutoLogin && currentUser) {
          setActiveScreen('dashboard');
        } else {
          setActiveScreen('login');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [activeScreen]);

  // Re-trigger SMS OTP simulation banner shortly after login screen displays
  useEffect(() => {
    if (activeScreen === 'login') {
      const bannerTimer = setTimeout(() => {
        setShowOtpBanner(true);
      }, 1800);
      return () => clearTimeout(bannerTimer);
    } else {
      setShowOtpBanner(false);
    }
  }, [activeScreen]);

  // USD to KHR fixed conversion rate
  const EXCH_RATE = 4100;

  // Totals calculators helper
  const todaysSales = sales.filter(s => s.date === currentSelectedDate);
  const totalSalesKhr = todaysSales.sumOfSalesKhr();
  const totalSalesUsd = totalSalesKhr / EXCH_RATE;
  const totalSalesWeight = todaysSales.reduce((acc, curr) => acc + curr.weight, 0);

  // COGS simulated wholesale cost (~70%)
  const totalCogsKhr = todaysSales.reduce((acc, curr) => acc + (curr.price * curr.weight * 0.7), 0);
  const todaysExpenses = expenses.filter(e => e.date === currentSelectedDate);
  const totalExpensesKhr = todaysExpenses.reduce((acc, curr) => acc + curr.amountKhr, 0);
  const netProfitKhr = totalSalesKhr - totalCogsKhr - totalExpensesKhr;

  // File downloads
  const triggerDownload = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  // Pre-seed low stock alert check (threshold limit of 10)
  const isAnyStockLow = stocks.some(item => item.remainingStock < 10);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1A1A1A]">
      
      {/* Dynamic Header */}
      <header className="bg-[#1B4D3E] border-b border-[#153e32] py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg border border-white/20">
              <span className="text-xl">🍈</span>
            </div>
            <div>
              <h1 className="font-kantumruy text-xl md:text-2xl text-[#FFD700] tracking-wide font-bold">
                ពូរ៉ា ទុរេនខ្មែរធម្មជាតិ (Pura Durian Natural Khmer)
              </h1>
              <p className="text-xs text-slate-200 font-kantumruy">
                Android 15 (API 35) Immersive POS Engine & Jetpack Compose MVVM
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-white/90 font-mono">
              Local Time: 19:22:06 (2026-06-18)
            </span>
            <span className="text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              EMULATOR SECURE & READY
            </span>
          </div>
        </div>
      </header>

      {/* Main split work canvas */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: GORGEOUS ANDROID DEVICE SIMULATOR (5 Cols) */}
        <div id="android-emulator-container" className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[420px] bg-[#1E1E1E] p-[12px] rounded-[52px] shadow-[0_25px_60px_-15px_rgba(27,77,62,0.15)] border-[6px] border-[#2D2D2D] relative">
            
            {/* Speaker & Sensor Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[28px] bg-[#1E1E1E] rounded-b-[24px] z-50 flex items-center justify-center gap-4 px-3">
              <div className="w-12 h-[4px] bg-[#3A3A3A] rounded-full"></div>
              <div className="w-3.5 h-3.5 bg-[#121212] rounded-full border border-[#2D2D2D]"></div>
            </div>

            {/* Simulated Android Screen Frame */}
            <div className="w-full aspect-[9/18.5] bg-white rounded-[42px] overflow-hidden relative flex flex-col selection:bg-[#ffeb3b]/20 select-none border border-slate-100">
              
              {/* StatusBar */}
              <div className="h-10 bg-[#F8F9FA] border-b border-[#ECEFF1] px-6 flex justify-between items-center text-[11px] text-[#1A1A1A] font-medium z-30 pt-2 shrink-0">
                <span>19:22</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold tracking-tighter text-[10px]">VoLTE</span>
                  <span>5G</span>
                  <div className="w-5 h-2.5 bg-slate-200 rounded-sm p-0.5 flex relative border border-slate-300">
                    <div className="w-4 h-full bg-[#1B4D3E] rounded-xs"></div>
                  </div>
                  <span>87%</span>
                </div>
              </div>

              {/* LIVE SIMULATED APP INNER WRAPPER */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col font-kantumruy text-sm text-[#1A1A1A] bg-white">
                                   {/* SCREEN 1: SPLASH SCREEN */}
                  {activeScreen === 'splash' && (
                    <motion.div 
                      key="splash"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white flex flex-col items-center justify-between py-16 px-6 z-10"
                    >
                      <div></div>
                      
                      <div className="flex flex-col items-center text-center">
                        <h2 className="font-kantumruy text-3xl font-bold text-[#1B4D3E] tracking-tight leading-normal mb-6">
                          ពូរ៉ា ទុរេនខ្មែរធម្មជាតិ
                        </h2>
                        
                        {/* Golden Coin Logo Emblem matching specifications */}
                        <div className="relative w-44 h-44 rounded-full bg-gradient-to-b from-[#1B4D3E]/5 to-[#1B4D3E]/10 border-2 border-[#1B4D3E] flex items-center justify-center shadow-lg shadow-[#1b4d3e]/10">
                          <img 
                            src="/src/assets/images/golden_durian_coin_1781835777529.jpg" 
                            alt="Durian Coin" 
                            className="w-36 h-36 rounded-full object-cover"
                          />
                        </div>

                        <p className="text-xs text-slate-600 mt-6 max-w-xs leading-relaxed font-kantumruy">
                          ប្រព័ន្ធគ្រប់គ្រងការលក់ និង ស្តុកទុរេន ឆ្ងាញ់ៗ
                        </p>
                      </div>

                      {/* Infinite Pulsing Tagline Pill */}
                      <motion.div 
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-[#ffeaea] border border-[#ffcad4] px-5 py-2.5 rounded-full shadow-md"
                      >
                        <span className="text-[#d32f2f] font-bold text-sm tracking-wide">
                          ខ្មែរគាំទ្រផលិតផលខ្មែរ 🇰🇭
                        </span>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* SCREEN 2: AUTHENTICATION / LOGIN */}
                  {activeScreen === 'login' && (
                    <motion.div 
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-50 flex flex-col justify-between p-6 z-10 select-none text-[#1A1A1A]"
                    >
                      {/* Logo header */}
                      <div className="flex flex-col items-center text-center pt-6">
                        <div className="w-20 h-20 rounded-full border border-slate-200 shadow-sm flex items-center justify-center p-1 bg-white mb-3">
                          <img 
                            src="/src/assets/images/golden_durian_coin_1781835777529.jpg" 
                            alt="Durian Coin" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <h2 className="font-kantumruy text-xl font-bold text-[#1B4D3E] tracking-tight">
                          ពូរ៉ា ទុរេនខ្មែរ
                        </h2>
                        <span className="text-xs text-slate-500 font-medium font-kantumruy">
                          ប្រព័ន្ធគ្រប់គ្រងការលក់ និង ស្តុកទុរេន ឆ្ងាញ់ៗ
                        </span>
                      </div>

                      {/* Light Card with clean input fields, white backgrounds & prominent borders/text */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex-1 my-5 flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-[#1B4D3E] mb-4 font-kantumruy flex items-center gap-2">
                          <User className="w-4 h-4 text-[#1B4D3E]" />
                          ចូលប្រើប្រាស់កម្មវិធី
                        </h4>

                        {/* Phone field */}
                        <div className="space-y-1.5 mb-3">
                          <label className="text-[11px] font-bold text-slate-600">លេខទូរស័ព្ទ</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Phone className="h-4 w-4 text-slate-400" />
                            </span>
                            <input 
                              type="text"
                              value={loginPhone}
                              onChange={(e) => setLoginPhone(e.target.value)}
                              className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-[#1B4D3E] text-slate-900 transition-all font-mono"
                              placeholder="087567956"
                            />
                          </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-1.5 mb-4">
                          <label className="text-[11px] font-bold text-slate-600">ពាក្យសម្ងាត់</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-slate-400" />
                            </span>
                            <input 
                              type={showPassword ? "text" : "password"}
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-[#1B4D3E] text-slate-900 transition-all font-mono"
                              placeholder="កូដ OTP 6 ខ្ទង់"
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Remember option */}
                        <div className="flex items-center gap-2 mb-5">
                          <input 
                            type="checkbox" 
                            id="rememberCheck"
                            checked={isAutoLogin}
                            onChange={(e) => setIsAutoLogin(e.target.checked)}
                            className="rounded text-[#1B4D3E] focus:ring-[#1B4D3E] w-4.5 h-4.5 accent-[#1B4D3E] cursor-pointer"
                          />
                          <label htmlFor="rememberCheck" className="text-xs text-slate-600 font-medium cursor-pointer">
                            ចងចាំការចូលប្រើប្រាស់របស់ខ្ញុំ
                          </label>
                        </div>

                        {/* Login Button */}
                        <button
                          onClick={() => {
                            const found = staff.find(s => s.phone === loginPhone);
                            if (found) {
                              setCurrentUser(found);
                            } else {
                              setCurrentUser({
                                id: 'user_created',
                                name: 'វ៉ែន ចាន់បូរ៉ា',
                                phone: loginPhone,
                                role: 'admin'
                              });
                            }
                            setActiveScreen('dashboard');
                          }}
                          className="w-full py-3 bg-[#1B4D3E] hover:bg-[#12362b] active:scale-[0.98] text-white rounded-xl font-bold font-kantumruy text-sm tracking-wide shadow-sm hover:shadow transition-all"
                        >
                          ចូលប្រើប្រាស់
                        </button>
                      </div>

                      {/* Footer */}
                      <p className="text-center text-[11px] text-slate-500 font-medium py-1">
                        មិនទាន់មានគណនីទេ? <span className="text-[#1B4D3E] font-bold cursor-pointer hover:underline">ចុះឈ្មោះនៅទីនេះ៖</span>
                      </p>

                      {/* Simulated Banner SMS Overlap Notification */}
                      <AnimatePresence>
                        {showOtpBanner && (
                          <motion.div
                            initial={{ y: -120, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -120, opacity: 0 }}
                            className="absolute top-12 left-2 right-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 z-50 text-slate-800 flex items-center gap-3.5"
                          >
                            <div className="bg-[#1B4D3E]/10 p-2.5 rounded-full border border-[#1B4D3E]/20 text-[#1B4D3E] shrink-0">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-[#1B4D3E]">សារផ្ញើលេខកូដ OTP 🔐</h5>
                              <p className="text-[10px] text-slate-600 leading-tight truncate">
                                លេខកូដ Pura Durian គឺ: <span className="font-mono font-bold tracking-widest text-[#1B4D3E]">889988</span> ។
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setLoginPassword('889988');
                                setShowOtpBanner(false);
                              }}
                              className="text-[10px] font-bold bg-[#1B4D3E] hover:bg-[#12362b] text-white px-2.5 py-1.5 rounded-lg active:scale-95 transition-all shrink-0 cursor-pointer"
                            >
                              បំពេញ
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* SCREEN 3: HOME DASHBOARD */}
                  {activeScreen === 'dashboard' && (
                    <motion.div 
                      key="dashboard"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-50 flex flex-col justify-between text-slate-800 pb-16"
                    >
                      {/* Top Header Card precisely matching screenshots */}
                      <div className="bg-white p-4 pb-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-[#1B4D3E] overflow-hidden flex items-center justify-center p-0.5 bg-slate-100">
                            <img 
                              src="/src/assets/images/golden_durian_coin_1781835777529.jpg" 
                              alt="Me" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold font-kantumruy text-slate-900">
                              {currentUser?.name || "វ៉ែន ចាន់បូរ៉ា"}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {currentUser?.phone || "087567956"}
                            </span>
                            <div className="mt-0.5">
                              <span className="text-[9px] font-bold bg-[#1b4d3e]/10 border border-[#1b4d3e]/20 text-[#1B4D3E] px-1.5 py-0.5 rounded">
                                {currentUser?.role === 'admin' ? "អ្នកគ្រប់គ្រង" : "អ្នកតាមដាន"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold bg-[#1b4d3e]/10 text-[#1B4D3E] border border-[#1b4d3e]/20 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#1B4D3E] rounded-full animate-ping"></span>
                            រក្សាស្វ័យប្រវត្តិ
                          </span>
                          <button className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors">
                            <Bell className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Main Scrollable Content */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        
                        {/* Golden Banner Banner Card matching screenshots */}
                        <div className="bg-[#1b4d3e] rounded-2xl p-4 text-white relative overflow-hidden shadow-md border border-emerald-800">
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border border-[#ffd700]/30 p-1">
                              <img 
                                src="/src/assets/images/golden_durian_coin_1781835777529.jpg" 
                                alt="..." 
                                className="w-full h-full rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-kantumruy font-bold text-base text-[#ffd700] tracking-wide">
                                ពូរ៉ា ទុរេនខ្មែរធម្មជាតិ 🌿
                              </h3>
                              <p className="text-[11px] text-slate-100 font-medium font-kantumruy">
                                ខ្មែរគាំទ្រផលិតផលខ្មែរ ខ្សែជួយខ្សែ
                              </p>
                            </div>
                          </div>
                          
                          {/* Radial glowing backing */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-radial from-[#ffd700]/5 to-transparent blur-xl pointer-events-none z-0"></div>
                        </div>

                        {/* Modules Header */}
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 font-kantumruy">
                          ផ្នែកគ្រប់គ្រងការលក់
                        </h4>

                        {/* 6 Bento Grid Modules mapped exactly */}
                        <div className="grid grid-cols-2 gap-3.5">
                          
                          {/* Card 1: Daily Sale */}
                          <div 
                            onClick={() => setActiveScreen('sales')}
                            className="bg-white border border-slate-200 hover:border-[#1b4d3e] hover:bg-slate-50 p-3.5 rounded-2xl flex flex-col justify-between h-[115px] cursor-pointer shadow-sm active:scale-95 transition-all text-slate-800"
                          >
                            <div className="w-9 h-9 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-600">
                              <Layers className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h5 className="text-[13px] font-bold text-slate-900">ការលក់ប្រចាំថ្ងៃ</h5>
                              <p className="text-[9px] text-slate-500 leading-tight">លក់ជាផ្លែ និង បកសាច់សុទ្ធ</p>
                            </div>
                          </div>

                          {/* Card 2: Durian Stocks */}
                          <div 
                            onClick={() => setActiveScreen('stocks')}
                            className="bg-white border border-slate-200 hover:border-[#1b4d3e] hover:bg-slate-50 p-3.5 rounded-2xl flex flex-col justify-between h-[115px] cursor-pointer shadow-sm active:scale-95 transition-all text-slate-800"
                          >
                            <div className="w-9 h-9 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600">
                              <Sparkles className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h5 className="text-[13px] font-bold text-slate-900">ស្តុកទុរេន</h5>
                              <p className="text-[9px] text-slate-500 leading-tight">ពិនិត្យ & បន្ថែមស្តុកថ្មី</p>
                            </div>
                          </div>

                          {/* Card 3: Finance / expenses */}
                          <div 
                            onClick={() => setActiveScreen('expenses')}
                            className="bg-white border border-slate-200 hover:border-[#1b4d3e] hover:bg-slate-50 p-3.5 rounded-2xl flex flex-col justify-between h-[115px] cursor-pointer shadow-sm active:scale-95 transition-all text-slate-800"
                          >
                            <div className="w-9 h-9 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-600">
                              <FileSpreadsheet className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h5 className="text-[13px] font-bold text-slate-900">ចំណូលចំណាយ</h5>
                              <p className="text-[9px] text-slate-500 leading-tight">គ្រប់គ្រងបញ្ជីចំណាយ</p>
                            </div>
                          </div>

                          {/* Card 4: Sales Analytics */}
                          <div 
                            onClick={() => setActiveScreen('analytics')}
                            className="bg-white border border-slate-200 hover:border-[#1b4d3e] hover:bg-slate-50 p-3.5 rounded-2xl flex flex-col justify-between h-[115px] cursor-pointer shadow-sm active:scale-95 transition-all text-slate-800"
                          >
                            <div className="w-9 h-9 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-600">
                              <TrendingUp className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h5 className="text-[13px] font-bold text-slate-900">វិភាគការលក់</h5>
                              <p className="text-[9px] text-slate-500 leading-tight">តាមដាន និងស្វែងយល់</p>
                            </div>
                          </div>

                          {/* Card 5: Finance trend */}
                          <div 
                            onClick={() => setActiveScreen('analytics')}
                            className="bg-white border border-slate-200 hover:border-[#1b4d3e] hover:bg-slate-50 p-3.5 rounded-2xl flex flex-col justify-between h-[115px] cursor-pointer shadow-sm active:scale-95 transition-all text-slate-800"
                          >
                            <div className="w-9 h-9 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-600">
                              <Coins className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h5 className="text-[13px] font-bold text-slate-900">វិភាគចំណូលចំណាយ</h5>
                              <p className="text-[9px] text-slate-500 leading-tight">តាមដានចំណូលចំណាយ</p>
                            </div>
                          </div>

                          {/* Card 6: Invoices & reports */}
                          <div 
                            onClick={() => {
                              setInvoiceSelectedDate(currentSelectedDate);
                              setActiveReceiptSale({ id: 'dummy', date: currentSelectedDate } as any);
                            }}
                            className="bg-white border border-slate-200 hover:border-[#1b4d3e] hover:bg-slate-50 p-3.5 rounded-2xl flex flex-col justify-between h-[115px] cursor-pointer shadow-sm active:scale-95 transition-all text-slate-800"
                          >
                            <div className="w-9 h-9 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-600">
                              <FileText className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h5 className="text-[13px] font-bold text-slate-900">វិក្កយបត្រ</h5>
                              <p className="text-[9px] text-slate-400 leading-tight">មើលវិក្កយបត្រ ទាំងអស់</p>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Removed old bottom bar to mount the dynamic 4-tab bar globally */}

                    </motion.div>
                  )}

                  {/* SCREEN 4: DAILY SALES MANAGEMENT (Screen 3) */}
                  {activeScreen === 'sales' && (
                    <motion.div 
                      key="sales"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#121212] flex flex-col text-[#E0E0E0] pb-4"
                    >
                      {/* Sub header */}
                      <div className="bg-[#1e1e1e] p-4 border-b border-[#2d303b] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setActiveScreen('dashboard')}
                            className="p-1 text-slate-300 hover:text-[#ffd700]"
                          >
                            ‹ Back
                          </button>
                          <h3 className="text-base font-bold text-white font-kantumruy">គ្រប់គ្រងការលក់</h3>
                        </div>
                        <span className="text-[11px] bg-[#121212] border border-[#2d303b] text-[#ffd700] px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#ffd700]" /> 
                          19-06-2026
                        </span>
                      </div>

                      {/* Main lists */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        
                        {/* Big Stats block matching user mockup with glorious dark adjustments */}
                        <div className="bg-[#1b4d3e] rounded-2xl p-4 text-white shadow-md relative overflow-hidden border border-[#2e7d32]/30">
                          <span className="text-[10px] text-slate-300 font-medium block mb-2">
                            សរុបការលក់៖ {currentSelectedDate}
                          </span>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[9px] text-slate-300">ការលក់សរុបប្រចាំថ្ងៃ (៛)</span>
                              <h3 className="text-2xl font-bold text-[#ffd700] tracking-wide font-mono mt-0.5">
                                {totalSalesKhr.toLocaleString()} ៛
                              </h3>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-slate-300">ប្រៀបធៀបជាដុល្លារ ($)</span>
                              <h3 className="text-xl font-bold text-white tracking-wide font-mono mt-1">
                                $ {totalSalesUsd.toFixed(2)}
                              </h3>
                            </div>
                          </div>

                          <div className="border-t border-white/10 my-3.5"></div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-200 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-[#ffd700]" />
                              ចំនួនលក់សរុប៖
                            </span>
                            <span className="font-bold text-[#ffd700]">
                              {totalSalesWeight.toFixed(2)} គីឡូ
                            </span>
                          </div>
                        </div>

                        {/* Todays Sales History Log Header */}
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-kantumruy">
                            បញ្ជីការលក់ប្រចាំថ្ងៃ
                          </h4>
                          <button 
                            onClick={() => setShowAddSaleModal(true)}
                            className="bg-[#ffd700] hover:bg-[#ffea75] text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> កត់ត្រាការលក់
                          </button>
                        </div>

                        {/* List items inside screen */}
                        <div className="space-y-3">
                          {todaysSales.length === 0 ? (
                            <div className="bg-[#1e1e1e] border border-[#2d303b] rounded-2xl p-8 text-center text-slate-400">
                              <span className="text-2xl">📦</span>
                              <p className="text-xs text-slate-400 mt-2 font-medium">មិនទាន់មានការលក់នៅឡើយទេសម្រាប់ថ្ងៃនេះ!</p>
                            </div>
                          ) : (
                            todaysSales.map((sale) => (
                              <div 
                                key={sale.id}
                                className="bg-[#1e1e1e] border border-[#2a2d37] rounded-2xl p-3.5 relative shadow-xs flex items-center justify-between"
                              >
                                <div className="space-y-1">
                                  <h5 className="text-[13px] font-bold text-white">{sale.name}</h5>
                                  <span className="text-[10px] text-slate-400 block">កូដ៖ {sale.code}</span>
                                  
                                  <div className="flex gap-1.5 pt-1">
                                    <span className="text-[9px] font-bold bg-[#1b4d3e]/20 border border-[#2e7d32]/30 text-[#ffd700] px-1.5 py-0.5 rounded">
                                      {sale.mode === 'fruit' ? "លក់ជា ផ្លែ" : "បកសាច់សុទ្ធ"}
                                    </span>
                                    <span className="text-[9px] font-bold bg-[#ffd700]/10 border border-[#ffd700]/20 text-[#ffd700] px-1.5 py-0.5 rounded">
                                      {sale.paymentMethod === 'cash' ? "លុយសុទ្ធ" : "ABA QR"}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-300 font-mono pt-1.5">
                                    {sale.weight} គីឡូ x {sale.price.toLocaleString()}៛
                                  </p>
                                </div>

                                <div className="text-right flex flex-col items-end justify-between self-stretch">
                                  <div>
                                    <h5 className="text-sm font-bold text-[#ffd700] font-mono">
                                      {sale.amountPaidKhr.toLocaleString()} ៛
                                    </h5>
                                    <span className="text-[10px] text-slate-400 font-mono block">
                                      $ {(sale.amountPaidKhr / EXCH_RATE).toFixed(2)}
                                    </span>
                                  </div>

                                  {/* Row Actions */}
                                  <div className="flex gap-2 pt-2">
                                    <button 
                                      onClick={() => {
                                        setActiveReceiptSale(sale);
                                      }}
                                      className="p-1 items-center justify-center bg-[#121212] border border-[#2d303b] hover:border-[#ffd700] text-slate-300 hover:text-[#ffd700] rounded-lg cursor-pointer"
                                      title="Print Receipt"
                                    >
                                      <Printer className="w-3.5 h-3.5 text-[#ffd700]" />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setEditingSale(sale);
                                        setShowAddSaleModal(true);
                                      }}
                                      className="p-1 items-center justify-center bg-[#121212] border border-[#2d303b] hover:border-[#ffd700] text-slate-300 hover:text-[#ffd700] rounded-lg cursor-pointer"
                                      title="Edit Record"
                                    >
                                      <Edit className="w-3.5 h-3.5 text-[#ffd700]" />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        // Delete and Restore stocks
                                        const foundStockIdx = stocks.findIndex(s => s.id === sale.stockItemId);
                                        if (foundStockIdx !== -1) {
                                          const copy = [...stocks];
                                          copy[foundStockIdx].remainingStock += sale.weight;
                                          setStocks(copy);
                                        }
                                        setSales(sales.filter(s => s.id !== sale.id));
                                      }}
                                      className="p-1 items-center justify-center bg-[#121212] border border-[#2d303b] hover:border-[#e63946] text-slate-300 hover:text-[#e63946] rounded-lg cursor-pointer"
                                      title="Delete Record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-[#e63946]" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                      </div>

                    </motion.div>
                  )}

                  {/* SCREEN 5: STOCK MANAGEMENT (Screen 4) */}
                  {activeScreen === 'stocks' && (
                    <motion.div 
                      key="stocks"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#121212] flex flex-col text-[#E0E0E0] pb-4"
                    >
                      {/* Header */}
                      <div className="bg-[#1e1e1e] p-4 border-b border-[#2d303b] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setActiveScreen('dashboard')}
                            className="p-1 text-slate-300 hover:text-[#ffd700]"
                          >
                            ‹ Back
                          </button>
                          <h3 className="text-base font-bold text-white font-kantumruy">គ្រប់គ្រងស្តុកទុរេន</h3>
                        </div>
                        <button 
                          onClick={() => {
                            setEditingStock(null);
                            setShowAddStockModal(true);
                          }}
                          className="bg-[#ffd700] hover:bg-[#ffea75] text-slate-950 p-1.5 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                        >
                          <Plus className="w-4 h-4 text-slate-950" />
                        </button>
                      </div>

                      {/* Low Stock Alerts Label */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        
                        {isAnyStockLow && (
                          <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#e63946]/10 border-2 border-[#e63946]/30 text-[#e63946] p-3.5 rounded-2xl flex items-start gap-2.5"
                          >
                            <span className="text-xl pt-0.5">⚠️</span>
                            <div className="text-xs font-bold leading-relaxed">
                              ព្រមាន៖ ស្តុកជិតអស់ពីឃ្លាំងហើយ! សូមបន្ថែមទំនិញចូលស្តុក។
                            </div>
                          </motion.div>
                        )}

                        {/* Summary */}
                        <div className="bg-[#1e1e1e] border border-[#2d303b] rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                          <div className="w-10 h-10 bg-[#1b4d3e]/20 text-[#ffd700] border border-[#2e7d32]/30 rounded-full flex items-center justify-center">
                            <Layers className="w-5 h-5 text-[#ffd700]" />
                          </div>
                          <div>
                            <h5 className="font-bold text-white text-sm font-kantumruy">ព័ត៌មានស្តុកទុរេនរួម</h5>
                            <span className="text-[11px] text-slate-400">ស្តុកទុរេនសរុបមានរហូតដល់ {stocks.length} មុខទុរេនខ្មែរ</span>
                          </div>
                        </div>

                        {/* List stock items with critical flags */}
                        <div className="space-y-3">
                          {stocks.map((item) => {
                            const isLow = item.remainingStock < item.lowStockThreshold;
                            return (
                              <div 
                                key={item.id}
                                className="bg-[#1e1e1e] border border-[#2a2d37] rounded-2xl p-4 relative shadow-xs"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-white text-sm font-kantumruy">{item.name}</h4>
                                    <span className="text-[11px] text-slate-400 font-mono block">កូដសម្គាល់៖ {item.code}</span>
                                    <span className="text-[10px] text-[#ffd700] block mt-1 font-bold">📅 ថ្ងៃទិញចូល៖ {item.purchaseDate || item.dateAdded}</span>
                                  </div>
                                  
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${isLow ? 'bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/30 animate-pulse' : 'bg-[#1b4d3e]/20 text-[#ffd700] border border-[#2e7d32]/30'}`}>
                                    {isLow ? "ស្តុកជិតអស់!" : "សល់ច្រើន"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-3.5 text-center border-t border-[#2d303b] mt-3">
                                  <div>
                                    <span className="text-[9px] text-slate-400 block font-kantumruy">តម្លៃទិញចូល</span>
                                    <span className="font-bold text-xs text-slate-200 font-mono">
                                      {item.buyPrice.toLocaleString()} ៛
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-400 block font-kantumruy">តម្លៃលក់ចេញ</span>
                                    <span className="font-bold text-xs text-[#ffd700] font-mono">
                                      {item.sellPrice.toLocaleString()} ៛
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-400 block font-kantumruy">សល់ជាក់ស្តែង</span>
                                    <span className={`font-bold text-xs font-monoDetail ${isLow ? 'text-[#e63946]' : 'text-[#ffd700]'}`}>
                                      {item.remainingStock} គីឡូ
                                    </span>
                                  </div>
                                </div>

                                {/* Stock Actions */}
                                <div className="flex justify-end gap-3.5 border-t border-[#2d303b] pt-2.5 mt-2.5">
                                  <button 
                                    onClick={() => {
                                      setEditingStock(item);
                                      setShowAddStockModal(true);
                                    }}
                                    className="text-xs font-bold text-[#ffd700] hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-[#ffd700]" /> កែប្រែ
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setStocks(stocks.filter(s => s.id !== item.id));
                                    }}
                                    className="text-xs font-bold text-[#e63946] hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-[#e63946]" /> លុប
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>

                    </motion.div>
                  )}

                  {/* SCREEN 6: DAILY INCOME & EXPENSES TRACKER (Screen 5) */}
                  {activeScreen === 'expenses' && (
                    <motion.div 
                      key="expenses"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#121212] flex flex-col text-[#E0E0E0] pb-4"
                    >
                      {/* Header */}
                      <div className="bg-[#1e1e1e] p-4 border-b border-[#2d303b] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setActiveScreen('dashboard')}
                            className="p-1 text-slate-300 hover:text-[#ffd700]"
                          >
                            ‹ Back
                          </button>
                          <h3 className="text-base font-bold text-white font-kantumruy">ចំណូលចំណាយប្រចាំថ្ងៃ</h3>
                        </div>
                        <button 
                          onClick={() => {
                            setShowAddExpenseModal(true);
                          }}
                          className="bg-[#ffd700] hover:bg-[#ffea75] text-slate-950 p-1.5 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                        >
                          <Plus className="w-4 h-4 text-slate-950" />
                        </button>
                      </div>

                      {/* Main sheets logs */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        
                        {/* Financial Ledger grid card precisely matching screenshots */}
                        <div className="bg-[#1e1e1e] border border-[#2d303b] rounded-2xl p-4 shadow-sm space-y-3">
                          <h4 className="text-[11px] font-bold text-slate-400 font-kantumruy">
                            តារាងគ្រប់គ្រងចំណូលចំណាយ៖ {currentSelectedDate}
                          </h4>
                          
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-[#121212] p-2 border border-[#2a2d37] rounded-xl">
                              <span className="text-[9px] text-emerald-400 font-bold block mb-1">ចំណូលសរុប (៛)</span>
                              <span className="font-bold text-[13px] font-mono text-white block">
                                {totalSalesKhr.toLocaleString()} ៛
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono block">
                                $ {totalSalesUsd.toFixed(1)}
                              </span>
                            </div>
                            <div className="bg-[#121212] p-2 border border-[#2a2d37] rounded-xl">
                              <span className="text-[9px] text-blue-400 font-semibold block mb-1">ថ្លៃដើមទិញចូល (៛)</span>
                              <span className="font-bold text-[13px] font-mono text-white block">
                                {totalCogsKhr.toLocaleString()} ៛
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono block">
                                $ {(totalCogsKhr/EXCH_RATE).toFixed(1)}
                              </span>
                            </div>
                            <div className="bg-[#121212] p-2 border border-[#2a2d37] rounded-xl">
                              <span className="text-[9px] text-rose-400 font-bold block mb-1">ចំណាយផ្សេងៗ (៛)</span>
                              <span className="font-bold text-[13px] font-mono text-white block">
                                {totalExpensesKhr.toLocaleString()} ៛
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono block">
                                $ {(totalExpensesKhr/EXCH_RATE).toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <div className="border-t border-[#2d303b] pt-3 flex justify-between items-center bg-[#1b4d3e]/20 border border-[#2e7d32]/30 p-2 rounded-xl">
                            <span className="text-xs font-bold text-slate-200">ប្រាក់ចំណេញសុទ្ធប្រចាំថ្ងៃ៖</span>
                            <span className={`font-bold text-xs ${netProfitKhr >= 0 ? "text-[#ffd700]" : "text-[#e63946]"}`}>
                              {netProfitKhr.toLocaleString()} ៛ (=${(netProfitKhr/EXCH_RATE).toFixed(2)})
                            </span>
                          </div>
                        </div>

                        {/* Title list */}
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-kantumruy">
                          បញ្ជីចំណាយលម្អិតនាថ្ងៃនេះ
                        </h4>

                        {/* List items with requested categorized icons */}
                        <div className="space-y-2.5">
                          {todaysExpenses.map((exp) => (
                            <div 
                              key={exp.id} 
                              className="bg-[#1e1e1e] border border-[#2a2d37] rounded-2xl p-3 flex items-center justify-between shadow-xs"
                            >
                              <div className="flex items-center gap-3">
                                {/* specific icons requested category mapped */}
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  exp.category === 'fuel' ? 'bg-rose-500/10 text-rose-400' :
                                  exp.category === 'gas' ? 'bg-blue-500/10 text-blue-400' :
                                  exp.category === 'salary' ? 'bg-[#1b4d3e]/20 text-[#ffd700]' : 'bg-yellow-500/10 text-[#ffd700]'
                                }`}>
                                  {exp.category === 'fuel' ? <Bike className="w-4.5 h-4.5" /> :
                                   exp.category === 'gas' ? <Car className="w-4.5 h-4.5" /> :
                                   exp.category === 'salary' ? <User className="w-4.5 h-4.5" /> : <FileText className="w-4.5 h-4.5" />
                                   }
                                </div>
                                <div>
                                  <h5 className="text-[13px] font-bold text-white leading-tight font-kantumruy">
                                    {exp.description}
                                  </h5>
                                  <span className="text-[10px] text-slate-400 block pt-0.5">
                                    {exp.category === 'fuel' ? "🏍️ ម៉ូតូដឹកទុរេន" :
                                     exp.category === 'gas' ? "🚗 ប្រេងឡានចម្ការ" :
                                     exp.category === 'salary' ? "👤 ប្រាក់ខែបុគ្គលិក" : "🧾 ចំណាយផ្សេងៗ"
                                    }
                                  </span>
                                </div>
                              </div>

                              <div className="text-right flex items-center gap-3">
                                <div>
                                  <span className="font-bold text-sm text-[#e63946] font-mono block">
                                    -{exp.amountKhr.toLocaleString()} ៛
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    -$ {(exp.amountKhr/EXCH_RATE).toFixed(1)}
                                  </span>
                                </div>
                                <button 
                                  onClick={() => {
                                    setExpenses(expenses.filter(e => e.id !== exp.id));
                                  }}
                                  className="text-slate-400 hover:text-[#e63946] p-1 bg-[#121212] border border-[#2d303b] hover:border-[#e63946] rounded-lg active:scale-95 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>

                    </motion.div>
                  )}

                  {/* SCREEN 7: ANALYTICS (Screen 7) */}
                  {activeScreen === 'analytics' && (
                    <motion.div 
                      key="analytics"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#121212] flex flex-col text-[#E0E0E0] pb-4"
                    >
                      {/* Header */}
                      <div className="bg-[#1e1e1e] p-4 border-b border-[#2d303b] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setActiveScreen('dashboard')}
                            className="p-1 text-slate-300 hover:text-[#ffd700]"
                          >
                            ‹ Back
                          </button>
                          <h3 className="text-base font-bold text-white font-kantumruy">វិភាគចំណូលចំណាយ</h3>
                        </div>
                      </div>

                      {/* Charts and PDF */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        
                        {/* Status banner indicator */}
                        <div className="bg-[#1b4d3e]/20 border border-[#2e7d32]/30 text-[#ffd700] px-4 py-3 rounded-2xl flex items-center gap-2">
                          <span className="text-lg">📈</span>
                          <span className="text-xs font-bold font-kantumruy">
                            និន្នាការលក់៖ កើនឡើង 📈
                          </span>
                        </div>

                        {/* Comparative Flow Summary Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#1e1e1e] border border-[#2d303b] p-3 rounded-2xl flex flex-col justify-between shadow-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-kantumruy">លំហូរចំណូលចូល (Income)</span>
                              <h4 className="text-sm font-extrabold text-emerald-400 font-mono mt-1">
                                {totalSalesKhr.toLocaleString()} ៛
                              </h4>
                            </div>
                            <span className="inline-block self-start text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md mt-2">
                              កើនឡើង 📈
                            </span>
                          </div>

                          <div className="bg-[#1e1e1e] border border-[#2d303b] p-3 rounded-2xl flex flex-col justify-between shadow-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-kantumruy">ចំណាយប្រតិបត្តិការ (Expenses)</span>
                              <h4 className="text-sm font-extrabold text-rose-400 font-mono mt-1">
                                {(totalCogsKhr + totalExpensesKhr).toLocaleString()} ៛
                              </h4>
                            </div>
                            <span className="inline-block self-start text-[9px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md mt-2">
                              ធ្លាក់ចុះ 📉
                            </span>
                          </div>
                        </div>

                        {/* Line Chart Plotted using SVG (represents Compose Native Canvas) */}
                        <div className="bg-[#1e1e1e] border border-[#2d303b] rounded-2xl p-4 shadow-xs space-y-4">
                          <h5 className="text-xs font-bold text-slate-300 font-kantumruy tracking-wider">
                            ក្រាហ្វិកនិន្នាការចំណូលចំណាយប្រចាំសប្ដាហ៍ (KHR)
                          </h5>

                          {/* Beautiful canvas representing line plot */}
                          <div className="h-44 w-full relative pt-2">
                            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                              {/* Grid lines */}
                              <line x1="0" y1="10" x2="100" y2="10" stroke="#2d303b" strokeWidth="0.5" />
                              <line x1="0" y1="20" x2="100" y2="20" stroke="#2d303b" strokeWidth="0.5" />
                              <line x1="0" y1="30" x2="100" y2="30" stroke="#2d303b" strokeWidth="0.5" />
                              <line x1="0" y1="40" x2="100" y2="40" stroke="#2d303b" strokeWidth="0.5" />
                              
                              {/* Income Path - Green (#2e7d32) */}
                              <path 
                                d="M 5,38 Q 20,28 35,32 T 65,18 T 95,10" 
                                fill="none" 
                                stroke="#2e7d32" 
                                strokeWidth="2.5" 
                                strokeLinecap="round"
                              />

                              {/* Expense Path - Red (#e63946) */}
                              <path 
                                d="M 5,44 Q 20,40 35,42 T 65,34 T 95,30" 
                                fill="none" 
                                stroke="#e63946" 
                                strokeWidth="2" 
                                strokeLinecap="round"
                                strokeDasharray="1.5 1"
                              />

                              {/* Glowing circles indicators for Income */}
                              <circle cx="5" cy="38" r="1.3" fill="#121212" stroke="#2e7d32" strokeWidth="1" />
                              <circle cx="35" cy="32" r="1.3" fill="#121212" stroke="#2e7d32" strokeWidth="1" />
                              <circle cx="65" cy="18" r="1.3" fill="#121212" stroke="#2e7d32" strokeWidth="1" />
                              <circle cx="95" cy="10" r="1.3" fill="#121212" stroke="#2e7d32" strokeWidth="1" />

                              {/* Glowing circles indicators for Expenses */}
                              <circle cx="5" cy="44" r="1.3" fill="#121212" stroke="#e63946" strokeWidth="1" />
                              <circle cx="35" cy="42" r="1.3" fill="#121212" stroke="#e63946" strokeWidth="1" />
                              <circle cx="65" cy="34" r="1.3" fill="#121212" stroke="#e63946" strokeWidth="1" />
                              <circle cx="95" cy="30" r="1.3" fill="#121212" stroke="#e63946" strokeWidth="1" />
                            </svg>
                            
                            {/* SVG labels */}
                            <div className="absolute inset-0 flex justify-between items-end text-[8px] font-bold text-slate-400 font-kantumruy px-1 pt-6 selection:bg-transparent">
                              <span>ចន្ទ</span>
                              <span>អង្គារ</span>
                              <span>ពុធ</span>
                              <span>ព្រហ</span>
                              <span>សុក្រ</span>
                              <span>សៅរ៍</span>
                              <span>អាទិត្យ</span>
                            </div>
                          </div>

                          <div className="flex gap-4 items-center justify-center text-[10px] pt-1 border-t border-[#2d303b] mt-1 text-slate-400">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#2e7d32] rounded-full"></span> ចំណូលសរុប (Income)</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-1 border border-dashed border-[#e63946] rounded-full"></span> ចំណាយ (Expenses)</span>
                          </div>
                        </div>

                        {/* Simulated Compilation of report details to export PDF */}
                        <button 
                          onClick={() => {
                            const pdfText = `%PDF-1.4\n1 0 obj\n<< /Title (Pura Durian Daily POS Report) /Author (Ven Chanbora) >>\nendobj\n...`;
                            triggerDownload("PuraDurian_DailyReport.pdf", pdfText);
                            alert("គណនា និងនាំចេញរបាយការណ៍ PDF ជោគជ័យទៅកាន់ standard Downloads! 📥");
                          }}
                          className="w-full py-3.5 bg-[#ffd700] hover:bg-[#ffea75] text-slate-950 font-bold rounded-xl text-center flex items-center justify-center gap-2.5 shadow-md shadow-[#ffd700]/10 active:scale-98 transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>នាំចេញជារបាយការណ៍ PDF 📥</span>
                        </button>
                      </div>

                    </motion.div>
                  )}

                  {/* SCREEN 8: SETTINGS, COMPLIANCE & CREDITS (Screen 8) */}
                  {activeScreen === 'settings' && (
                    <motion.div 
                      key="settings"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#121212] flex flex-col text-[#E0E0E0] pb-4"
                    >
                      {/* Header */}
                      <div className="bg-[#1e1e1e] p-4 border-b border-[#2d303b] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setActiveScreen('dashboard')}
                            className="p-1 text-slate-300 hover:text-[#ffd700]"
                          >
                            ‹ Back
                          </button>
                          <h3 className="text-base font-bold text-white font-kantumruy">ការកំណត់ និង គណនី</h3>
                        </div>
                      </div>

                      {/* Main Scroll settings details */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-12">
                        
                        {/* Profile avatar preset selector */}
                        <div className="bg-[#1e1e1e] border border-[#2d303b] rounded-3xl p-4 flex flex-col items-center shadow-xs">
                          <div className="relative group w-20 h-20 rounded-full border-2 border-[#2d303b] overflow-hidden shadow-sm flex items-center justify-center p-0.5 bg-[#121212] cursor-pointer hover:border-[#ffd700]">
                            <img 
                              src="/src/assets/images/golden_durian_coin_1781835777529.jpg" 
                              alt="Avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          
                          <h3 className="text-sm font-bold text-white pt-2 font-kantumruy">{currentUser?.name || "វ៉ែន ចាន់បូរ៉ា"}</h3>
                          <span className="text-[10px] text-slate-400 font-mono block">លេខ៖ {currentUser?.phone || "087567956"}</span>
                          <span className="text-[9px] font-bold text-[#ffd700] bg-[#1b4d3e]/20 border border-[#2e7d32]/30 px-2 py-0.5 rounded mt-2 uppercase">
                            តួនាទី៖ {currentUser?.role === 'admin' ? "អ្នកគ្រប់គ្រង" : "អ្នកតាមដាន"}
                          </span>
                        </div>

                        {/* Play protect safety banner */}
                        <div className="bg-[#1e1e1e] border border-[#2d303b] rounded-2xl p-3.5 flex items-start gap-3.5 shadow-xs">
                          <div className="w-9 h-9 bg-[#1b4d3e]/20 rounded-full border border-[#2e7d32]/30 flex items-center justify-center text-[#ffd700] shrink-0">
                            <UserCheck className="w-4.5 h-4.5 text-[#ffd700]" />
                          </div>
                          <div>
                            <h5 className="text-[13px] font-bold text-white font-kantumruy">Play Protect Compliance</h5>
                            <p className="text-[10px] text-slate-400 leading-normal font-kantumruy">
                              Safe compile signature on Android 15. Clean code verification - Safe v1.0.0
                            </p>
                          </div>
                        </div>

                        {/* DEVELOPER EXPLICIT INFO PANEL - MUST MATCH TEXT EXACTLY */}
                        <div className="bg-[#1e1e1e] border border-[#2d303b] rounded-2xl p-4 shadow-xs space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 tracking-wider font-kantumruy">
                            ព័ត៌មានអំពីអ្នកអភិវឌ្ឍន៍កម្មវិធី
                          </h4>

                          <div className="space-y-2.5 font-kantumruy">
                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                              <span className="text-base text-[#ffd700]">👤</span>
                              <span>រចនា និងបង្កើតកម្មវិធី POS ដោយ៖ លោក វ៉ែន ចាន់បូរ៉ា</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                              <span className="text-base text-[#ffd700]">💬</span>
                              <span>Facebook: Ven Chanbora</span>
                            </div>

                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                              <span className="text-base text-[#ffd700]">✈️</span>
                              <span>Telegram: 087567956</span>
                            </div>
                          </div>
                        </div>

                        {/* Accounts management admin section */}
                        {currentUser?.role === 'admin' && (
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-center px-1">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-kantumruy">
                                បុគ្គលិកចុះឈ្មោះក្នុងប្រព័ន្ធ
                              </h4>
                              <button 
                                onClick={() => setShowAddStaffModal(true)}
                                className="text-[10px] font-bold text-[#ffd700] hover:underline cursor-pointer"
                              >
                                + បង្កើតគណនី
                              </button>
                            </div>

                            <div className="space-y-2">
                              {staff.map((acc) => (
                                <div key={acc.id} className="bg-[#1e1e1e] border border-[#2d303b] rounded-xl p-3 flex justify-between items-center">
                                  <div>
                                    <h5 className="text-xs font-bold text-white font-kantumruy">{acc.name}</h5>
                                    <span className="text-[10px] text-slate-400 font-mono">លេខ៖ {acc.phone}</span>
                                    <p className="text-[9px] text-[#ffd700] font-semibold font-kantumruy">តួនាទី៖ {acc.role === 'admin' ? "អ្នកគ្រប់គ្រង" : "អ្នកតាមដាន"}</p>
                                  </div>
                                  
                                  {acc.id !== currentUser?.id && (
                                    <button 
                                      onClick={() => setStaff(staff.filter(st => st.id !== acc.id))}
                                      className="text-[#e63946] hover:text-rose-400 p-1 bg-[#121212] border border-[#2d303b] hover:border-[#e63946] rounded-lg active:scale-95 transition-all text-xs cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Logout button */}
                        <button
                          onClick={() => {
                            setCurrentUser(null);
                            setActiveScreen('login');
                          }}
                          className="w-full py-3.5 bg-[#e63946] hover:bg-[#ff5261] active:scale-98 text-white rounded-xl font-bold font-kantumruy text-sm tracking-wide shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-white" />
                          <span>ចាកចេញពីកម្មវិធី</span>
                        </button>

                      </div>

                    </motion.div>
                  )}

                  {/* SCREEN 9: NEW SALE FRAME FOR TAB NAVIGATION */}
                  {activeScreen === 'newsale' && (
                    <motion.div 
                      key="newsale"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#F8F9FA] flex flex-col text-slate-800 pb-16 font-kantumruy"
                    >
                      {/* Header */}
                      <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button"
                            onClick={() => setActiveScreen('dashboard')}
                            className="p-1 text-[#1B4D3E] hover:opacity-85 font-bold cursor-pointer"
                          >
                            ‹ Back
                          </button>
                          <h3 className="text-sm font-extrabold text-[#1B4D3E]">កត់ត្រាការលក់ថ្មី (New Sale)</h3>
                        </div>
                      </div>

                      {/* Main Scroll settings details */}
                      <div className="flex-1 overflow-y-auto p-4">
                        <AddSaleForm 
                          stocks={stocks} 
                          rate={EXCH_RATE}
                          editingSale={editingSale}
                          onDatePickerTrigger={(currentDate, currentTime, callback) => {
                            setDatePickerType('sale');
                            setPickerSelectedDate(currentDate);
                            setPickerSelectedTime(currentTime);
                            setOnDatePickerSave(() => callback);
                            setShowDatePicker(true);
                          }}
                          onSave={(newSale) => {
                            if (editingSale) {
                              // Restore raw or flesh stock
                              const oldId = editingSale.stockItemId;
                              const restored = stocks.map(st => {
                                if (st.id === oldId) {
                                  if (editingSale.mode === 'flesh' && editingSale.fleshMeasurementType === 'flesh') {
                                    return { ...st, remainingFleshStock: (st.remainingFleshStock || 0) + editingSale.weight };
                                  } else {
                                    return { ...st, remainingStock: st.remainingStock + editingSale.weight };
                                  }
                                }
                                return st;
                              });

                              // Deduct new
                              const finalStocks = restored.map(st => {
                                if (st.id === newSale.stockItemId) {
                                  if (newSale.mode === 'flesh' && newSale.fleshMeasurementType === 'flesh') {
                                    return { ...st, remainingFleshStock: Math.max(0, (st.remainingFleshStock || 0) - newSale.weight) };
                                  } else {
                                    return { ...st, remainingStock: Math.max(0, st.remainingStock - newSale.weight) };
                                  }
                                }
                                return st;
                              });
                              setStocks(finalStocks);
                              setSales(sales.map(s => s.id === editingSale.id ? newSale : s));
                            } else {
                              setSales([newSale, ...sales]);
                              // Deduct actual remains
                              const stockIdx = stocks.findIndex(s => s.id === newSale.stockItemId);
                              if (stockIdx !== -1) {
                                const copy = [...stocks];
                                if (newSale.mode === 'flesh' && newSale.fleshMeasurementType === 'flesh') {
                                  copy[stockIdx].remainingFleshStock = Math.max(0, (copy[stockIdx].remainingFleshStock || 0) - newSale.weight);
                                } else {
                                  copy[stockIdx].remainingStock = Math.max(0, copy[stockIdx].remainingStock - newSale.weight);
                                }
                                setStocks(copy);
                              }
                            }
                            setEditingSale(null);
                            setActiveScreen('sales');
                            setActiveReceiptSale(newSale);
                          }}
                        />
                      </div>
                    </motion.div>
                  )}


                {/* Global Navigation Bar */}
                {activeScreen !== 'splash' && activeScreen !== 'login' && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex justify-around items-center px-2 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] text-slate-800">
                    <button 
                      onClick={() => setActiveScreen('dashboard')}
                      className={`flex-1 flex flex-col items-center gap-1 py-1 select-none cursor-pointer transition-all ${
                        activeScreen === 'dashboard' ? 'text-[#1B4D3E] font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span className="text-[10px]">ទំព័រដើម</span>
                    </button>
                    <button 
                      onClick={() => setActiveScreen('newsale')}
                      className={`flex-1 flex flex-col items-center gap-1 py-1 select-none cursor-pointer transition-all ${
                        activeScreen === 'newsale' ? 'text-[#1B4D3E] font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-[10px]">លក់ថ្មី</span>
                    </button>
                    <button 
                      onClick={() => setActiveScreen('stocks')}
                      className={`flex-1 flex flex-col items-center gap-1 py-1 select-none cursor-pointer transition-all ${
                        activeScreen === 'stocks' ? 'text-[#1B4D3E] font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                      <span className="text-[10px]">ស្តុកទុរេន</span>
                    </button>
                    <button 
                      onClick={() => setActiveScreen('settings')}
                      className={`flex-1 flex flex-col items-center gap-1 py-1 select-none cursor-pointer transition-all ${
                        activeScreen === 'settings' ? 'text-[#1B4D3E] font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                      <span className="text-[10px]">ការកំណត់</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Simulated OS Navigation Bar */}
              <div className="h-14 bg-black/95 px-8 flex justify-around items-center shrink-0 border-t border-[#1a1c22] z-40">
                <button 
                  onClick={() => {
                    // Back logic
                    if (activeScreen === 'sales' || activeScreen === 'stocks' || activeScreen === 'expenses' || activeScreen === 'analytics' || activeScreen === 'settings' || activeScreen === 'newsale') {
                      setActiveScreen('dashboard');
                    } else if (activeScreen === 'dashboard') {
                      setActiveScreen('login');
                    }
                  }}
                  className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white cursor-pointer active:scale-90 transition-all font-sans"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button 
                  onClick={() => {
                    if (activeScreen !== 'splash' && activeScreen !== 'login') {
                      setActiveScreen('dashboard');
                    }
                  }}
                  className="w-10 h-10 border-2 border-slate-400 hover:border-white rounded-full cursor-pointer active:scale-95 transition-all flex items-center justify-center"
                >
                  <div className="w-4.5 h-4.5 bg-slate-400 rounded-full"></div>
                </button>
                <button 
                  onClick={() => alert("Simulated android overview tasks opened")}
                  className="w-4.5 h-4.5 border-2 border-slate-400 hover:border-white rounded-md cursor-pointer active:scale-95 transition-all"
                ></button>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RICH JETPACK COMPOSE SOURCE WORKSPACE EXPLORER (7 Cols) */}
        <div id="source-code-explorer" className="lg:col-span-7 flex flex-col bg-[#111622] rounded-3xl border border-[#222c3d] p-5 shadow-lg select-text h-[740.0px]">
          
          {/* Header IDE metadata detail */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#222c3d] pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                  Kotlin / Jetpack Compose Engine
                </span>
                <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2.5 py-0.5 rounded-full border border-yellow-500/20 font-mono">
                  MVVM Architecture
                </span>
              </div>
              <h3 className="font-koulen text-lg text-[#ffd700] tracking-wide pt-1.5 font-bold">
                កូដប្រភពកម្មវិធី Android POS & Compose Design Build
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(JETPACK_COMPOSE_FILES[selectedSourceIdx].content)}
                className="bg-[#212c40] hover:bg-[#2c3b54] active:scale-95 text-slate-100 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                <span>{copiedFile ? "Copied!" : "Copy Code"}</span>
              </button>
              <button
                onClick={() => triggerDownload(JETPACK_COMPOSE_FILES[selectedSourceIdx].name, JETPACK_COMPOSE_FILES[selectedSourceIdx].content)}
                className="bg-[#1b4d3e] hover:bg-[#2e7d32] active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .kt</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4 font-kantumruy italic">
             {JETPACK_COMPOSE_FILES[selectedSourceIdx].description}
          </p>

          {/* Code IDE structure layout split tabs */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
            
            {/* Sidebar source items selector */}
            <div className="md:w-1/3 flex md:flex-col overflow-x-auto md:overflow-y-auto pr-2 gap-1.5 custom-scrollbar bg-[#090d16] p-2 rounded-2xl select-none">
              {JETPACK_COMPOSE_FILES.map((file, idx) => (
                <div 
                  key={file.name}
                  onClick={() => setSelectedSourceIdx(idx)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold flex items-center justify-between gap-2.5 shrink-0 transition-all ${
                    selectedSourceIdx === idx 
                      ? 'bg-[#1b4d3e]/20 text-[#ffd700] border border-[#2e7d32]/50' 
                      : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📄</span>
                    <div className="text-left font-mono font-bold leading-normal">
                      {file.name}
                      <span className="block text-[8px] opacity-75 font-normal tracking-wide text-gray-500 pt-0.5">
                        {file.path.split('/').slice(0, -1).join('/')}
                      </span>
                    </div>
                  </div>
                  {selectedSourceIdx === idx && <ChevronRight className="w-4 h-4 shrink-0 hidden md:block" />}
                </div>
              ))}
            </div>

            {/* Code Highlight Screen viewer */}
            <div className="md:w-2/3 bg-[#0a0d14] rounded-2xl border border-[#1f293d] p-4 font-mono text-[11px] leading-relaxed overflow-auto relative">
              <span className="absolute top-2.5 right-3.5 text-[8.0px] font-black uppercase text-slate-600 select-none">
                 KOTLIN ENGINE IDE PREVIEW
              </span>
              <pre className="text-slate-300 w-full select-text whitespace-pre-wrap">
                <code>
                  {JETPACK_COMPOSE_FILES[selectedSourceIdx].content}
                </code>
              </pre>
            </div>

          </div>

          <div className="border-t border-[#222c3d] pt-3.5 mt-3.5 flex justify-between items-center text-[10px] text-slate-500">
             <span>Package Directory: <code>com/puradurian/pos/...</code></span>
             <span>Play Protect Compliance Clean Verified ✅</span>
          </div>

        </div>

      </main>

      {/* POPUP: COMPACT DIALOG FOR RECORDING NEW SALE */}
      <AnimatePresence>
        {showAddSaleModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121824] border border-[#1f293d] p-6 rounded-3xl max-w-sm w-full font-kantumruy flex flex-col gap-4 relative overflow-hidden"
            >
              <button 
                onClick={() => {
                  setShowAddSaleModal(false);
                  setEditingSale(null);
                }}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-koulen text-lg text-[#ffd700] tracking-wide text-center">
                 {editingSale ? "កែប្រែការលក់ជាក់ស្តែង" : "កត់ត្រាការលក់ថ្មី"}
              </h3>

              {/* Inner form variables */}
              <AddSaleForm 
                stocks={stocks} 
                rate={EXCH_RATE}
                editingSale={editingSale}
                onDatePickerTrigger={(currentDate, currentTime, callback) => {
                  setDatePickerType('sale');
                  setPickerSelectedDate(currentDate);
                  setPickerSelectedTime(currentTime);
                  setOnDatePickerSave(() => callback);
                  setShowDatePicker(true);
                }}
                onSave={(newSale) => {
                  if (editingSale) {
                    // Restore previous stock
                    const oldStockId = editingSale.stockItemId;
                    const restoredStocks = stocks.map(st => {
                      if (st.id === oldStockId) {
                        return { ...st, remainingStock: st.remainingStock + editingSale.weight };
                      }
                      return st;
                    });
                    
                    // Deduct new stock
                    const finalStocks = restoredStocks.map(st => {
                      if (st.id === newSale.stockItemId) {
                        return { ...st, remainingStock: Math.max(0, st.remainingStock - newSale.weight) };
                      }
                      return st;
                    });
                    setStocks(finalStocks);

                    // Replace sale
                    setSales(sales.map(s => s.id === editingSale.id ? newSale : s));
                  } else {
                    setSales([newSale, ...sales]);
                    // Deduct actual remains
                    const stockIdx = stocks.findIndex(s => s.id === newSale.stockItemId);
                    if (stockIdx !== -1) {
                      const copy = [...stocks];
                      copy[stockIdx].remainingStock = Math.max(0, copy[stockIdx].remainingStock - newSale.weight);
                      setStocks(copy);
                    }
                  }
                  
                  setShowAddSaleModal(false);
                  setEditingSale(null);
                  
                  // Pop paper invoice modal immediately
                  setActiveReceiptSale(newSale);
                }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP: COMPACT DIALOG FOR UPDATING/CREATING STOCK */}
      <AnimatePresence>
        {showAddStockModal && (
          <div className="fixed inset-0 bg-black/55 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full font-kantumruy flex flex-col gap-4 relative shadow-xl text-slate-800"
            >
              <button 
                onClick={() => {
                  setShowAddStockModal(false);
                  setEditingStock(null);
                }}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 cursor-pointer rounded-full hover:bg-slate-100 transition-all border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-black text-slate-800 text-center">
                 {editingStock ? "កែប្រែព័ត៌មានស្តុកទុរេន" : "បន្ថែមព័ត៌មានស្តុកទុរេនថ្មី"}
              </h3>

              <AddStockForm 
                item={editingStock}
                onDatePickerTrigger={(currentDate, currentTime, callback) => {
                  setDatePickerType('stock');
                  setPickerSelectedDate(currentDate);
                  setPickerSelectedTime(currentTime);
                  setOnDatePickerSave(() => callback);
                  setShowDatePicker(true);
                }}
                onSave={(savedItem) => {
                  if (editingStock) {
                    setStocks(stocks.map(s => s.id === savedItem.id ? savedItem : s));
                  } else {
                    setStocks([...stocks, savedItem]);
                  }
                  setShowAddStockModal(false);
                  setEditingStock(null);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP: COMPACT DIALOG FOR ADDING ENTIRE RECRUITS/STAFF */}
      <AnimatePresence>
        {showAddStaffModal && (
          <div className="fixed inset-0 bg-black/55 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full font-kantumruy flex flex-col gap-4 relative shadow-xl text-slate-800"
            >
              <button 
                onClick={() => setShowAddStaffModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 cursor-pointer rounded-full hover:bg-slate-100 transition-all border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-black text-slate-800 text-center">
                 + បង្កើតគណនីថ្មី
              </h3>

              <AddStaffForm 
                onSave={(newStaff) => {
                  setStaff([...staff, newStaff]);
                  setShowAddStaffModal(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP: COMPACT DIALOG FOR INCOME EXPENSE TRACKING LOG */}
      <AnimatePresence>
        {showAddExpenseModal && (
          <div className="fixed inset-0 bg-black/55 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full font-kantumruy flex flex-col gap-4 relative shadow-xl text-slate-800"
            >
              <button 
                onClick={() => setShowAddExpenseModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 cursor-pointer rounded-full hover:bg-slate-100 transition-all border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-black text-slate-800 text-center">
                 កត់ត្រាការចំណាយថ្មី
              </h3>

              <AddExpenseForm 
                onSave={(newExp) => {
                  setExpenses([newExp, ...expenses]);
                  setShowAddExpenseModal(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP: REFACTORED INVOICE SCREEN (វិក្កយបត្រ - Model after invoce view.jpg) */}
      <AnimatePresence>
        {activeReceiptSale && (
          <div className="fixed inset-0 bg-[#F8F9FA] z-50 flex flex-col select-text font-kantumruy overflow-hidden text-slate-900">
            {/* Screen Header */}
            <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
              <button 
                onClick={() => setActiveReceiptSale(null)}
                className="p-1 text-[#1B4D3E] hover:opacity-85 font-extrabold text-sm flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 font-black text-[#1B4D3E]" /> ត្រឡប់ក្រោយ
              </button>
              <h3 className="text-base font-black text-slate-800">វិក្កយបត្រសរុប</h3>
              <div className="w-16"></div>
            </div>

            {/* Scrollable Panel containing selector and receipt paper */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center gap-4">
              
              {/* Top Date Selector */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between w-full max-w-md shadow-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold">ជ្រើសរើសថ្ងៃខែឆ្នាំ៖</span>
                  <span className="text-sm font-bold text-[#1B4D3E] font-mono mt-1">
                    {(() => {
                      const dateStr = invoiceSelectedDate;
                      if (!dateStr || !dateStr.includes('-')) return dateStr;
                      const parts = dateStr.split('-');
                      if (parts.length === 3) {
                        return `${parts[2]}-${parts[1]}-${parts[0]}`;
                      }
                      return dateStr;
                    })()}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setPickerSelectedDate(invoiceSelectedDate);
                    setPickerSelectedTime('12:00');
                    setOnDatePickerSave(() => {
                      return (newDate: string, newTime: string) => {
                        setInvoiceSelectedDate(newDate);
                      };
                    });
                    setShowDatePicker(true);
                  }}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-[#1B4D3E] rounded-xl flex items-center justify-center cursor-pointer transition-all border border-slate-200 active:scale-95"
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>

              {/* Unified Invoice Ticket (Paper style) */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl w-full max-w-md shadow-md flex flex-col select-text text-slate-900">
                {/* Golden durian logo inside a square frame */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-2xl border-4 border-[#FFC72C] overflow-hidden p-1 flex items-center justify-center bg-white shadow-xs">
                    <img 
                      src="/src/assets/images/golden_durian_coin_1781835777529.jpg" 
                      alt="Golden Durian" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>

                {/* Headings */}
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black font-kantumruy text-[#1a1a1a]">ពូរ៉ា ទុរេនខ្មែរធម្មជាតិ</h3>
                  <p className="text-[11px] text-slate-600 font-medium">វិក្កយបត្រទូទាត់ប្រាក់ជូនអតិថិជនប្រចាំថ្ងៃ</p>
                  <p className="text-[10px] text-slate-500 font-mono">Telegram: 087 567 956</p>
                </div>

                {/* Thick divider */}
                <div className="border-t-2 border-slate-900 my-4"></div>

                {/* Metadata section */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                  <span>ថ្ងៃខែឆ្នាំ៖ {(() => {
                    const dateStr = invoiceSelectedDate;
                    if (!dateStr || !dateStr.includes('-')) return dateStr;
                    const parts = dateStr.split('-');
                    if (parts.length === 3) {
                      return `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                    return dateStr;
                  })()}</span>
                  <span className="text-slate-800">
                    លក់បាន៖ {sales.filter(s => s.date === invoiceSelectedDate).length} លើក
                  </span>
                </div>

                {/* Business address as requested */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] text-slate-600 mt-2.5 leading-relaxed">
                  📍 <strong>អាសយដ្ឋាន៖</strong> សង្កាត់បឹងសាឡាង, ខណ្ឌទួលគោក, រាជធានីភ្នំពេញ
                </div>

                {/* Light divider */}
                <div className="border-t border-slate-200 my-3.5"></div>

                {/* Columns table header */}
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-800 tracking-wider pb-2 border-b border-slate-200 mb-2">
                  <span>ឈ្មោះទុរេន / ប្រភេទទូទាត់ / ទំហំលក់</span>
                  <span>តម្លៃសរុប (៛)</span>
                </div>

                {/* Listing items */}
                <div className="space-y-4">
                  {(() => {
                    const invoiceSales = sales.filter(s => s.date === invoiceSelectedDate);
                    if (invoiceSales.length === 0) {
                      return (
                        <div className="py-6 text-center text-slate-400 text-xs">
                          គ្មានការលក់ប្រចាំថ្ងៃនេះទេសម្រាប់កាលបរិច្ឆេទនេះ!
                        </div>
                      );
                    }
                    return invoiceSales.map((sale, i) => (
                      <div key={sale.id} className="flex justify-between items-start text-xs border-b border-slate-50 pb-2">
                        <div className="space-y-1">
                          <h5 className="font-extrabold text-slate-900">
                            {i + 1}. {sale.name} ({sale.mode === 'fruit' ? 'លក់ជាផ្លែ' : 'បកសាច់សុទ្ធ'})
                          </h5>
                          <p className="text-[10px] text-slate-500 font-mono pl-3">
                            {sale.weight} គីឡូ x {sale.price.toLocaleString()} ៛
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#1B4D3E] font-bold block">
                            {sale.paymentMethod === 'cash' ? 'លុយសុទ្ធ' : 'ABA'}
                          </span>
                          <span className="font-black text-slate-900 font-mono font-bold">
                            {sale.amountPaidKhr.toLocaleString()} ៛
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Thick divider before grand totals */}
                <div className="border-t-2 border-slate-950 my-4"></div>

                {/* Grand Total */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-800">ទូទាត់សរុប (៛)៖</span>
                    <span className="font-black text-lg text-slate-950 font-mono font-bold">
                      {sales.filter(s => s.date === invoiceSelectedDate).reduce((acc, curr) => acc + curr.amountPaidKhr, 0).toLocaleString()} ៛
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-600">ទូទាត់សរុប ($)៖</span>
                    <span className="font-black text-sm text-slate-600 font-mono font-bold">
                      $ {sales.filter(s => s.date === invoiceSelectedDate).reduce((acc, curr) => acc + curr.amountPaidUsd, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 mt-4 text-[9px] text-slate-400 text-center font-bold">
                  សូមអរគុណសម្រាប់គាំទ្រផលិតផលទុរេនខ្មែរធម្មជាតិ!
                </div>
              </div>

              {/* Yellow CTA Action Button precisely matching mockup button color and layout */}
              <div className="w-full max-w-md pb-8">
                <button 
                  onClick={() => {
                    alert("ទាញយកវិក្កយបត្រជា JPG ជោគជ័យ និងរក្សាទុកក្នុងសឺមីរូបភាពរួចរាល់! 📥");
                  }}
                  className="w-full py-4 bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer border border-[#E5B324]"
                >
                  <Share2 className="w-4 h-4 text-slate-950" />
                  <span>ទាញយកវិក្កយបត្រជា JPG</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive print alert feedback notification overlay */}
      {showPrintToast && (
        <div className="fixed bottom-6 right-6 bg-[#1a2d37] border-2 border-emerald-500/40 text-emerald-400 rounded-2xl p-4 shadow-xl z-50 flex items-center gap-3 max-w-sm animate-bounce">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h5 className="font-bold text-xs">Print Job Dispatched! 📄</h5>
            <p className="text-[10px] text-slate-400 leading-tight">
              Bluetooth ticket receipt successfully printed on ESC/POS thermal printer standard size 58mm.
            </p>
          </div>
        </div>
      )}

      {/* POPUP: COMPREHENSIVE COMPANION CALENDAR DATE PICKER */}
      <AnimatePresence>
        {showDatePicker && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121824] border-2 border-[#1b4d3e] p-5 rounded-3xl max-w-sm w-full font-kantumruy flex flex-col gap-4 relative text-white"
            >
              <h3 className="text-xs font-bold text-[#ffd700] text-center uppercase tracking-wider flex items-center justify-center gap-1.5 pt-1">
                📅 រើសកាលបរិច្ឆេទ & ម៉ោងលក់
              </h3>
              
              {/* Month Header selector */}
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded-xl text-xs font-bold text-[#ffd700]">
                <span>‹</span>
                <span>មិថុនា ២០២៦ (June 2026)</span>
                <span>›</span>
              </div>

              {/* Day of Week Labels (Khmer) */}
              <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-slate-400 text-center">
                <span>ចន្ទ</span>
                <span>អង្គា</span>
                <span>ពុធ</span>
                <span>ព្រហ</span>
                <span>សុក្រ</span>
                <span>សៅរ៍</span>
                <span>អាទិ</span>
              </div>

              {/* Days Grid (specifically selected dates) */}
              <div className="grid grid-cols-7 gap-1 text-xs">
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1;
                  const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
                  const isSelected = pickerSelectedDate === dateStr;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setPickerSelectedDate(dateStr)}
                      className={`h-8 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                        isSelected ? 'bg-[#ffd700] text-slate-900 scale-105' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Presets segment */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPickerSelectedDate('2026-06-19');
                    setPickerSelectedTime('14:30');
                  }}
                  className="bg-[#1b4d3e]/20 border border-[#2e7d32]/30 text-[#ffd700] py-1.5 rounded-lg hover:bg-[#1b4d3e]/40"
                >
                  ថ្ងៃនេះ (Today)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPickerSelectedDate('2026-06-18');
                    setPickerSelectedTime('10:00');
                  }}
                  className="bg-slate-800 border border-slate-700 text-slate-300 py-1.5 rounded-lg hover:bg-slate-700"
                >
                  ម្សិលមិញ (Yesterday)
                </button>
              </div>

              {/* Time Selector component */}
              <div className="space-y-1 bg-slate-900/40 p-2 text-center rounded-xl border border-[#2e3c54]/50">
                <label className="text-[10px] text-slate-400 font-bold block">⏰ ម៉ោងជាក់លាក់ (Select Time)</label>
                <input 
                  type="time" 
                  value={pickerSelectedTime}
                  onChange={(e) => setPickerSelectedTime(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-[#ffd700] px-3 py-1 rounded-lg text-sm font-mono tracking-wider focus:outline-none"
                />
              </div>

              {/* Actions Footer */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
                <button 
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl transition-all text-slate-300 cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (onDatePickerSave) {
                      onDatePickerSave(pickerSelectedDate, pickerSelectedTime);
                    }
                    setShowDatePicker(false);
                  }}
                  className="py-2.5 bg-[#ffd700] hover:bg-[#ffea75] text-slate-900 rounded-xl transition-all cursor-pointer"
                >
                  យល់ព្រម (Select)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ==========================================
// SALES RECORDING FORM (PREMIUM LIGHT THEME)
// ==========================================

interface AddSaleFormProps {
  stocks: StockItem[];
  rate: number;
  editingSale: SaleItem | null;
  onDatePickerTrigger?: (currentDate: string, currentTime: string, callback: (newDate: string, newTime: string) => void) => void;
  onSave: (sale: SaleItem) => void;
}

function AddSaleForm({ stocks, rate, editingSale, onDatePickerTrigger, onSave }: AddSaleFormProps) {
  const [selectedStockId, setSelectedStockId] = useState(editingSale ? editingSale.stockItemId : (stocks[0]?.id || ''));
  const [selectedMode, setSelectedMode] = useState<'fruit' | 'flesh'>(editingSale ? editingSale.mode : 'fruit');
  const [fleshMeasurementType, setFleshMeasurementType] = useState<'fruit' | 'flesh'>(editingSale?.fleshMeasurementType || 'fruit');
  const [weight, setWeight] = useState(editingSale ? editingSale.weight : 1);
  const [overridePrice, setOverridePrice] = useState(editingSale ? editingSale.price : (stocks[0]?.sellPrice || 18000));
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'aba'>(editingSale ? editingSale.paymentMethod : 'cash');
  const [cashReceivedKhr, setCashReceivedKhr] = useState('');
  const [cashReceivedUsd, setCashReceivedUsd] = useState('');
  const [selectedDate, setSelectedDate] = useState(editingSale ? editingSale.date : '2026-06-19');
  const [selectedTime, setSelectedTime] = useState('14:30');

  // Local storage for uploaded QR (mock previewer)
  const [uploadedQrUrl, setUploadedQrUrl] = useState<string | null>(() => {
    return localStorage.getItem('mock_uploaded_aba_qr');
  });

  // Track prices override auto updating (only for new creations)
  useEffect(() => {
    if (!editingSale) {
      const s = stocks.find(i => i.id === selectedStockId);
      if (s) {
        setOverridePrice(s.sellPrice);
      }
    }
  }, [selectedStockId, stocks, editingSale]);

  const selectedStock = stocks.find(s => s.id === selectedStockId);

  // Calculations
  const finalTotalKhr = weight * overridePrice;
  const finalTotalUsd = finalTotalKhr / rate;
  
  // Split cash inputs conversion
  const paidKhr = parseFloat(cashReceivedKhr) || 0;
  const paidUsdToKhr = (parseFloat(cashReceivedUsd) || 0) * rate;
  const totalReceivedKhr = paidKhr + paidUsdToKhr;
  const changeKhrBalance = Math.max(0, totalReceivedKhr - finalTotalKhr);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const urlStr = event.target.result as string;
          setUploadedQrUrl(urlStr);
          localStorage.setItem('mock_uploaded_aba_qr', urlStr);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4 text-xs font-kantumruy select-none text-slate-800 bg-white">
      
      {/* Date of Sale - Multi-part custom selection layout */}
      <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <label className="text-[10px] font-bold text-slate-600 block pb-0.5">📅 ថ្ងៃលក់ & ម៉ោង (Time of Sale)</label>
        <div className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border border-slate-300 text-[#1B4D3E] select-text font-bold">
          <span className="font-mono text-xs">{selectedDate} — {selectedTime}</span>
          <button 
            type="button"
            onClick={() => {
              if (onDatePickerTrigger) {
                onDatePickerTrigger(selectedDate, selectedTime, (newDate, newTime) => {
                  setSelectedDate(newDate);
                  setSelectedTime(newTime);
                });
              }
            }}
            className="px-2.5 py-1 bg-[#1b4d3e] text-white text-[9px] font-bold rounded-lg border border-[#1b4d3e] hover:bg-[#153a2f] transition-all cursor-pointer select-none"
          >
            ប្តូរថ្ងៃ/ម៉ោង
          </button>
        </div>
      </div>

      {/* Durian Choice */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-600">សូមជ្រើសរើសប្រភេទទុរេន៖</label>
        <select 
          value={selectedStockId}
          onChange={(e) => setSelectedStockId(e.target.value)}
          className="w-full bg-white border-2 border-slate-900 text-slate-900 p-2.5 rounded-xl font-bold font-kantumruy focus:outline-none"
        >
          {stocks.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.code}) - សល់ជាផ្លែ {s.remainingStock} គីឡូ {s.remainingFleshStock !== undefined ? `/ សាច់ ${s.remainingFleshStock} គីឡូ` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Mode selection By Fruit "លក់ជា ផ្លែ" or "បកសាច់សុទ្ធ" */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-600">លក្ខខណ្ឌការលក់៖</label>
        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button"
            onClick={() => setSelectedMode('fruit')}
            className={`py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedMode === 'fruit' ? 'bg-[#1b4d3e]/10 text-[#1b4d3e] border-[#1b4d3e] border-2' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span>🍈</span>
            <span>លក់ជា ផ្លែ</span>
          </button>
          <button 
            type="button"
            onClick={() => setSelectedMode('flesh')}
            className={`py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedMode === 'flesh' ? 'bg-[#1b4d3e]/10 text-[#1b4d3e] border-[#1b4d3e] border-2' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span>🥩</span>
            <span>បកសាច់សុទ្ធ</span>
          </button>
        </div>
      </div>

      {/* Conditional Sub-options if 'បកសាច់សុទ្ធ' is chosen */}
      {selectedMode === 'flesh' && (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
          <label className="text-[10px] font-bold text-[#1b4d3e] block">សូមជ្រើសរើសជម្រើសកាត់ស្តុក៖</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFleshMeasurementType('fruit')}
              className={`py-1.5 rounded-lg border text-[10px] font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                fleshMeasurementType === 'fruit' ? 'bg-white text-[#1b4d3e] border-[#1b4d3e] shadow-xs' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span className="font-semibold">ផ្លែ (គីឡូ)</span>
              <span className="text-[8px] text-slate-400 font-normal">កាត់ចេញពីទម្ងន់ផ្លែសរុប</span>
            </button>
            <button
              type="button"
              onClick={() => setFleshMeasurementType('flesh')}
              className={`py-1.5 rounded-lg border text-[10px] font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                fleshMeasurementType === 'flesh' ? 'bg-white text-[#1b4d3e] border-[#1b4d3e] shadow-xs' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span className="font-semibold">សាច់សុទ្ធ (គីឡូ)</span>
              <span className="text-[8px] text-slate-400 font-normal">កាត់ចេញពីទម្ងន់សាច់សុទ្ធ</span>
            </button>
          </div>
        </div>
      )}

      {/* Weight kg */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-600">ទម្ងន់លក់សរុប (គីឡូ)</label>
        <input 
          type="number"
          step="any"
          value={weight}
          onChange={(e) => setWeight(Math.max(0.01, parseFloat(e.target.value) || 0))}
          className="w-full bg-white border-2 border-slate-900 text-slate-900 p-2.5 rounded-xl font-mono text-sm leading-none focus:outline-none focus:border-[#1b4d3e]"
        />
      </div>

      {/* UNIT PRICE OVERRIDE CAPABILITY */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-600">តម្លៃលក់ចេញ / 1គីឡូ (៛) [កែប្រែបាន]</label>
        <input 
          type="number"
          value={overridePrice}
          onChange={(e) => setOverridePrice(Math.max(0, parseFloat(e.target.value) || 0))}
          className="w-full bg-white border-2 border-slate-900 text-[#1b4d3e] p-2.5 rounded-xl font-mono text-sm leading-none focus:outline-none focus:border-[#1b4d3e]"
        />
      </div>

      {/* Running aggregate total */}
      <div className="bg-[#1b4d3e]/10 border border-[#1b4d3e]/20 p-3 rounded-2xl flex justify-between items-center">
        <div>
          <span className="text-[10px] text-slate-500 leading-none">ប្រាក់ត្រូវទូទាត់សរុប</span>
          <h4 className="font-kantumruy font-bold text-[#1b4d3e] text-base leading-none pt-1">
             {finalTotalKhr.toLocaleString()} KHR
          </h4>
        </div>
        <span className="text-xs font-bold text-slate-900 font-mono bg-slate-100 px-3.5 py-1 rounded-xl border border-slate-300">
          $ {finalTotalUsd.toFixed(2)}
        </span>
      </div>

      {/* Payment Cash or ABA QR */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-600">ជម្រើសទូទាត់៖</label>
        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              paymentMethod === 'cash' ? 'bg-[#1b4d3e]/10 text-[#1b4d3e] border-[#1b4d3e] border-2' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span>លុយសុទ្ធ 💵</span>
          </button>
          <button 
            type="button"
            onClick={() => setPaymentMethod('aba')}
            className={`py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              paymentMethod === 'aba' ? 'bg-[#1b4d3e]/10 text-[#1b4d3e] border-[#1b4d3e] border-2' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span>ABA QR 📱</span>
          </button>
        </div>
      </div>

      {/* Payment details inputs */}
      {paymentMethod === 'cash' ? (
        <div className="space-y-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-600 block">ទទួលប្រាក់ពីអតិថិជន (Cash Received)</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold">ប្រាក់រៀល (៛)</label>
                <input 
                  type="text"
                  value={cashReceivedKhr}
                  onChange={(e) => setCashReceivedKhr(e.target.value)}
                  className="w-full bg-white border-2 border-slate-900 text-slate-900 p-2 rounded-lg font-mono focus:outline-none text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold">ប្រាក់ដុល្លារ ($)</label>
                <input 
                  type="text"
                  value={cashReceivedUsd}
                  onChange={(e) => setCashReceivedUsd(e.target.value)}
                  className="w-full bg-white border-2 border-slate-900 text-slate-900 p-2 rounded-lg font-mono focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-slate-900 text-xs flex justify-between items-center">
            <span className="font-bold text-slate-700">ប្រាក់អាប់ជូនអតិថិជន៖</span>
            <span className="font-mono font-bold text-[#1b4d3e]">
               {changeKhrBalance.toLocaleString()} KHR (=${(changeKhrBalance/rate).toFixed(2)})
             </span>
          </div>
        </div>
      ) : (
        /* ABA QR Offline Showcase with template upload inside dialog */
        <div className="bg-[#1b4d3e]/5 border border-[#1b4d3e]/20 p-3 rounded-2xl space-y-2 text-center text-xs text-slate-800">
          <QrCode className="w-8 h-8 text-[#1b4d3e] mx-auto animate-pulse" />
          <h5 className="font-bold text-[#1b4d3e]">ABA Classic & Gold QR Template Showcase</h5>
          <p className="text-[10px] text-slate-500 leading-normal">
             ប្រព័ន្ធដំណើរការបានគ្រប់ស្ថានភាព Offline! បង្ហាញ QR សម្រាប់ទទួលប្រាក់ពីអតិថិជន។
          </p>

          <div className="mt-2.5">
            {uploadedQrUrl ? (
              <div className="space-y-1">
                <img 
                  src={uploadedQrUrl} 
                  alt="My ABA QR" 
                  className="w-32 h-32 rounded-xl mx-auto object-cover border border-slate-300" 
                />
                <button 
                  type="button"
                  onClick={() => {
                    setUploadedQrUrl(null);
                    localStorage.removeItem('mock_uploaded_aba_qr');
                  }}
                  className="text-[9px] text-rose-600 hover:underline block mx-auto pt-1 font-bold"
                >
                  ដោះចេញ
                </button>
              </div>
            ) : (
              <label className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer block text-center border border-slate-300">
                <span>📤 បញ្ចូលរូបភាពកូដ QR របស់លោកអ្នក</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleQrUpload} 
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <button 
        type="button"
        onClick={() => {
          if (!selectedStock) return;
          const sale: SaleItem = {
            id: editingSale ? editingSale.id : 'sale_' + Math.random().toString(36).substr(2, 9),
            stockItemId: selectedStock.id,
            name: selectedStock.name,
            code: selectedStock.code,
            mode: selectedMode,
            fleshMeasurementType: selectedMode === 'flesh' ? fleshMeasurementType : undefined,
            weight: weight,
            price: overridePrice,
            paymentMethod: paymentMethod,
            amountPaidKhr: finalTotalKhr,
            amountPaidUsd: finalTotalUsd,
            changeKhr: changeKhrBalance,
            date: selectedDate
          };
          onSave(sale);
        }}
        className="w-full py-3.5 bg-[#1b4d3e] hover:bg-[#12362b] text-white rounded-xl font-bold tracking-wide active:scale-[0.98] transition-all shadow-sm text-xs cursor-pointer"
      >
        {editingSale ? "រក្សាការកែប្រែការលក់ 💾" : "កត់ត្រាការលក់ និងបោះពុម្ព វិក្កយបត្រ 🧾"}
      </button>

    </div>
  );
}

// ==========================================
// STOCKS CRUD FORM
// ==========================================

interface AddStockFormProps {
  item: StockItem | null;
  onDatePickerTrigger?: (currentDate: string, currentTime: string, callback: (newDate: string, newTime: string) => void) => void;
  onSave: (stock: StockItem) => void;
}

function AddStockForm({ item, onDatePickerTrigger, onSave }: AddStockFormProps) {
  const [name, setName] = useState(item?.name || '');
  const [code, setCode] = useState(item?.code || '');
  const [buyPrice, setBuyPrice] = useState(item?.buyPrice || 14000);
  const [sellPrice, setSellPrice] = useState(item?.sellPrice || 18000);
  const [totalStock, setTotalStock] = useState(item?.totalStock || 100);
  const [remainingStock, setRemainingStock] = useState(item?.remainingStock || 100);
  const [threshold, setThreshold] = useState(item?.lowStockThreshold || 10);
  const [purchaseDate, setPurchaseDate] = useState(item?.purchaseDate || '2026-06-18');

  return (
    <div className="space-y-3.5 text-xs font-kantumruy select-none text-slate-300">
      
      {/* Date of Purchase */}
      <div className="space-y-1 bg-slate-900/40 p-2.5 rounded-2xl border border-[#2e3c54]/50">
        <label className="text-slate-400 font-bold block pb-0.5">📅 ថ្ងៃទិញចូល (Date of Purchase)</label>
        <div className="flex justify-between items-center bg-[#1a2233] px-3 py-2 rounded-xl border border-[#2e3c54] text-[#ffd700] select-text font-bold">
          <span className="font-mono text-xs">{purchaseDate}</span>
          <button 
            type="button"
            onClick={() => {
              if (onDatePickerTrigger) {
                onDatePickerTrigger(purchaseDate, '12:00', (newDate) => {
                  setPurchaseDate(newDate);
                });
              }
            }}
            className="px-2.5 py-1 bg-[#1b4d3e] text-[#ffd700] text-[9px] font-bold rounded-lg border border-[#ffd700]/30 hover:bg-[#153a2f] transition-all cursor-pointer select-none"
          >
            ប្តូរថ្ងៃ
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-slate-400 font-bold block">ឈ្មោះទុរេន</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#1e293b] border border-[#2e3c54] text-white p-2.5 rounded-xl font-semibold focus:outline-none"
          placeholder="ឈ្មោះទុរេន"
        />
      </div>

      <div className="space-y-1">
        <label className="text-slate-400 font-bold block">កូដសម្គាល់ទុរេន</label>
        <input 
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-[#1e293b] border border-[#2e3c54] text-white p-2.5 rounded-xl font-mono focus:outline-none"
          placeholder="បញ្ចូលកូដសម្គាល់"
        />
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="text-slate-400 font-bold block">តម្លៃទិញចូល (៛)</label>
          <input 
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#1e293b] border border-[#2e3c54] text-white p-2.5 rounded-xl font-mono focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-bold block">តម្លៃលក់ចេញ (៛)</label>
          <input 
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#1e293b] border border-[#2e3c54] text-white p-2.5 rounded-xl font-mono focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="text-slate-400 font-bold block">ស្តុកទុរេនថ្មី (គីឡូ)</label>
          <input 
            type="number"
            value={totalStock}
            onChange={(e) => setTotalStock(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#1e293b] border border-[#2e3c54] text-white p-2.5 rounded-xl font-mono focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-bold block">ស្តុកនៅសល់ជាក់ស្តែង (គីឡូ)</label>
          <input 
            type="number"
            value={remainingStock}
            onChange={(e) => setRemainingStock(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#1e293b] border border-[#2e3c54] text-[#ffd700] p-2.5 rounded-xl font-mono focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-slate-400 font-bold block">ព្រមានស្តុកជិតអស់ (គីឡូ)</label>
        <input 
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value) || 10)}
          className="w-full bg-[#1e293b] border border-[#2e3c54] text-rose-400 p-2.5 rounded-xl font-mono focus:outline-none"
        />
      </div>

      <button
        onClick={() => {
          onSave({
            id: item?.id || 'stock_' + Math.random().toString(36).substr(2, 9),
            code,
            name,
            buyPrice,
            sellPrice,
            totalStock,
            remainingStock,
            lowStockThreshold: threshold,
            purchaseDate,
            dateAdded: item?.dateAdded || '2026-06-18'
          });
        }}
        className="w-full py-3 bg-[#ffd700] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-center active:scale-95 transition-all mt-4"
      >
        រក្សាទុកព័ត៌មានស្តុក
      </button>

    </div>
  );
}

// ==========================================
// ADD EXPENSE FORM
// ==========================================

interface AddExpenseFormProps {
  onSave: (exp: ExpenseItem) => void;
}

function AddExpenseForm({ onSave }: AddExpenseFormProps) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState<'fuel' | 'gas' | 'salary' | 'other'>('fuel');

  return (
    <div className="space-y-3.5 text-xs font-kantumruy select-none text-slate-300">
      <div className="space-y-1">
        <label className="text-slate-400 font-bold block">ប្រភេទចំណាយ៖</label>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <button 
            type="button" 
            onClick={() => setCat('fuel')}
            className={`py-1.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${cat === 'fuel' ? 'bg-rose-500/20 text-rose-400 border-rose-500' : 'bg-slate-900 border-[#2e3c54]'}`}
          >
            <span>🏍️ សាំងម៉ូតូ</span>
          </button>
          <button 
            type="button" 
            onClick={() => setCat('gas')}
            className={`py-1.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${cat === 'gas' ? 'bg-blue-500/20 text-blue-400 border-blue-500' : 'bg-slate-900 border-[#2e3c54]'}`}
          >
            <span>🚗 ហ្គាសឡាន</span>
          </button>
          <button 
            type="button" 
            onClick={() => setCat('salary')}
            className={`py-1.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${cat === 'salary' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-slate-900 border-[#2e3c54]'}`}
          >
            <span>👤 ប្រាក់ខែបុគ្គលិក</span>
          </button>
          <button 
            type="button" 
            onClick={() => setCat('other')}
            className={`py-1.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${cat === 'other' ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-900 border-[#2e3c54]'}`}
          >
            <span>🧾 ចំណាយផ្សេងៗ</span>
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-slate-400 font-bold block">ពិពណ៌នាអំពីការចំណាយ</label>
        <input 
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-[#1e293b] border border-[#2e3c54] text-white p-2.5 rounded-xl font-semibold focus:outline-none"
          placeholder="ពិពណ៌នាការចំណាយ"
        />
      </div>

      <div className="space-y-1">
        <label className="text-slate-400 font-bold block">ចំនួនទឹកប្រាក់ (រៀល)</label>
        <input 
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-[#1e293b] border border-[#2e3c54] text-white p-2.5 rounded-xl font-mono focus:outline-none"
          placeholder="ចំនួនទឹកប្រាក់ជា (៛)"
        />
      </div>

      <button
        onClick={() => {
          onSave({
            id: 'exp_' + Math.random().toString(36).substr(2, 9),
            category: cat,
            description: desc,
            amountKhr: parseFloat(amount) || 0,
            date: '2026-06-19'
          });
        }}
        className="w-full py-3 bg-[#ffd700] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-center active:scale-95 transition-all mt-4"
      >
        កត់ត្រាការចំណាយ
      </button>
    </div>
  );
}

// ==========================================
// ADD STAFF FOR ADMINS
// ==========================================

interface AddStaffFormProps {
  onSave: (acc: StaffAccount) => void;
}

function AddStaffForm({ onSave }: AddStaffFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('staff');

  return (
    <div className="space-y-3.5 text-xs font-kantumruy select-none text-slate-300">
      <div className="space-y-1">
        <label className="text-slate-400 font-bold block">ឈ្មោះបុគ្គលិក</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#1e293b] border border-[#2e3c54] text-white p-2.5 rounded-xl font-semibold focus:outline-none"
          placeholder="ឈ្មោះពេញ"
        />
      </div>

      <div className="space-y-1">
        <label className="text-slate-400 font-bold block">លេខទូរស័ព្ទគណនី</label>
        <input 
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-[#1e293b] border border-[#2e3c54] text-white p-2.5 rounded-xl font-mono focus:outline-none"
          placeholder="លេខទូរស័ព្ទ"
        />
      </div>

      <div className="space-y-1">
        <label className="text-slate-400 font-bold block">តួនាទីគណនី</label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button 
            type="button" 
            onClick={() => setRole('admin')}
            className={`py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${role === 'admin' ? 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]' : 'bg-slate-900 border-[#2e3c54]'}`}
          >
            <span>អ្នកគ្រប់គ្រង 👑</span>
          </button>
          <button 
            type="button" 
            onClick={() => setRole('staff')}
            className={`py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${role === 'staff' ? 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]' : 'bg-slate-900 border-[#2e3c54]'}`}
          >
            <span>អ្នកតាមដាន 👥</span>
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          onSave({
            id: 'staff_' + Math.random().toString(36).substr(2, 9),
            name,
            phone,
            role
          });
        }}
        className="w-full py-3 bg-[#ffd700] hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-center active:scale-95 transition-all mt-4"
      >
        បង្កើតគណនីបុគ្គលិក
      </button>
    </div>
  );
}

// ===========================================
// EXTENSIONS HELPERS
// ===========================================

declare global {
  interface Array<T> {
    sumOfSalesKhr(): number;
  }
}

if (!Array.prototype.sumOfSalesKhr) {
  Array.prototype.sumOfSalesKhr = function(this: SaleItem[]) {
    return this.reduce((acc, curr) => acc + curr.amountPaidKhr, 0);
  };
}
