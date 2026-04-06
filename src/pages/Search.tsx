import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, Filter, Star, MapPin, Clock, ChevronDown, Map as MapIcon, List } from "lucide-react";
import { motion } from "motion/react";
import { doctors, specialties } from "@/data/mockData";
import { cn } from "@/lib/utils";
import Map from "@/components/Map";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const specialtyParam = searchParams.get("specialty") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesQuery = doctor.name.includes(searchQuery) || doctor.location.includes(searchQuery);
      const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
      return matchesQuery && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery, specialty: selectedSpecialty });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، المدينة..." 
                className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            
            <div className="md:w-64 relative">
              <select 
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none"
              >
                <option value="">كل التخصصات</option>
                {specialties.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors"
            >
              بحث
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  تصفية النتائج
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">التقييم</h4>
                  <div className="space-y-2">
                    {[5, 4, 3].map(rating => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <div className="flex items-center gap-1">
                          {Array.from({length: rating}).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                          <span className="text-sm text-slate-600 mr-1">فأكثر</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-medium text-slate-900 mb-3">التوفر</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-slate-600">متاح اليوم</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-slate-600">متاح غداً</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results List / Map View */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                {filteredDoctors.length} طبيب متاح
              </h2>
              
              {/* View Toggle */}
              <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    viewMode === "list" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <List className="w-4 h-4" />
                  القائمة
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    viewMode === "map" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <MapIcon className="w-4 h-4" />
                  الخريطة
                </button>
              </div>
            </div>

            {viewMode === "map" ? (
              <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200 h-[600px] overflow-hidden relative z-0">
                {filteredDoctors.length > 0 ? (
                  <Map doctors={filteredDoctors as any} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <MapIcon className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد مواقع لعرضها</h3>
                    <p className="text-slate-500">جرب البحث بكلمات مختلفة أو تغيير التخصص</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctors.map((doctor, i) => (
                  <motion.div 
                    key={doctor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6"
                  >
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-full sm:w-32 sm:h-32 rounded-2xl object-cover shrink-0"
                    />
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                              <Link to={`/doctor/${doctor.id}`} className="hover:text-blue-600 transition-colors">
                                {doctor.name}
                              </Link>
                            </h3>
                            <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-amber-700">{doctor.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>خبرة {doctor.experience}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                          {doctor.availableSlots.slice(0, 3).map(slot => (
                            <span key={slot} className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                              {slot}
                            </span>
                          ))}
                        </div>
                        <Link 
                          to={`/doctor/${doctor.id}`}
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors text-center shrink-0"
                        >
                          احجز موعد
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredDoctors.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SearchIcon className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">لم نجد نتائج مطابقة</h3>
                    <p className="text-slate-500">جرب البحث بكلمات مختلفة أو تغيير التخصص</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
