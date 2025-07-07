import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Info, X, AlertCircle } from 'lucide-react'
import { fetchItemFeedback } from './analyzeSlice'

export default function AnalyzeComponent({ itemId, onClose }) {
  const dispatch = useDispatch()
  const { feedback, loading, error } = useSelector(state => state.analyze)

  useEffect(() => {
    if (itemId) {
      console.log("analyzer dispatched ",itemId)
      dispatch(fetchItemFeedback(itemId))
    }
  }, [dispatch, itemId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Info className="w-6 h-6 mr-2 text-purple-400" />
              Item Analysis
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Analysis content */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Analyzing item...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-400">{error}</p>
              </div>
            ) : feedback ? (
              <div className="space-y-4">
                {/* Final recommendation */}
                {feedback.final_recommendation && (
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">
                      Final Recommendation
                    </h4>
                    <p className="text-gray-300">{feedback.final_recommendation}</p>
                  </div>
                )}

                {/* Summary */}
                {feedback.summary && (
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Summary</h4>
                    <p className="text-gray-300">{feedback.summary}</p>
                  </div>
                )}

                {/* Details */}
                {feedback.details.length > 0 && (
                  <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-green-300 mb-3">Details</h4>
                    <div className="space-y-2">
                      {feedback.details.map((d, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <div className="text-gray-300 text-sm">
                            <p>
                              <span className="font-semibold">Review:</span> {d.reviews}
                            </p>
                            <p>
                              <span className="font-semibold">Label:</span> {d.label}
                            </p>
                            <p>
                              <span className="font-semibold">Confidence:</span> {d.confidence}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No analysis data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
