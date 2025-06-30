// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import CategoryPage from "./pages/CategoryPage";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import AccountsComponent from "./components/ProfileCard";
import PaymentsPage from "./components/PaymentsPage";
import SellerRegistrationPage from "./pages/SellerRegistrationPage";
import AddItems from "./features/store/AddItems";
import ProductDetail from "./features/product/ProductDetail";
import AuthCallback from "./features/auth/AuthCallBack";
import ManageItems from "./features/store/ManageItems";
import OrderPage from "./pages/OrderPage";
import CheckoutPage from "./pages/CheckoutPage";


// GUNJAN LAUDI 🦥
// add a layer if is authenticated only then most pages accessible , inside a private route element
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} /> 
          <Route path="/home" element={<HomePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/wishlist" element={<WishlistPage/>}/>
          <Route path="/account" element={<AccountsComponent/>}/>
          <Route path="/payment" element={<PaymentsPage/>}/>
          <Route path="/add-item" element={<AddItems/>}/>
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/manage-items" element={<ManageItems />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<OrderPage />} />


        </Route>
        


        <Route path="/seller-registration" element={<SellerRegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;