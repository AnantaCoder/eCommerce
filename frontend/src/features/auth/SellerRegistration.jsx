import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sellerRegistration } from './authSlice';

export default function SellerRegistrationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    password: '',
    shop_name: '',
    gst_number: '',
    address: ''
  });

  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field-specific errors
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const { isAuthenticated, user, loading } = useSelector(state => state.auth);

  const getDisplayEmail = () => {
    if (!user) return 'No user logged in';
    return user.email || user.name || 'User';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    
    dispatch(
      sellerRegistration({
        password: formData.password,
        gst_number: formData.gst_number,
        shop_name: formData.shop_name,
        address: formData.address,
      })
    )
    .unwrap()
    .then(() => {
      alert("Creation of seller account is Successful. login again!")
      navigate("/login");
    })
    .catch((err) => {
      setErrors({ form: err.detail || "Failed to register as a Seller! Please try again." });
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Authentication Required
            </h2>
            <p className="text-slate-300 mb-6">You need to be logged in to register as a seller.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Form container */}
      <div className="relative w-full max-w-md">
        {/* Glowing border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Seller Registration
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          {/* Display current user email */}
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <p className="text-sm text-slate-400 mb-1">Registering as seller for:</p>
            <p className="text-purple-400 font-medium">{getDisplayEmail()}</p>
          </div>

          {/* Error display */}
          {errors.form && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{errors.form}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Password Field */}
            <div className="relative group">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-purple-500 transition-all duration-300 peer"
                placeholder="Password"
              />
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                focusedField === 'password' || formData.password 
                  ? '-top-2 text-xs bg-slate-900 px-2 text-purple-400' 
                  : 'top-3 text-slate-400'
              }`}>
                Password
              </label>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>

            {/* Shop Name Field */}
            <div className="relative group">
              <input
                type="text"
                name="shop_name"
                required
                value={formData.shop_name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('shop_name')}
                onBlur={() => setFocusedField('')}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-purple-500 transition-all duration-300 peer"
                placeholder="Shop Name"
              />
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                focusedField === 'shop_name' || formData.shop_name 
                  ? '-top-2 text-xs bg-slate-900 px-2 text-purple-400' 
                  : 'top-3 text-slate-400'
              }`}>
                Shop Name
              </label>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>

            {/* GST Number Field */}
            <div className="relative group">
              <input
                type="text"
                name="gst_number"
                required
                value={formData.gst_number}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('gst_number')}
                onBlur={() => setFocusedField('')}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-purple-500 transition-all duration-300 peer"
                placeholder="GST Number"
              />
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                focusedField === 'gst_number' || formData.gst_number 
                  ? '-top-2 text-xs bg-slate-900 px-2 text-purple-400' 
                  : 'top-3 text-slate-400'
              }`}>
                GST Number
              </label>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>

            {/* Address Field */}
            <div className="relative group">
              <textarea
                name="address"
                required
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField('')}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-purple-500 transition-all duration-300 peer resize-none"
                placeholder="Address"
              />
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                focusedField === 'address' || formData.address 
                  ? '-top-2 text-xs bg-slate-900 px-2 text-purple-400' 
                  : 'top-3 text-slate-400'
              }`}>
                Address
              </label>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="cursor-pointer relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    Register & Continue
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center ">
            <p className="text-slate-400 text-sm">
              Need to switch accounts?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors duration-300 font-medium"
              >
                Login here
              </button>
            </p>
            <p className="text-slate-400 text-sm">
              Go back?{' '}
              <button 
                onClick={() => navigate('/home')}
                className="text-amber-400 hover:text-green-300 cursor-pointer transition-colors duration-300 font-medium"
              >
                Home
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}