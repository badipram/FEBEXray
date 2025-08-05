import { useState } from 'react';
import './App.css';
import FormUpload from './components/FormUpload';
import ImagePreview from './components/ImagePreview';
import ResultImages from './components/ResultImages';
import DetectionInfo from './components/DetectionInfo';
import Navbar from './components/navbar';

function App() {
  const [preview, setPreview] = useState('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
  const [resultText, setResultText] = useState('');
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectionInfo, setDetectionInfo] = useState([]);
  const [loading, setLoading] = useState(false);

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

    setOriginalImg(null);
    setEnhancedImg(null);
    setPredictedImg(null);
    setResultText('');
    setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setResultText('');
    setError(false);
    setLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5050/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setOriginalImg(`data:image/jpeg;base64,${data.original}`);
        setEnhancedImg(`data:image/jpeg;base64,${data.enhanced}`);
        setPredictedImg(`data:image/jpeg;base64,${data.predicted}`);
        setDetectionInfo(data.detection_info || []);
        setError(false);
      } else {
        const data = await response.json();
        setResultText(`❌ Error: ${data.error || 'Prediction failed.'}`);
        setError(true);
      }
    } catch (err) {
      setResultText('❌ Prediction failed.');
      setError(true);
      console.error(err);
    } finally {
      // await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    }
  };

  return (
    <>
    <div className="main-content">
    <Navbar />

      <div className="container">
        <h1>Kontruksi Citra X-ray</h1>
        <h3>Masukan gambar untuk mendapatkan hasil prediksi</h3>
        <FormUpload onSubmit={handleSubmit} onFileChange={handleChange} loading={loading} />

        {originalImg && enhancedImg && predictedImg ? (
          <>
            <ResultImages
              originalImg={originalImg}
              enhancedImg={enhancedImg}
              predictedImg={predictedImg}
            />
            <DetectionInfo detectionInfo={detectionInfo} />
          </>
        ) : (
          <ImagePreview selectedFile={selectedFile} preview={preview} />
        )}

        <div id="result" style={{ color: error ? 'red' : '#28a745' }}>{resultText}</div>
      </div>
    </div>
    </>
    
  );
}

export default App;