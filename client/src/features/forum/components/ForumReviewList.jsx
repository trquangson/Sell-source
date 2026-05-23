import React, { useState, useEffect } from 'react';
import { Star, Loader2, Send } from 'lucide-react';
import { forumApi } from '../api/forumApi';
import Pagination from '@/shared/components/Pagination';
import { useTranslation } from 'react-i18next';

const ForumReviewList = ({ postId, user, alreadyPurchased }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await forumApi.getPostReviews(postId, page);
      setReviews(res.data.reviews);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [postId, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError(t('forum.login_to_review', 'Vui lòng đăng nhập để đánh giá'));
      return;
    }
    if (!comment.trim()) {
      setError(t('forum.empty_review', 'Vui lòng nhập nội dung đánh giá'));
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await forumApi.addPostReview(postId, { rating, comment });
      setSuccess(t('forum.review_success', 'Thêm đánh giá thành công'));
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || t('forum.review_error', 'Có lỗi xảy ra'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form add review */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{t('forum.write_review')}</h3>
        
        {!alreadyPurchased ? (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium text-center">
            {t('forum.need_purchase_to_review')}
          </div>
        ) : (
          <>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('forum.star_rating')}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`transition-colors ${star <= rating ? 'text-yellow-400' : 'text-slate-300'}`}
                    >
                      <Star className={star <= rating ? 'fill-yellow-400' : ''} size={28} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('forum.review_content')}</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('forum.review_placeholder', 'Chia sẻ trải nghiệm của bạn về mã nguồn này...')}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none min-h-[100px]"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {t('forum.submit_review')}
              </button>
            </form>
          </>
        )}
      </div>

      {/* List reviews */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">{t('forum.reviews_from_users')} ({reviews.length})</h3>
        
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-slate-100 pb-6 last:border-0">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                    {review.userId?.avatar ? (
                      <img src={review.userId.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center font-bold text-slate-500">{review.userId?.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{review.userId?.fullName || review.userId?.username}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400' : 'text-slate-200'} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
              </div>
            ))}
            
            {totalPages > 1 && (
              <div className="pt-4 flex justify-center">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-slate-100">{t('forum.no_reviews')}</p>
        )}
      </div>
    </div>
  );
};

export default ForumReviewList;
