import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../assets/lib/css/Homepage.css"; // Import custom styles

function HomePage() {
  return (
    <>
      {/* Load Inter font from Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap"
        rel="stylesheet"
      />

      <div className="home-page-wrapper min-vh-100 bg-light">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="container-custom mx-auto py-4 d-flex justify-content-between align-items-center">
            <h1 className="fs-4-custom text-secondary">StockEZZ</h1>
            <a href="/login" className="btn btn-gray-600 px-4 py-2 rounded-pill">
              Log In
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-bg text-white py-5">
          <div className="container-custom mx-auto text-center">
            <h2 className="display-4-custom mb-4">
              Streamline Your Inventory with StockEZZ
            </h2>
            <p className="fs-5-custom mx-auto mb-4" style={{ maxWidth: "48rem" }}>
              A modern, all-in-one inventory management solution designed to simplify stock tracking, billing, and analytics for businesses of all sizes.
            </p>
            <a href="/login" className="btn btn-light text-secondary px-5 py-3 rounded-pill fw-semibold">
              Get Started
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-5 bg-white">
          <div className="container-custom mx-auto">
            <h2 className="fs-4-custom text-dark text-center mb-12-custom">
              Powerful Features to Manage Your Inventory
            </h2>
            <div className="row">
              <div className="col-4 mb-4">
                <div className="p-4 card-custom rounded">
                  <h3 className="fs-5 fw-semibold text-dark mb-2">Stock Management</h3>
                  <p className="text-muted">
                    Add, return, mark as damaged, or clear stock. Generate seller invoices and manage stock details with ease.
                  </p>
                </div>
              </div>
              <div className="col-4 mb-4">
                <div className="p-4 card-custom rounded">
                  <h3 className="fs-5 fw-semibold text-dark mb-2">Billing Area</h3>
                  <p className="text-muted">
                    Manage bills, handle returns, replacements, and recreate bills. Track payments seamlessly.
                  </p>
                </div>
              </div>
              <div className="col-4 mb-4">
                <div className="p-4 card-custom rounded">
                  <h3 className="fs-5 fw-semibold text-dark mb-2">Stock Details</h3>
                  <p className="text-muted">
                    Filter stock by sold, unsold, or damaged items. Set sell prices, GST, and discounts effortlessly.
                  </p>
                </div>
              </div>
              <div className="col-4 mb-4">
                <div className="p-4 card-custom rounded">
                  <h3 className="fs-5 fw-semibold text-dark mb-2">Customizable Forms</h3>
                  <p className="text-muted">
                    Configure stock entry forms to include only the fields you need for efficient data entry.
                  </p>
                </div>
              </div>
              <div className="col-4 mb-4">
                <div className="p-4 card-custom rounded">
                  <h3 className="fs-5 fw-semibold text-dark mb-2">CRUD Operations</h3>
                  <p className="text-muted">
                    Create, read, update, and delete items, sellers, and buyers directly from the stock entry interface.
                  </p>
                </div>
              </div>
              <div className="col-4 mb-4">
                <div className="p-4 card-custom rounded">
                  <h3 className="fs-5 fw-semibold text-dark mb-2">Dashboard Analytics</h3>
                  <p className="text-muted">
                    Visualize total stock value, pending bills, profit, revenue, stock movement, and low stock alerts within a date range.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-5 bg-light">
          <div className="container-custom mx-auto">
            <h2 className="fs-4-custom text-dark text-center mb-12-custom">
              How StockEZZ Works
            </h2>
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-8-custom">
              <div className="text-center" style={{ maxWidth: "16rem" }}>
                <div className="step-circle">1</div>
                <h3 className="fs-5 fw-semibold text-dark mb-2">Admin Setup</h3>
                <p className="text-muted">
                  Admin creates a company ID and password to set up the account.
                </p>
              </div>
              <div className="text-center" style={{ maxWidth: "16rem" }}>
                <div className="step-circle">2</div>
                <h3 className="fs-5 fw-semibold text-dark mb-2">Operator Management</h3>
                <p className="text-muted">
                  Company creates operator IDs and passwords to manage operations.
                </p>
              </div>
              <div className="text-center" style={{ maxWidth: "16rem" }}>
                <div className="step-circle">3</div>
                <h3 className="fs-5 fw-semibold text-dark mb-2">Streamlined Operations</h3>
                <p className="text-muted">
                  Operators manage stock, billing, and analytics through an intuitive interface.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-5 bg-secondary text-white">
          <div className="container-custom mx-auto text-center">
            <h2 className="fs-4-custom mb-4">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="fs-5-custom mx-auto mb-4" style={{ maxWidth: "32rem" }}>
              Join StockEZZ today and take control of your stock, billing, and analytics with ease.
            </p>
            <span className="btn btn-light text-secondary px-5 py-3 rounded-pill fw-semibold btn-custom-gray">
              To connect, drop an email at <a href="mailto:stockezz.rabi@gmail.com">stockezz.rabi@gmail.com</a>
            </span>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark text-white py-3">
          <div className="container-custom mx-auto text-center">
            <span>Designed & Developed by <a href="https://manojkumarrabidas.github.io/portfolio">Manoj Kumar Rabidas</a></span> <br />
            <span>© 2025 StockEZZ. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </>
  );
}

export default HomePage;