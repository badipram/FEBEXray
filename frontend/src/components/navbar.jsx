import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="/logo.png" alt="Logo" className="logo" />
          <h1 className="logo-name">RekoMed</h1>
        </div>
        <button
          className="hamburger"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <ul className={`navbar-links${open ? " open" : ""}`}>
          <li><a href="#home">Beranda</a></li>
          <li><a href="#about">Tentang</a></li>
          <li><a href="#technology">Teknologi</a></li>
          <li><a href="#rekonstruksi">Rekonstruksi</a></li>
        </ul>
      </nav>
    </>
  );
};


export default Navbar;