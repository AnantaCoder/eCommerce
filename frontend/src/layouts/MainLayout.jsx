import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import AlertCard from "../components/AlertCard";

function MainLayout() {
  const {  isAuthenticated } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen  bg-gray-800">
      {!isAuthenticated &&(
        <AlertCard/>
      )}

      <Navbar />
      <main >
        <Outlet />
      </main>  
      <Footer />
    </div>
  );
}

export default MainLayout;
