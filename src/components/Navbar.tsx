import { Link, useLocation } from "react-router-dom";
import { Activity, Calendar, Search, User, Menu, X, Bell, LogOut, LogIn } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);
  const { user, profile, signInWithGoogle, logout } = useAuth();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "تذكير بموعد",
      message: "موعدك مع د. أحمد محمود غداً الساعة 10:30 ص.",
      time: "منذ ساعتين",
      unread: true,
    },
    {
      id: 2,
      title: "تأكيد الحجز",
      message: "تم تأكيد حجزك مع د. نورة السالم.",
      time: "منذ يومين",
      unread: false,
    }
  ]);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "ابحث عن طبيب", path: "/search" },
    { name: "مواعيدي", path: "/dashboard" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleNewNotification = (e: CustomEvent) => {
      const newNotif = {
        id: Date.now(),
        title: e.detail.title,
        message: e.detail.message,
        time: "الآن",
        unread: true,
      };
      setNotifications(prev => [newNotif, ...prev]);
    };

    window.addEventListener("new-notification", handleNewNotification as EventListener);
    return () => window.removeEventListener("new-notification", handleNewNotification as EventListener);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              شفاء
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-600",
                    location.pathname === link.path
                      ? "text-blue-600"
                      : "text-slate-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              {user && (
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                          <h3 className="font-bold text-slate-900">الإشعارات</h3>
                          <span onClick={markAllAsRead} className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">تحديد الكل كمقروء</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {notifications.length > 0 ? notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={cn(
                                "p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer",
                                notif.unread ? "bg-blue-50/30" : ""
                              )}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={cn("text-sm font-bold", notif.unread ? "text-slate-900" : "text-slate-700")}>
                                  {notif.title}
                                </h4>
                                {notif.unread && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>}
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{notif.message}</p>
                              <span className="text-xs text-slate-400">{notif.time}</span>
                            </div>
                          )) : (
                            <div className="p-4 text-center text-slate-500 text-sm">لا توجد إشعارات</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span>{profile?.displayName || user.email?.split('@')[0]}</span>
                      <span className="text-[10px] text-slate-400">
                        {profile?.role === 'admin' ? 'مدير' : profile?.role === 'doctor' ? 'طبيب' : 'مريض'}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signInWithGoogle('patient')}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </button>
              )}

              <Link
                to="/search"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm shadow-blue-600/20"
              >
                احجز موعداً
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-600 transition-colors p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-3 rounded-lg text-base font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-slate-700 bg-slate-50 rounded-xl font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>حسابي ({profile?.role === 'admin' ? 'مدير' : profile?.role === 'doctor' ? 'طبيب' : 'مريض'})</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 bg-red-50 rounded-xl font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle('patient');
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-slate-700 bg-slate-50 rounded-xl font-medium"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </button>
                )}
                <Link
                  to="/search"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 text-white bg-blue-600 rounded-xl font-medium shadow-sm"
                >
                  احجز موعداً الآن
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
