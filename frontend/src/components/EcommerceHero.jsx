import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  TrendingUp,
  Zap,
  Star,
  ArrowRight,
  ChevronDown,
  Gift,
  Truck,
  Shield,
  Users,
} from "lucide-react";

const EcommerceHero = () => {
  const [currentOffer, setCurrentOffer] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56,
  });
  const videoRef = useRef(null);

  const offers = [
    {
      text: "🔥 MEGA SALE: Up to 70% OFF on Electronics!",
      color: "from-red-500 to-orange-500",
    },
    {
      text: "⚡ Flash Deal: Free Shipping on Orders $899+!",
      color: "from-blue-500 to-purple-500",
    },
    {
      text: "🎁 New Customer: Extra 20% OFF your first order!",
      color: "from-green-500 to-teal-500",
    },
  ]


  // Rotate offers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShopNow = () => console.log("Shop Now clicked");
  const handleExploreDeals = () => console.log("Explore Deals clicked");
  const scrollToProducts = () => console.log("Scroll to products");

  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1591035897819-f4bdf739f446?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      >
        {/* absolute path */}
        <source src="/herovideo.mp4" type="video/mp4" /> 
      </video>
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Offers Banner */}
      <div className="relative z-10">
        <div
          className={`bg-gradient-to-r ${offers[currentOffer].color} text-white py-2 px-4 text-center font-semibold text-sm sm:text-base`}
        >
          {offers[currentOffer].text}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-16 max-w-5xl mx-auto">
        {/* Headline */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-md rounded-full px-4 py-1 border border-yellow-400/30">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm sm:text-base font-medium">
              Trending Now
            </span>
          </div>

          <h1 className="font-bold text-5xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-8xl leading-snug text-white">
            <span className="bg-gradient-to-r from-orange-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Shop
            </span>{" "}
            <span className="text-white">the</span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              Future
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
            Discover premium products with cutting-edge technology.{" "}
            <span className="text-blue-400 font-semibold">Free shipping</span>{" "}
            on orders over ₹999 !
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-8">
          {[
            {
              value: "50K+",
              label: "Happy Customers",
              color: "text-white",
            },
            {
              value: "10K+",
              label: "Products",
              color: "text-blue-400",
            },
            {
              value: "4.9★",
              label: "Rating",
              color: "text-green-400",
            },
            {
              value: "24/7",
              label: "Support",
              color: "text-purple-400",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
            >
              <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-300 text-xs sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
                                                                                                                                          
        {/* Flash Sale */}
        <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-6 border border-red-500/30 w-full sm:w-3/4 lg:w-1/2 mt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Flash Sale Ends In
            </h3>
          </div>
          <div className="flex justify-center gap-2 sm:gap-4">
            {["hours", "minutes", "seconds"].map((unit, i) => (
              <div
                key={i}
                className="bg-black/40 rounded-xl p-2 sm:p-4 min-w-[60px]"
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {String(timeLeft[unit]).padStart(2, "0")}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm capitalize">
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-8">
          <button
            onClick={handleShopNow}
            className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm sm:text-base">Shop Now</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleExploreDeals}
            className="group bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-2xl flex items-center gap-2 border border-white/30 hover:border-white/50 transition-all"
          >
            <Gift className="w-5 h-5" />
            <span className="text-sm sm:text-base">Explore Deals</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
          {[
            {
              icon: Truck,
              label: "Free Shipping",
              color: "text-green-400",
            },
            {
              icon: Shield,
              label: "Secure Payment",
              color: "text-blue-400",
            },
            {
              icon: Star,
              label: "Premium Quality",
              color: "text-yellow-400",
            },
            {
              icon: Users,
              label: "24/7 Support",
              color: "text-purple-400",
            },
          ].map((trust, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 sm:gap-2 text-gray-300 text-sm"
            >
              <trust.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${trust.color}`} />
              <span>{trust.label}</span>
            </div>
          ))}
        </div>


      </div>
      {/* Scroll Down */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={scrollToProducts}
          className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors"
        >
          <span className="text-xs sm:text-sm">Explore Products</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default EcommerceHero;
