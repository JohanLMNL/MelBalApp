import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const fetchImageAsArrayBuffer = async (url) => {
  const response = await fetch(url);
  return response.arrayBuffer();
};

const getDayName = (date) => {
  const days = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ];
  return days[date.getDay()];
};

const getMonthName = (date) => {
  const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  return months[date.getMonth()];
};

const getCurrentDateFormatted = () => {
  const today = new Date();
  const dayName = getDayName(today);
  const day = today.getDate();
  const monthName = getMonthName(today);
  return `${dayName} ${day} ${monthName}`;
};

const fetchReservations = async (date) => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('salle', 'baltazar')
    .eq('date', date);

  if (error) {
    console.error(
      'Erreur lors de la récupération des réservations:',
      error
    );
    return [];
  }
  return data;
};

export const generatePDF = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  const reservations = await fetchReservations(currentDate);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Dimensions A4 en points
  const { width, height } = page.getSize();

  const logoUrl = '/logoBal.png';
  const logoImageBytes = await fetchImageAsArrayBuffer(logoUrl);
  const logoImage = await pdfDoc.embedPng(logoImageBytes);

  const logoWidth = 30;
  const logoHeight = (logoImage.height * logoWidth) / logoImage.width;

  const logoX = 50;
  const logoY = height - logoHeight - 50;
  page.drawImage(logoImage, {
    x: logoX,
    y: logoY,
    width: logoWidth,
    height: logoHeight,
  });

  const textX = logoX + logoWidth + 20;
  const textY = logoY + logoHeight / 2;
  const titleFontSize = 30;
  const helveticaBoldFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  );
  page.drawText('Réservations', {
    x: textX,
    y: textY,
    size: titleFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });

  const dateFontSize = 15;
  const currentDateFormatted = getCurrentDateFormatted();
  page.drawText(currentDateFormatted, {
    x: textX,
    y: textY - titleFontSize + 8,
    size: dateFontSize,
    color: rgb(0, 0, 0),
  });

  const tableFontSize = 12;
  const cellPadding = 15; // Padding pour agrandir la hauteur des lignes

  const columns = [
    { header: 'Nom', width: 120 },
    { header: 'Nombre', width: 60 },
    { header: 'Acompte', width: 60 },
    { header: 'Commentaire', width: 300 },
    { header: 'Table', width: 40 },
  ];

  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
  const tableX = (width - tableWidth) / 2;
  const tableY = textY - titleFontSize - 50;

  // Dessiner les bordures pour les en-têtes de colonnes
  columns.forEach((column, index) => {
    const columnX =
      tableX +
      columns
        .slice(0, index)
        .reduce((sum, col) => sum + col.width, 0);
    const textWidth = helveticaBoldFont.widthOfTextAtSize(
      column.header,
      tableFontSize
    );

    // Dessiner le texte de l'en-tête
    page.drawText(column.header, {
      x: columnX + (column.width - textWidth) / 2,
      y: tableY - cellPadding / 2 + tableFontSize / 2, // Centrer verticalement dans la cellule
      size: tableFontSize,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });

    // Dessiner la bordure de l'en-tête
    page.drawRectangle({
      x: columnX,
      y: tableY - tableFontSize - cellPadding,
      width: column.width,
      height: tableFontSize + cellPadding * 2,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  });

  let rowY = tableY - tableFontSize - cellPadding;

  const splitTextIntoLines = (text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = helveticaBoldFont.widthOfTextAtSize(
        testLine,
        tableFontSize
      );
      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);

    return lines;
  };

  reservations.forEach((row) => {
    let maxLines = 1;
    const rowLines = columns.map((column) => {
      let cellValue = row[column.header.toLowerCase()] || '';

      // Ajouter le symbole € pour la colonne Acompte
      if (column.header === 'Acompte') {
        cellValue = cellValue ? `${cellValue} €` : '0 €';
      }

      const sanitizedCellValue = cellValue
        .toString()
        .replace(/\n/g, ' ');
      const lines = splitTextIntoLines(
        sanitizedCellValue,
        column.width - 2 * cellPadding
      );
      maxLines = Math.max(maxLines, lines.length);
      return lines;
    });

    const rowHeight = maxLines * tableFontSize + cellPadding * 2;

    columns.forEach((column, index) => {
      const columnX =
        tableX +
        columns
          .slice(0, index)
          .reduce((sum, col) => sum + col.width, 0);
      const lines = rowLines[index];

      // Calculer le point de départ pour centrer verticalement le texte
      let lineY =
        rowY -
        (rowHeight - tableFontSize * lines.length) / 2 -
        tableFontSize;

      lines.forEach((line) => {
        const textWidth = helveticaBoldFont.widthOfTextAtSize(
          line,
          tableFontSize
        );
        page.drawText(line, {
          x: columnX + (column.width - textWidth) / 2, // Centrer le texte horizontalement
          y: lineY,
          size: tableFontSize,
          color: rgb(0, 0, 0),
        });
        lineY -= tableFontSize;
      });

      // Dessiner la bordure de la cellule
      page.drawRectangle({
        x: columnX,
        y: rowY - rowHeight,
        width: column.width,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    });

    rowY -= rowHeight; // Aller à la prochaine ligne
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
