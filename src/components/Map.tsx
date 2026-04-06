import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

// Fix for default marker icons in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface DoctorMarker {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  coordinates: [number, number];
  image: string;
  price: number;
}

interface MapProps {
  doctors: DoctorMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

// Component to automatically adjust map bounds to fit all markers
function MapBounds({ doctors }: { doctors: DoctorMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (doctors.length > 0) {
      const bounds = L.latLngBounds(doctors.map(d => d.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [doctors, map]);

  return null;
}

export default function Map({ doctors, center = [24.7136, 46.6753], zoom = 5, className = "h-full w-full" }: MapProps) {
  return (
    <div className={className}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {doctors.map((doctor) => (
          <Marker key={doctor.id} position={doctor.coordinates}>
            <Popup className="doctor-popup">
              <div className="flex flex-col gap-3 min-w-[200px]" dir="rtl">
                <div className="flex items-center gap-3">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{doctor.name}</h3>
                    <p className="text-xs text-blue-600 font-medium">{doctor.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-slate-900">{doctor.rating}</span>
                  <span>({doctor.reviews} تقييم)</span>
                </div>
                
                <div className="flex items-start gap-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                  <span className="line-clamp-1">{doctor.location}</span>
                </div>
                
                <div className="pt-2 mt-1 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900">{doctor.price} ر.س</span>
                  <Link 
                    to={`/doctor/${doctor.id}`}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    عرض الملف
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {doctors.length > 1 && <MapBounds doctors={doctors} />}
      </MapContainer>
    </div>
  );
}
