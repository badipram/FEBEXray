import jsPDF from "jspdf";

export const generatePDF = (predictedImg, detectionInfo) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Hasil Prediksi Citra X-ray', 10, 15);

  doc.setFontSize(12);
  doc.text(`Jumlah Deteksi: ${detectionInfo.length}`, 10, 25);

  detectionInfo.forEach((det, idx) => {
    doc.text(
      `#${idx + 1} - Confidence: ${(det.confidence * 100).toFixed(2)}% - Koordinat: ${det.bbox.map(x => x.toFixed(1)).join(', ')}`,
      10,
      35 + idx * 10
    );
  });

  if (predictedImg) {
    doc.addImage(predictedImg, 'JPEG', 10, 50, 90, 60);
  }

  doc.save('hasil_prediksi.pdf');
};