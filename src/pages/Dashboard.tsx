import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Calendar, Clock, MapPin, User, Settings, LogOut, ChevronRight, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { mockAppointments, doctors } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { ar } from "date-fns/locale";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [appointments, setAppointments] = useState(mockAppointments);
  
  // Reschedule state
  const [reschedulingAppointment, setReschedulingAppointment] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setPaymentSuccess(true);
      // In a real app, we would fetch the updated appointments from the backend here
      setTimeout(() => setPaymentSuccess(false), 5000);
    }
  }, [searchParams]);

  const filteredAppointments = appointments.filter(
    app => activeTab === "upcoming" ? app.status === "upcoming" : app.status === "completed"
  );

  const nextDays = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  const handleRescheduleClick = (appointment: any) => {
    setReschedulingAppointment(appointment);
    setSelectedDate(new Date()); 
    setSelectedSlot(appointment.time);
    setSuccessMessage(false);
  };

  const handleConfirmReschedule = () => {
    if (!selectedSlot || !reschedulingAppointment) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      setAppointments(prev => prev.map(app => 
        app.id === reschedulingAppointment.id 
          ? { ...app, date: format(selectedDate, "yyyy-MM-dd"), time: selectedSlot }
          : app
      ));
      setIsSubmitting(false);
      setSuccessMessage(true);
      
      setTimeout(() => {
        setReschedulingAppointment(null);
        setSuccessMessage(false);
      }, 2000);
    }, 1000);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setReschedulingAppointment(null);
      setSuccessMessage(false);
    }
  };

  const doctorForReschedule = reschedulingAppointment 
    ? doctors.find(d => d.id === reschedulingAppointment.doctorId) 
    : null;
    
  const availableSlots = doctorForReschedule?.availableSlots || ["09:00 ص", "10:30 ص", "01:00 م", "04:00 م"];

  return (
    <div className="min-h-screen bg-slate-50 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="md:w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                  أ
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">أحمد محمد</h2>
                  <p className="text-sm text-slate-500">مريض مسجل</p>
                </div>
              </div>

              <nav className="space-y-2">
                <a href="#" className="flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span>مواعيدي</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span>الملف الشخصي</span>
                  </div>
                </a>
                <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span>الإعدادات</span>
                  </div>
                </a>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                  </a>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence>
              {paymentSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-bold">تم تأكيد الحجز والدفع بنجاح!</h3>
                    <p className="text-sm text-green-700">لقد تم إضافة موعدك الجديد إلى قائمة المواعيد القادمة.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900 mb-6">إدارة المواعيد</h1>
              
              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b border-slate-100">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={cn(
                    "pb-4 px-2 font-medium text-sm transition-colors relative",
                    activeTab === "upcoming" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  المواعيد القادمة
                  {activeTab === "upcoming" && (
                    <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={cn(
                    "pb-4 px-2 font-medium text-sm transition-colors relative",
                    activeTab === "past" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  المواعيد السابقة
                  {activeTab === "past" && (
                    <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
                </button>
              </div>

              {/* Appointments List */}
              <div className="space-y-4">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, i) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-2xl border border-slate-100 hover:border-blue-100 bg-slate-50/50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={appointment.image} 
                          alt={appointment.doctorName} 
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">{appointment.doctorName}</h3>
                          <p className="text-sm text-slate-500">{appointment.specialty}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 bg-white px-4 py-3 rounded-xl border border-slate-100 w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span dir="ltr">{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>

                      {activeTab === "upcoming" && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => handleRescheduleClick(appointment)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                          >
                            تأجيل
                          </button>
                          <button className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                            إلغاء
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد مواعيد</h3>
                    <p className="text-slate-500 mb-6">ليس لديك أي مواعيد {activeTab === "upcoming" ? "قادمة" : "سابقة"} حالياً.</p>
                    {activeTab === "upcoming" && (
                      <Link 
                        to="/search"
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                      >
                        احجز موعداً جديداً
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {reschedulingAppointment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-xl z-50 overflow-hidden"
            >
              {successMessage ? (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">تم تأجيل الموعد بنجاح!</h3>
                  <p className="text-slate-600">
                    تم تحديث موعدك مع {reschedulingAppointment.doctorName} إلى يوم {format(selectedDate, "EEEE d MMMM", { locale: ar })} الساعة {selectedSlot}.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">تأجيل الموعد</h3>
                    <button 
                      onClick={closeModal}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <img 
                        src={reschedulingAppointment.image} 
                        alt={reschedulingAppointment.doctorName} 
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900">{reschedulingAppointment.doctorName}</h4>
                        <p className="text-sm text-blue-600">{reschedulingAppointment.specialty}</p>
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">اختر اليوم الجديد</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide">
                        {nextDays.map((date, i) => {
                          const isSelected = date.toDateString() === selectedDate.toDateString();
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedDate(date)}
                              className={cn(
                                "flex flex-col items-center justify-center min-w-[4.5rem] p-3 rounded-2xl border transition-all snap-start",
                                isSelected 
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20" 
                                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                              )}
                            >
                              <span className="text-xs mb-1">{format(date, "EEEE", { locale: ar })}</span>
                              <span className="text-lg font-bold">{format(date, "d")}</span>
                              <span className="text-xs">{format(date, "MMM", { locale: ar })}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-8">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">اختر الوقت الجديد</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              "py-2.5 rounded-xl text-sm font-medium border transition-all",
                              selectedSlot === slot
                                ? "bg-blue-50 border-blue-600 text-blue-700"
                                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 py-3 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={handleConfirmReschedule}
                        disabled={!selectedSlot || isSubmitting}
                        className={cn(
                          "flex-[2] py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
                          !selectedSlot 
                            ? "bg-slate-300 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                        )}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "تأكيد الموعد الجديد"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
