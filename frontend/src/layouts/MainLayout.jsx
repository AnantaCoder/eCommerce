import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-800">
      <LoginModal />
      <Navbar />
      <main>
        <Outlet />
      </main>  
      <Footer />
    </div>
  );
}

export default MainLayout;
