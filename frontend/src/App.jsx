import { useState } from 'react';
import './App.css';

function App() {
  const [preview, setPreview] = useState('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('Prediction result will appear here.');
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectionInfo, setDetectionInfo] = useState([]);

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

  if (response.ok) {
    const data = await response.json();
    setOriginalImg(`data:image/jpeg;base64,${data.original}`);
    setEnhancedImg(`data:image/jpeg;base64,${data.enhanced}`);
    setPredictedImg(`data:image/jpeg;base64,${data.predicted}`);
    setDetectionInfo(data.detection_info || []);
    // setResultText('✅ Prediction complete');
    setError(false);
  } else {
    const data = await response.json();
    setResultText(`❌ Error: ${data.error || 'Prediction failed.'}`);
    setError(true);
  }
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay
} catch (err) {
  setResultText('❌ Prediction failed.');
  setError(true);
  console.error(err);
} finally {
  setLoading(false);
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
      <h1>Aplikasi Konstruksi Citra</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" required onChange={handleChange} />
        <br />
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i> Process
        </button>
      </form>

      {loading && (
        <div className="spinner">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Processing...</p>
        </div>
      )}

      {/* Tampilkan tiga gambar hasil jika sudah ada */}
{!loading && originalImg && enhancedImg && predictedImg ? (
  <>
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
  
  {/* Keterangan Deteksi */}
    <div style={{ marginTop: 20 }}>
      <h3>Keterangan Deteksi</h3>
      <p>Jumlah fraktur terdeteksi: <b>{detectionInfo.length}</b></p>
      {detectionInfo.length > 0 && (
        <table border="1" cellPadding="4">
          <thead>
            <tr>
              <th>No</th>
              <th>Confidence</th>
              <th>Koordinat [xmin, ymin, xmax, ymax]</th>
            </tr>
          </thead>
          <tbody>
            {detectionInfo.map((det, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{(det.confidence * 100).toFixed(2)}%</td>
                <td>{det.bbox.map(x => x.toFixed(1)).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </>
  
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