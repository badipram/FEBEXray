const Navbar = () => {
  return (
    <>
    <nav className="navbar">
        <div className="navbar-brand">
          <img src="../public/logo.png" alt="Logo" className="logo" />
          <h1 className="logo-name">RekoMed</h1>
        </div>
        <ul className="navbar-links">
          <li><a href="#beranda">Beranda</a></li>
          <li><a href="#tentang">Tentang</a></li>
          <li><a href="#teknologi">Teknologi</a></li>
          <li><a href="#rekonstruksi">Rekonstruksi</a></li>
        </ul>
    </nav>
    
    </>
  )
}

export default Navbar;