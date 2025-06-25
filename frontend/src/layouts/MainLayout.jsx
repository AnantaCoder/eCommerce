import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

function MainLayout() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="container mx-auto px-0 ">
        <Outlet />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        }}
      />
      <Footer />
    </div>
  );
}

export default MainLayout;
