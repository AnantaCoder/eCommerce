import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { fetchPendingReviews, fetchUserReviews } from '../features/product/reviewSlice';

const UserReviewsPage = () => {
  const dispatch = useDispatch();

  const {
    userReviews = [],
    userReviewsLoading = false,
    userReviewsError = null,
    pendingReviews = [],
  pendingReviewsLoading = false,

    nextPage
  } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchUserReviews(1))
    dispatch(fetchPendingReviews())
  }, [dispatch]);

  const handleNextPage = () => {
    if (nextPage) dispatch(fetchUserReviews(nextPage));
  };

  if (userReviewsLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-amber-400">My Reviews</h2>

        {pendingReviewsLoading ? (
  <Loader />
) : pendingReviews.length > 0 && (
  <div className="mb-10">
    <h3 className="text-xl text-center font-semibold text-green-400 mb-2">
      You have {pendingReviews.length} product{pendingReviews.length !== 1 && 's'} left to review
    </h3>
    <div className="space-y-2">
      {pendingReviews.map(({ id, item_name }) => (
        <div
          key={id}
          className="flex justify-between items-center bg-gray-800 p-4 rounded-md shadow"
        >
          <span className="text-gray-200">{item_name}</span>
          {/* <a
            href={`/product/${id}`}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Write Review
          </a> */}
        </div>
      ))}
    </div>
  </div>
)}

        {userReviewsError && (
          <div className="p-4 mb-6 bg-red-800 text-red-200 rounded">
            {userReviewsError}
          </div>
        )}

        {userReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-xl">No reviews written yet</p>
            <p className="text-sm mt-1">Share your experience with products you purchased!</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {userReviews.map(({ id, item, item_name, rating, comment, created_at }) => (
                <div
                  key={id}
                  className="bg-gray-800 shadow-lg rounded-lg p-6 transition-transform transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-300">
                        {item_name || `Item #${item}`}
                      </h3>
                      <span className="text-sm text-gray-400">
                        Reviewed on {new Date(created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-1">{'★'.repeat(rating)}</span>
                      <span className="text-gray-700">{'★'.repeat(5 - rating)}</span>
                    </div>
                  </div>

                  {comment && (
                    <p className="text-gray-200 leading-relaxed">{comment}</p>
                  )}
                </div>
              ))}
            </div>




            {nextPage && (
              <div className="text-center mt-8">
                <button
                  onClick={handleNextPage}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserReviewsPage;
