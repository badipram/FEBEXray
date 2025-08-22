import './App.css';
import { useState, useEffect } from 'react';
import { predictImage } from './services/api';
import { generatePDF } from './utils/pdfUtils';
import { getFilePreview, resetPredictionState } from './utils/fileUtils';
import FormUpload from './components/FormUpload';
import ImagePreview from './components/ImagePreview';
import ResultImages from './components/ResultImages';
import DetectionInfo from './components/DetectionInfo';
import Navbar from './components/navbar';
import HeroSection from './components/heroSection';
import About from './components/about';
import Technology from './components/technology';

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

  useEffect(() => {
    const fetchLastPrediction = async () => {
      try {
        const rest = await fetch('http://127.0.0.1:5050/last-prediction');
        const data = await rest.json();
        if (data && data.detection_info) {
          setDetectionInfo(data.detection_info);
          setResultText(data.result_text || '');
          setOriginalImg(data.original ? `data:image/jpeg;base64,${data.original}` : null);
          setEnhancedImg(data.enhanced ? `data:image/jpeg;base64,${data.enhanced}` : null);
          setPredictedImg(data.predicted ? `data:image/jpeg;base64,${data.predicted}` : null);
        }
      } catch (err) {
        console.error("Error fetching last prediction:", err);
      }
    };
    fetchLastPrediction();
  }, []);

  const handleDownload = () => {
    generatePDF(predictedImg, detectionInfo);
  }

const handleChange = async (e) => {
  // Reset backend (hapus hasil lama)
  await fetch('http://127.0.0.1:5050/reset-prediction', { method: 'POST' });

  const file = e.target.files[0];
  if (file) {
    setSelectedFile(file);
    setPreview(await getFilePreview(file));
  } else {
    setPreview('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
  }
  resetPredictionState({ setOriginalImg, setEnhancedImg, setPredictedImg, setResultText, setError });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedFile) return;

  setResultText('');
  setError(false);
  setLoading(true);

  try {
    const data = await predictImage(selectedFile);

    const ori = `data:image/jpeg;base64,${data.original}`;
    const enh = `data:image/jpeg;base64,${data.enhanced}`;
    const pred = `data:image/jpeg;base64,${data.predicted}`;

    setOriginalImg(ori);
    setEnhancedImg(enh);
    setPredictedImg(pred);
    setDetectionInfo(data.detection_info || []);

  } catch (err) {
    setResultText(`❌ ${err.message}`);
    setError(true);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
    <Navbar />
    <div className="main-content">
    <HeroSection />
    <About />
    <Technology />

      <div className="container">
        <h1>Kontruksi Citra X-ray</h1>
        <h3>Masukan gambar untuk mendapatkan hasil prediksi</h3>
        <FormUpload
        onSubmit={handleSubmit}
        onFileChange={handleChange}
        loading={loading}
        onDownload={handleDownload}
        showDownload={originalImg && enhancedImg && predictedImg} />

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