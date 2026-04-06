import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Calendar, Star, ShieldCheck, Clock, Users, Activity } from "lucide-react";
import { motion } from "motion/react";
import { specialties, doctors } from "@/data/mockData";

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query");
    navigate(`/search?q=${query}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-5 mix-blend-multiply" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6"
            >
              احجز موعدك مع أفضل الأطباء <span className="text-blue-600">بسهولة وسرعة</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-600 mb-10"
            >
              منصة شفاء توفر لك تجربة حجز مواعيد طبية سلسة وآمنة مع نخبة من الأطباء المعتمدين في مختلف التخصصات.
            </motion.p>

            {/* Search Box */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSearch}
              className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/5 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto border border-slate-100"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="absolute right-4 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  name="query"
                  placeholder="ابحث عن طبيب، تخصص، أو مستشفى..." 
                  className="w-full pl-4 pr-12 py-4 rounded-xl bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-colors whitespace-nowrap"
              >
                ابحث الآن
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-slate-100">
            {[
              { label: "طبيب معتمد", value: "+500", icon: Users },
              { label: "مريض سعيد", value: "+10k", icon: Star },
              { label: "تخصص طبي", value: "40", icon: ShieldCheck },
              { label: "حجز يومي", value: "+1000", icon: Calendar },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">التخصصات الطبية</h2>
              <p className="text-slate-600">اختر التخصص المناسب لحالتك واحجز موعدك</p>
            </div>
            <Link to="/search" className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
              عرض كل التخصصات
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {specialties.map((specialty, i) => (
              <motion.div
                key={specialty.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link 
                  to={`/search?specialty=${specialty.name}`}
                  className="group flex flex-col items-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Activity className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 text-center">{specialty.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">أطباء متميزون</h2>
              <p className="text-slate-600">نخبة من أفضل الأطباء تقييماً على المنصة</p>
            </div>
            <Link to="/search" className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
              عرض كل الأطباء
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.slice(0, 3).map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-900">{doctor.rating}</span>
                    <span className="text-xs text-slate-500">({doctor.reviews})</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-blue-600 mb-1">{doctor.specialty}</p>
                    <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span>خبرة {doctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>متاح اليوم</span>
                    </div>
                  </div>
                  <Link 
                    to={`/doctor/${doctor.id}`}
                    className="block w-full py-3 px-4 bg-slate-50 hover:bg-blue-600 text-slate-900 hover:text-white text-center rounded-xl font-medium transition-colors"
                  >
                    عرض الملف الشخصي
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">كيف تعمل منصة شفاء؟</h2>
            <p className="text-slate-400">خطوات بسيطة لحجز موعدك الطبي</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-800" />
            
            {[
              { title: "ابحث عن طبيب", desc: "استخدم محرك البحث للعثور على الطبيب المناسب لتخصصك ومنطقتك.", icon: Search },
              { title: "اختر الموعد", desc: "اطلع على تقييمات الطبيب والمواعيد المتاحة واختر ما يناسبك.", icon: Calendar },
              { title: "احجز موعدك", desc: "قم بتأكيد الحجز بخطوات بسيطة واحصل على تذكير قبل الموعد.", icon: ShieldCheck },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center mb-6 text-blue-400">
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
