import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

const FILE_NAME = 'dpa_export';

export const exportPDF = (element) => {
  // eslint-disable-next-line new-cap
  const pdf = new jsPDF();

  domtoimage.toPng(element.current).then((dataUrl) => {
    pdf.setFontSize(8);
    pdf.setTextColor('#00416a');
    const pdfHeader = 'Acxiom Data Portrait Analysis';
    pdf.text(pdfHeader, 10, 8);
    pdf.addImage(dataUrl, 'PNG', 8, 16);
    pdf.save(FILE_NAME);
  });
};

export const exportFullPDF = (element, headerContent) => {
  // eslint-disable-next-line new-cap
  const pdf = new jsPDF('landscape');

  domtoimage.toPng(element.current).then((dataUrl) => {
    const pdfHeader = `Acxiom Data Portrait Analysis > ${headerContent.dpaName} > ${headerContent.audienceName} vs ${headerContent.referenceName}`;
    pdf.setFontSize(10);
    pdf.setTextColor('#00416a');
    pdf.text(pdfHeader, 8, 8);
    const image = new Image();
    image.onload = () => {
      const ratio = image.width / image.height;
      const pdfHeight = pdf.internal.pageSize.height;
      const h = 8;
      const aspectwidth = (pdfHeight - h) * ratio;
      pdf.addImage(image, 'PNG', 0, 10, aspectwidth, pdfHeight - h);
      pdf.save(FILE_NAME);
    };
    image.src = dataUrl;
  });
};

export const exportPNG = (element) => {
  domtoimage.toPng(element.current).then((dataUrl) => {
    // crete link to download created image
    const link = document.createElement('a');
    link.download = FILE_NAME;
    link.href = dataUrl;
    link.click();
  });
};
