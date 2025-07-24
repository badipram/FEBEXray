// import { useState } from 'react';
// import './App.css';

// function App() {
//   const [preview, setPreview] = useState('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
//   const [loading, setLoading] = useState(false);
//   const [resultText, setResultText] = useState('Prediction result will appear here.');
//   const [error, setError] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onload = (event) => setPreview(event.target.result);
//       reader.readAsDataURL(file);
//     } else {
//       setPreview('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) return;

//     setLoading(true);
//     setResultText('');
//     setError(false);

//     const formData = new FormData();
//     formData.append('image', selectedFile);

//     try {
//       const response = await fetch('http://127.0.0.1:5050/predict', {
//         method: 'POST',
//         body: formData
//       });

//       setLoading(false);

//       if (response.ok) {
//         const blob = await response.blob();
//         const imgUrl = URL.createObjectURL(blob);
//         setPreview(imgUrl);
//         setResultText('✅ Prediction complete');
//         setError(false);
//       } else {
//         const data = await response.json();
//         setResultText(`❌ Error: ${data.error || 'Prediction failed.'}`);
//         setError(true);
//       }
//     } catch (err) {
//       setLoading(false);
//       setResultText('❌ Prediction failed.');
//       setError(true);
//       console.error(err);
//     }
//   };

//   const handleDownload = () => {
//     const report = `--- Bone Fracture Detection Report ---\nDate: ${new Date().toLocaleString()}\nResult: ${resultText}`;
//     const blob = new Blob([report], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'fracture_report.txt';
//     link.click();
//   };

//   return (
//     <div className="container">
//       <h1><i className="fas fa-x-ray"></i> Aplikasi Konstruksi Citra</h1>
//       <form onSubmit={handleSubmit}>
//         <input type="file" accept="image/*" required onChange={handleChange} />
//         <br />
//         <button type="submit">
//           <i className="fas fa-magnifying-glass-chart"></i> Detect Fracture
//         </button>
//       </form>

//       {loading && (
//         <div className="spinner">
//           <i className="fas fa-spinner fa-spin"></i>
//           <p>Processing...</p>
//         </div>
//       )}

//       <img id="preview" src={preview} alt="Preview" />

//       <div id="result" style={{ color: error ? 'red' : '#28a745' }}>{resultText}</div>

//       {!loading && resultText.startsWith('✅') && (
//         <button id="download-btn" onClick={handleDownload}>
//           <i className="fas fa-download"></i> Download Report
//         </button>
//       )}
//     </div>
//   );
// }

// export default App;

import { useState } from 'react';
import './App.css';

function App() {
  const [preview, setPreview] = useState('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('Prediction result will appear here.');
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Tambahan state untuk tiga gambar hasil
  const [originalImg, setOriginalImg] = useState(null);
  const [enhancedImg, setEnhancedImg] = useState(null);
  const [predictedImg, setPredictedImg] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
    }
    // Reset hasil jika ganti file
    setOriginalImg(null);
    setEnhancedImg(null);
    setPredictedImg(null);
    setResultText('Prediction result will appear here.');
    setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setResultText('');
    setError(false);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5050/predict', {
        method: 'POST',
        body: formData
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        setOriginalImg(`data:image/jpeg;base64,${data.original}`);
        setEnhancedImg(`data:image/jpeg;base64,${data.enhanced}`);
        setPredictedImg(`data:image/jpeg;base64,${data.predicted}`);
        setResultText('✅ Prediction complete');
        setError(false);
      } else {
        const data = await response.json();
        setResultText(`❌ Error: ${data.error || 'Prediction failed.'}`);
        setError(true);
      }
    } catch (err) {
      setLoading(false);
      setResultText('❌ Prediction failed.');
      setError(true);
      console.error(err);
    }
  };

  const handleDownload = () => {
    const report = `--- Bone Fracture Detection Report ---\nDate: ${new Date().toLocaleString()}\nResult: ${resultText}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fracture_report.txt';
    link.click();
  };

  return (
    <div className="container">
      <h1><i className="fas fa-x-ray"></i> Aplikasi Konstruksi Citra</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" required onChange={handleChange} />
        <br />
        <button type="submit">
          <i className="fas fa-magnifying-glass-chart"></i> Detect Fracture
        </button>
      </form>

      {loading && (
        <div className="spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Processing...</p>
        </div>
      )}

      {/* Tampilkan tiga gambar hasil jika sudah ada */}
      {!loading && originalImg && enhancedImg && predictedImg ? (
        <div className="result-images">
          <div>
            <h3>Original</h3>
            <img src={originalImg} alt="Original" style={{ maxWidth: 400 }} />
          </div>
          <div>
            <h3>Enhanced</h3>
            <img src={enhancedImg} alt="Enhanced" style={{ maxWidth: 400 }} />
          </div>
          <div>
            <h3>Bounding Box</h3>
            <img src={predictedImg} alt="Bounding Box" style={{ maxWidth: 400 }} />
          </div>
        </div>
      ) : (
        <img id="preview" src={preview} alt="Preview" />
      )}

      <div id="result" style={{ color: error ? 'red' : '#28a745' }}>{resultText}</div>

      {!loading && resultText.startsWith('✅') && (
        <button id="download-btn" onClick={handleDownload}>
          <i className="fas fa-download"></i> Download Report
        </button>
      )}
    </div>
  );
}

export default App;