'use client';
import React from 'react';

import { FileIcon } from '@radix-ui/react-icons';

import { generatePDF } from '@/app/components/utils/generatePDF';
import GButton from '@/app/components/ui/GButton';

const PrintResa = () => {
  const handleGeneratePDF = async () => {
    const pdfBytes = await generatePDF();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
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
