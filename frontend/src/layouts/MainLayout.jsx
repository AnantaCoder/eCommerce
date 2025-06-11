// layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MainLayout() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="container mx-auto px-0 py-4">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

export default MainLayout;