import './globals.css';

export const metadata = {
  title: 'Kommands Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang='fr'>
      <body>{children}</body>
    </html>
  );
}
