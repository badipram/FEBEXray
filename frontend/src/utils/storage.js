const keys = {
  original: 'originalImg',
  enhanced: 'enhancedImg',
  predicted: 'predictedImg',
  detectionInfo: 'detectionInfo',
  resultText: 'resultText'
};

export const savePrediction = (data) => {
  localStorage.setItem(keys.original, JSON.stringify(data.original));
  localStorage.setItem(keys.enhanced, JSON.stringify(data.enhanced));
  localStorage.setItem(keys.predicted, JSON.stringify(data.predicted));
  localStorage.setItem(keys.detectionInfo, JSON.stringify(data.detection_info || []));
  localStorage.setItem(keys.resultText, '✅ Prediction Completed');
};

export const loadPrediction = () => {
  const ori = localStorage.getItem(keys.original);
  const enh = localStorage.getItem(keys.enhanced);
  const pred = localStorage.getItem(keys.predicted);
  const info = localStorage.getItem(keys.detectionInfo);
  const resText = localStorage.getItem(keys.resultText);

  if (ori && enh && pred) {
    return {
      original: `data:image/jpeg;base64,${JSON.parse(ori)}`,
      enhanced: `data:image/jpeg;base64,${JSON.parse(enh)}`,
      predicted: `data:image/jpeg;base64,${JSON.parse(pred)}`,
      detectionInfo: info ? JSON.parse(info) : [],
      resultText: resText || ''
    };
  }
  return null;
};

export const clearPrediction = () => {
  Object.values(keys).forEach((key) => localStorage.removeItem(key));
};