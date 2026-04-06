import { Activity, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold">شفاء</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              منصتك الموثوقة لحجز المواعيد الطبية بسهولة وسرعة. نربطك بأفضل الأطباء والمراكز الصحية في منطقتك.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm hover:text-blue-400 transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link to="/search" className="text-sm hover:text-blue-400 transition-colors">ابحث عن طبيب</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm hover:text-blue-400 transition-colors">مواعيدي</Link>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">من نحن</a>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-white font-semibold mb-4">أهم التخصصات</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/search?specialty=طب عام" className="text-sm hover:text-blue-400 transition-colors">طب عام</Link>
              </li>
              <li>
                <Link to="/search?specialty=طب الأسنان" className="text-sm hover:text-blue-400 transition-colors">طب الأسنان</Link>
              </li>
              <li>
                <Link to="/search?specialty=طب الأطفال" className="text-sm hover:text-blue-400 transition-colors">طب الأطفال</Link>
              </li>
              <li>
                <Link to="/search?specialty=القلب والأوعية الدموية" className="text-sm hover:text-blue-400 transition-colors">القلب والأوعية الدموية</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span>المملكة العربية السعودية، الرياض، طريق الملك فهد</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span dir="ltr">+966 9200 00000</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>support@shefaa.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} منصة شفاء. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">الشروط والأحكام</a>
            <a href="#" className="hover:text-slate-300 transition-colors">سياسة الخصوصية</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
