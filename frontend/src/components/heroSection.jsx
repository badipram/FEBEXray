const HeroSection = () => {
    return (
        <section id="home" className="hero-section">
            <div className="hero-text">
                <h1>Rekonstruksi dan Deteksi Citra <span className="blue">X-ray </span> Berbasis <span className="red">AI</span></h1>
                <h3>Sistem cerdas berbasis Computer Vision untuk membantu identifikasi dan analisis citra X-ray secara akurat dan efisien. Mendukung diagnosa medis dengan visualisasi yang lebih jelas dan tersrtuktur</h3>
                <a href="#learn-more" className="btn">Unggah Citra Xray</a>
            </div>
            <div className="hero-image">
                <img src="../public/CT scan-pana.png" alt="ilustration" />
            </div>
        </section>
    )
}

export default HeroSection;