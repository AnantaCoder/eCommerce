import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const AlertCard = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);



  useEffect(()=>{
    const handleKey = (e)=>{
      if (e.key==="Escape") {
        setVisible(false)
      }
    }
    window.addEventListener("keydown", handleKey)
    return ()=> window.removeEventListener("keydown",handleKey)
  },[])
  if (!visible) return null;

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Card Shadow */}
      <div className="absolute h-64 w-72 rotate-6 rounded-2xl bg-white"></div>

      {/* Foreground Alert Card */}
      <div className="relative h-64 w-72 rotate-6 space-y-4 rounded-2xl bg-red-100 p-6 transition duration-300 hover:rotate-0 shadow-2xl">
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-3 text-red-600 hover:text-red-800"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Alert Icon */}
        <div className="flex justify-center text-red-600">
          <i className="fas fa-exclamation-triangle text-4xl"></i>
        </div>

        {/* Alert Title */}
        <header className="text-center text-2xl font-extrabold text-red-700">
          Alert
        </header>

        {/* Alert Message */}
        <div>
          <p className="text-center text-lg font-medium text-red-800">
            You need to be <span className="font-bold">logged in</span> to
            perform different store actions.
          </p>
        </div>

        {/* Action Button */}
        <footer className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-lg font-semibold text-white hover:bg-red-700"
          >
            <i className="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </button>
        </footer>
      </div>
    </main>
  );
};

export default AlertCard;
