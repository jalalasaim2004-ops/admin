import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockReviews } from "@/data/mockData";

interface Review {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  rating: number;
  comment: string;
  status: string;
}

export default function DoctorReviews({ doctorId }: { doctorId: string }) {
  const [reviews, setReviews] = useState<Review[]>(
    mockReviews.filter((r) => r.doctorId === doctorId && r.status === "approved")
  );
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: `r${Date.now()}`,
        doctorId,
        patientName: "مريض موثق", // In a real app, this would be the logged-in user
        date: new Date().toISOString().split('T')[0],
        rating,
        comment,
        status: "pending" // Needs moderation
      };
      
      // We can add it to the list to show it immediately with a "pending" badge, 
      // or just show a success message. Let's show it with a pending badge.
      setReviews([newReview, ...reviews]);
      
      setIsSubmitting(false);
      setSubmitted(true);
      setRating(0);
      setComment("");
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6">تقييمات المرضى</h3>
      
      {/* Add Review Form */}
      <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <h4 className="font-bold text-slate-900 mb-4">أضف تقييمك</h4>
        
        {submitted ? (
          <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
            <p className="font-medium">شكراً لك! تم إرسال تقييمك بنجاح وهو قيد المراجعة.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">التقييم</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={cn(
                        "w-8 h-8 transition-colors",
                        (hoverRating || rating) >= star 
                          ? "text-amber-400 fill-amber-400" 
                          : "text-slate-300"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-2">
                تعليقك (اختياري)
              </label>
              <textarea
                id="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                placeholder="شاركنا تجربتك مع الطبيب..."
              />
            </div>
            
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className={cn(
                "px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
                rating === 0 
                  ? "bg-slate-300 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "إرسال التقييم"
              )}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {review.patientName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{review.patientName}</p>
                      {review.status === "pending" && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          قيد المراجعة
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex">
                  {Array.from({length: 5}).map((_, j) => (
                    <Star 
                      key={j} 
                      className={cn(
                        "w-4 h-4",
                        j < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                      )} 
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-slate-600 text-sm leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 py-4">لا توجد تقييمات حتى الآن.</p>
        )}
      </div>
    </div>
  );
}
