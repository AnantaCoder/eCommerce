import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, addReview, reviewStatus } from "./reviewSlice";
import Loader from "../../components/Loader";

const ReviewSection = ({ itemId, canReview }) => {
  const dispatch = useDispatch();
  const { items: reviews, loading } = useSelector((state) => state.reviews);
  const { reviewed, statusLoading } = useSelector((state) => ({
    reviewed: state.reviews.reviewed,
    statusLoading: state.reviews.statusLoading,
  }));

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  // Load reviews and review status on mount / item change
  useEffect(() => {
    dispatch(fetchReviews(itemId));
    dispatch(reviewStatus(itemId));
  }, [dispatch, itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setError("Please select a rating.");

    try {
      // 1) create the review
      await dispatch(addReview({ item: itemId, rating, comment })).unwrap();

      // 2) mark as reviewed
      dispatch(reviewStatus(itemId));

      // 3) reload reviews list
      dispatch(fetchReviews(itemId));

      // 4) reset form
      setRating(5);
      setComment("");
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  // derived computations
  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const averageRating =
    reviewsArray.length > 0
      ? (
          reviewsArray.reduce((sum, r) => sum + r.rating, 0) /
          reviewsArray.length
        ).toFixed(1)
      : 0;

  // StarRating sub-component
  const StarRating = ({ rating, interactive = false, size = "text-lg" }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${size} ${
            i <= rating ? "text-amber-400" : "text-gray-600"
          } ${
            interactive
              ? "cursor-pointer hover:text-amber-300 transition-colors"
              : ""
          }`}
          onClick={interactive ? () => setRating(i) : undefined}
        >
          ★
        </span>
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 mt-8 shadow-2xl border border-gray-700/50">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Customer Reviews
          </h3>
        </div>

        {reviewsArray.length > 0 && (
          <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3 border border-gray-700/30">
            <StarRating rating={Math.round(averageRating)} />
            <div className="text-right">
              <div className="text-xl font-bold text-amber-400">
                {averageRating}
              </div>
              <div className="text-xs text-gray-400">
                {reviewsArray.length} review{reviewsArray.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List or Loading */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {reviewsArray.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div className="text-lg">No reviews yet</div>
              <div className="text-sm mt-1">
                Be the first to share your experience!
              </div>
            </div>
          )}

          {reviewsArray.map((r) => (
            <div
              key={r.id}
              className="bg-gray-800/40 rounded-xl p-4 sm:p-6 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                    {(r.user_name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {r.user_name || "Anonymous User"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={r.rating} size="text-sm" />
                      <span className="text-xs text-gray-500 ml-1">
                        {new Date(r.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {r.comment && (
                <div className="mt-4 text-gray-200 leading-relaxed pl-0 sm:pl-13">
                  {r.comment}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Review Form / Status */}
      {canReview && (
        <>
          {statusLoading ? (
            <button disabled className="px-4 py-2 bg-gray-600 rounded">
              Checking review status...
            </button>
          ) : reviewed ? (
            <div className="p-4 bg-gray-800/30 rounded-xl text-gray-400">
              You’ve already reviewed this item.
            </div>
          ) : (
            <div className="bg-gray-800/30 rounded-xl p-4 sm:p-6 border border-gray-700/30 backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-400">✍️</span>
                Write a Review
              </h4>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-3 font-medium">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-4">
                    <StarRating
                      rating={rating}
                      interactive={true}
                      size="text-2xl"
                    />
                    <span className="text-amber-400 font-semibold">
                      {rating} Star{rating !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-3 font-medium">
                    Your Review
                  </label>
                  <textarea
                    className="w-full p-4 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Share your experience with this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 px-8 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-amber-500/25"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewSection;
