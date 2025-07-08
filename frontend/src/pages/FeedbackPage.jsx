import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeedbacks, setCurrentPage, submitFeedback } from '../features/support/feedbackSlice'
  

const FeedbackPage = () => {
  const dispatch = useDispatch()

  const {
    feedbacks,
    loading,
    error,
    currentPage,
    hasNext,
    hasPrevious,
    totalPages,
    totalCount,
    submitting
  } = useSelector(state => state.feedback)

  const [formData, setFormData] = useState({
    name: '',
    message: '',
    rating: 5
  })
  const [showForm, setShowForm] = useState(false)

  // 1️⃣ Load first page on mount
  useEffect(() => {
    dispatch(fetchFeedbacks(1))
  }, [dispatch])

  // 2️⃣ Handle Feedback Submit
  const handleSubmit = async e => {
    e.preventDefault()
    await dispatch(submitFeedback(formData))
    setFormData({ name: '', message: '', rating: 5 })
    setShowForm(false)
    // Refresh the current page
    dispatch(fetchFeedbacks(currentPage))
  }

  // 3️⃣ Pagination handler
  const handlePageChange = page => {
    dispatch(setCurrentPage(page))
    dispatch(fetchFeedbacks(page))
  }

  // 4️⃣ Animated background bits (unchanged)
  const floatingElements = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30"
      animate={{
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        scale: [1, 1.5, 1],
        opacity: [0.3, 0.8, 0.3]
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    />
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="inline-block mr-3 text-yellow-400" size={48} />
            Feedback Galaxy
            <Heart className="inline-block ml-3 text-red-400" size={48} />
          </motion.h1>
          <p className="text-xl text-gray-300 mb-8">Share your thoughts and see what others are saying!</p>

          <motion.button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="inline-block mr-2" size={20} />
            Share Your Feedback
          </motion.button>
        </motion.div>

        {/* Feedback Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Share Your Experience</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Your Message</label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Share your thoughts..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                    <select
                      value={formData.rating}
                      onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>
                          {r} Star{r > 1 && 's'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting…' : 'Submit'}
                  </button>
                </form>
                {error && (
                  <p className="text-red-500 text-sm mt-4">{error}</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Cards */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-gray-700 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {feedbacks.map((fb, idx) => (
                  <motion.div
                    key={fb.id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{
                      delay: idx * 0.1,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20
                    }}
                    className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/80 transition-all duration-300 border border-gray-700 hover:border-purple-500 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{fb.name}</h3>
                      <div className="flex space-x-1">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} fill="currentColor" className="text-yellow-400" size={16} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4 leading-relaxed">{fb.message}</p>
                    <div className="text-sm text-gray-500">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center mt-12 space-x-4"
          >
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevious}
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} className="mr-1" />
              Previous
            </motion.button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <motion.button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-semibold ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
              <ChevronRight size={20} className="ml-1" />
            </motion.button>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-8">
          <p className="text-gray-400">
            Showing {feedbacks.length} of {totalCount} feedbacks
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default FeedbackPage
