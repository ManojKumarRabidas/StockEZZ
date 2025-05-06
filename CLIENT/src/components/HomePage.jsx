import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import '../assets/lib/js/react.production.min.js';
import '../assets/lib/js/react-dom.production.min.js';
// import '../assets/lib/css/tailwind.min.css';

function HomePage() {
    // useEffect(() => {
    //     const link = document.createElement("link");
    //     link.rel = "stylesheet";
    //     link.href = "../assets/lib/css/tailwind.min.css"; // adjust path if needed
    //     document.head.appendChild(link);
    
    //     return () => {
    //       document.head.removeChild(link); // cleanup on unmount
    //     };
    //   }, []);
  return (
    <>
    {/* <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script> */}
    {/* <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script> */}
    {/* <script src="https://cdn.jsdelivr.net/npm/babel-standalone@7.22.10/babel.min.js"></script> */}
    <link href="./src/assets/lib/css/tailwind.min.css" rel="stylesheet"></link>
    {/* <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      ></link> */}
    <style>{`
        a{
            text-decoration: underline !important;
            cursor: pointer;
        }
        body {
            font-family: 'Inter', sans-serif;
        }
        .hero-bg {
            background: linear-gradient(135deg,rgba(75, 85, 99, 0.52) 0%, #4b5563 100%);
        }
      `}</style>
    
    <div className="min-h-screen bg-gray-100">
          {/* Header */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-600">StockEZZ</h1>
              <a
                href="/login"
                className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition duration-300"
              >
                Log In
              </a>
            </div>
          </header>

          {/* Hero Section */}
          <section className="hero-bg text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Streamline Your Inventory with StockEZZ
              </h2>
              <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
                A modern, all-in-one inventory management solution designed to simplify stock tracking, billing, and analytics for businesses of all sizes.
              </p>
              <a
                href="/login"
                className="bg-white text-gray-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
              >
                Get Started
              </a>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Powerful Features to Manage Your Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Stock Management</h3>
                  <p className="text-gray-600">
                    Add, return, mark as damaged, or clear stock. Generate seller invoices and manage stock details with ease.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Billing Area</h3>
                  <p className="text-gray-600">
                    Manage bills, handle returns, replacements, and recreate bills. Track payments seamlessly.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Stock Details</h3>
                  <p className="text-gray-600">
                    Filter stock by sold, unsold, or damaged items. Set sell prices, GST, and discounts effortlessly.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Customizable Forms</h3>
                  <p className="text-gray-600">
                    Configure stock entry forms to include only the fields you need for efficient data entry.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">CRUD Operations</h3>
                  <p className="text-gray-600">
                    Create, read, update, and delete items, sellers, and buyers directly from the stock entry interface.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Analytics</h3>
                  <p className="text-gray-600">
                    Visualize total stock value, pending bills, profit, revenue, stock movement, and low stock alerts within a date range.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Workflow Section */}
          <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                How StockEZZ Works
              </h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="text-center">
                  <div className="bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">1</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Setup</h3>
                  <p className="text-gray-600 max-w-xs">
                    Admin creates a company ID and password to set up the account.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">2</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Operator Management</h3>
                  <p className="text-gray-600 max-w-xs">
                    Company creates operator IDs and passwords to manage operations.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">3</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Streamlined Operations</h3>
                  <p className="text-gray-600 max-w-xs">
                    Operators manage stock, billing, and analytics through an intuitive interface.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 bg-gray-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Inventory Management?
              </h2>
              <p className="text-lg max-w-2xl mx-auto mb-8">
                Join StockEZZ today and take control of your stock, billing, and analytics with ease.
              </p>
              {/* <a href="/login" className="mx-2 bg-white text-gray-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"> Start Now
              </a> */}
              <span className="mx-2 bg-white text-gray-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
                To connect, drop a email at <a href="mailto:stockezz.rabi@gmail.com">stockezz.rabi@gmail.com</a>
              </span>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p>© 2025 StockEZZ. All rights reserved.</p>
            </div>
          </footer>
        </div>
    </>
  );
}
export default HomePage;