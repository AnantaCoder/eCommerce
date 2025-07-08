import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { resetPassword, sendOtp } from "./authSlice"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function ResetPassword() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
    confirm_password: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    await dispatch(sendOtp(formData.email))
    setStep(2)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (formData.new_password !== formData.confirm_password) {
      return
    }
    const result = await dispatch(resetPassword(formData))
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  }

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-amber-800 to-purple-800 flex justify-center items-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="w-full p-6 rounded-2xl shadow-lg border-2 border-purple-400 bg-white/90">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
              🔐 Reset Password
            </h2>

            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 1
                      ? "bg-purple-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                  animate={{ scale: step === 1 ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  1
                </motion.div>
                <motion.div
                  className="w-16 h-1 bg-gray-300 rounded-full mt-3.5"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: step >= 2 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 2
                      ? "bg-purple-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                  animate={{ scale: step === 2 ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  2
                </motion.div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSendOtp}
                className="space-y-4"
              >
                <motion.div
                  variants={inputVariants}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                >
                  <input
                    name="email"
                    type="email"
                    placeholder="📧 Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  custom={1}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    {/* Send OTP button */}
                    <motion.button
                      type="submit"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 rounded-lg hover:opacity-90"
                      disabled={loading || !formData.email}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin mx-auto" />
                      ) : (
                        "📩 Send OTP"
                      )}
                    </motion.button>

                    {/* Login button */}
                    <motion.button
                      type="button"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => navigate("/login")}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 rounded-lg hover:opacity-90"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin mx-auto" />
                      ) : (
                        "🤏🏻 Login"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <motion.div
                  variants={inputVariants}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                >
                  {/* OTP input field */}
                  <input
                    name="otp"
                    placeholder="🔢 Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  custom={1}
                  initial="hidden"
                  animate="visible"
                >
                  <input
                    type="password"
                    name="new_password"
                    placeholder="🔐 New password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  custom={2}
                  initial="hidden"
                  animate="visible"
                >
                  <input
                    type="password"
                    name="confirm_password"
                    placeholder="✅ Confirm password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  className="flex space-x-2"
                >
                  <motion.button
                    type="button"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-500 text-white font-bold py-2 rounded-lg hover:opacity-90"
                    disabled={loading}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 rounded-lg hover:opacity-90"
                    disabled={
                      loading ||
                      formData.new_password !== formData.confirm_password
                    }
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      "Reset Password"
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}