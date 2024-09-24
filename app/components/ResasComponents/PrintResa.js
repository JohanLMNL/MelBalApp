import React from 'react';
import { FileIcon } from '@radix-ui/react-icons';
import { generatePDF } from '@/app/components/utils/generatePDF';
import GButton from '@/app/components/ui/GButton';

const PrintResa = () => {
  const handleGeneratePDF = async () => {
    const pdfBytes = await generatePDF();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    if (window.matchMedia('(max-width: 768px)').matches) {
      // Sur mobile, on force le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reservation.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Sur desktop, on ouvre dans une nouvelle fenêtre
      window.open(url);
    }
  };

  return (
    <div>
      <GButton
        onClick={handleGeneratePDF}
        endIcon={<FileIcon />}
      >
        Imprimer
      </GButton>
    </div>
  );
};

export default PrintResa;
