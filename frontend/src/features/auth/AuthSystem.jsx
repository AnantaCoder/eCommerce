import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./authSlice";

const AuthSystem = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     if (isLogin) {
  //       dispatch(loginUser({
  //         email:formData.email,
  //         password:formData.password
  //       }))
  //       .unwrap()
  //       .then(()=>{
  //         navigate('/home')
  //       })
  //       .catch(err=>{
  //         setErrors(err)
  //       })

  //     }
  //   }else{
  //     dispatch(registerUser({
  //        email: formData.email,
  //        password: formData.password,
  //        first_name: formData.fullName.split(' ')[0],
  //        last_name: formData.fullName.split(' ').slice(1).join(' ')
  //      }))
  //      .unwrap()
  //      .then(()=>{
  //       navigate('/login')
  //      })
  //      .catch(err=>{
  //       setErrors(err)
  //      })
  //   }
  // };
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    if (isLogin) {
      dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      )
        .unwrap()
        .then(() => navigate("/home"))
        .catch((err) =>
          console.log(err)
        );
    } else {
      dispatch(
        registerUser({
          email: formData.email,
          password: formData.password,
          first_name: formData.fullName.split(" ")[0],
          last_name: formData.fullName.split(" ").slice(1).join(" "),
        })
      )
        .unwrap()
        .then(() => navigate("/login"))
        .catch((err) =>
          console.log(err)
        );
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {errors.form && (
          <div className="text-red-500 text-center mb-4">{errors.form}</div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-slate-400">
            {isLogin
              ? "Sign in to continue shopping"
              : "Join us and start your shopping journey"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-6">
            {/* Full Name Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-white font-medium text-sm">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.fullName ? "border-red-500" : "border-slate-600"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-400 text-sm">{errors.fullName}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-white font-medium text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    errors.email ? "border-red-500" : "border-slate-600"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-white font-medium text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    errors.password ? "border-red-500" : "border-slate-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-white font-medium text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-slate-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Terms and Conditions (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-purple-600 bg-slate-800/50 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-300">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <a
                  href="#"
                  className="text-purple-400 hover:text-purple-300 text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
            )}
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleAuthMode}
                className="ml-2 text-purple-400 hover:text-purple-300 font-medium underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/10 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-3 border border-slate-600 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-white transition-colors">
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-slate-600 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-white transition-colors">
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





const SellerRegistration= ()=>{
  
}
export default AuthSystem;
