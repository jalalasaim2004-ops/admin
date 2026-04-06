import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Star, MapPin, Clock, ShieldCheck, Calendar as CalendarIcon, CheckCircle2, ChevronRight, ChevronLeft, Map as MapIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { doctors } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore, startOfDay } from "date-fns";
import { ar } from "date-fns/locale";
import DoctorReviews from "@/components/DoctorReviews";
import Map from "@/components/Map";

import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with the publishable key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

export default function DoctorProfile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const doctor = doctors.find(d => d.id === id);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Booking state
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(
    searchParams.get("canceled") === "true" ? "تم إلغاء عملية الدفع. لم يتم تأكيد الحجز." : null
  );
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">الطبيب غير موجود</h2>
          <Link to="/search" className="text-blue-600 hover:underline">العودة للبحث</Link>
        </div>
      </div>
    );
  }

  // Calendar logic
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }), // 0 = Sunday
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const today = startOfDay(new Date());

  const handleBook = async () => {
    if (!selectedSlot) return;
    setIsBooking(true);
    setBookingError(null);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          doctorName: doctor.name,
          price: doctor.price,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedSlot,
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize. Check your VITE_STRIPE_PUBLISHABLE_KEY.");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setBookingError(err.message || "حدث خطأ أثناء معالجة الدفع.");
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row gap-8">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover shadow-md"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{doctor.name}</h1>
                      <p className="text-lg text-blue-600 font-medium mb-4">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-amber-700 text-lg">{doctor.rating}</span>
                      <span className="text-sm text-amber-600/80">({doctor.reviews})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-slate-400" />
                      <span>خبرة {doctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <span>مدة الكشف: 30 دقيقة</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-3">نبذة عن الطبيب</h3>
                    <p className="text-slate-600 leading-relaxed">{doctor.about}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-blue-600" />
                موقع العيادة
              </h3>
              <div className="h-[300px] rounded-2xl overflow-hidden border border-slate-200 relative z-0">
                <Map doctors={[doctor as any]} center={doctor.coordinates as [number, number]} zoom={13} />
              </div>
              <p className="mt-4 text-slate-600 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400" />
                {doctor.location}
              </p>
            </div>

            {/* Reviews */}
            <DoctorReviews doctorId={doctor.id} />
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
              <AnimatePresence mode="wait">
                {!bookingSuccess ? (
                  <motion.div
                    key="booking-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <CalendarIcon className="w-6 h-6 text-blue-600" />
                      احجز موعدك
                    </h3>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-slate-900">سعر الكشف</span>
                        <span className="text-xl font-bold text-blue-600">{doctor.price} ريال</span>
                      </div>
                    </div>

                    {/* Full Calendar View */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-900">
                          {format(currentMonth, "MMMM yyyy", { locale: ar })}
                        </h4>
                        <div className="flex gap-1">
                          <button 
                            onClick={nextMonth}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={prevMonth}
                            disabled={isBefore(currentMonth, startOfMonth(today))}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["ح", "ن", "ث", "ر", "خ", "ج", "س"].map((day, i) => (
                          <div key={i} className="text-center text-xs font-medium text-slate-500 py-2">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {daysInMonth.map((date, i) => {
                          const isSelected = isSameDay(date, selectedDate);
                          const isCurrentMonth = isSameMonth(date, currentMonth);
                          const isPast = isBefore(startOfDay(date), today);

                          return (
                            <button
                              key={i}
                              onClick={() => !isPast && setSelectedDate(date)}
                              disabled={isPast}
                              className={cn(
                                "aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all",
                                !isCurrentMonth && "text-slate-300",
                                isCurrentMonth && !isPast && !isSelected && "text-slate-700 hover:bg-blue-50 hover:text-blue-600",
                                isPast && "text-slate-300 cursor-not-allowed",
                                isSelected && "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              )}
                            >
                              {format(date, "d")}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-8">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">اختر الوقت</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {doctor.availableSlots.map((slot) => (
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

                    {bookingError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                        {bookingError}
                      </div>
                    )}

                    <button
                      onClick={handleBook}
                      disabled={!selectedSlot || isBooking}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
                        !selectedSlot 
                          ? "bg-slate-300 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                      )}
                    >
                      {isBooking ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "تأكيد الحجز"
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">تم الحجز بنجاح!</h3>
                    <p className="text-slate-600 mb-8">
                      تم تأكيد موعدك مع {doctor.name} يوم {format(selectedDate, "EEEE d MMMM", { locale: ar })} الساعة {selectedSlot}.
                    </p>
                    <Link
                      to="/dashboard"
                      className="block w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-medium transition-colors"
                    >
                      عرض مواعيدي
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
