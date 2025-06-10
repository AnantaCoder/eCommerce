// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import React from 'react';
import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import CategoryPage from "./pages/CategoryPage";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import AccountsComponent from "./components/AccountsPage";
import PaymentsPage from "./components/PaymentsPage";


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


        </Route>
        


        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;