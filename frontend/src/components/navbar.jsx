import React from "react";
import "./App.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-title">
        {/* <i className="fa-solid fa-x-ray" style={{ marginRight: 8 }}></i> */}
        Aplikasi Konstruksi Citra
      </div>
      <div className="navbar-links">
        <a href="#" className="navbar-link">Home</a>
        <a href="#history" className="navbar-link">Riwayat</a>
        {/* Tambah link lain jika perlu */}
      </div>
    </nav>
  );
}

export default Navbar;