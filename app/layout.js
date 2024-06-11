import './globals.css';

export const metadata = {
  title: 'Kommands Dashboard',
  icons: {
    icon: ['/favicon/favicon-32x32.png'],
    apple: ['/apple-icon.png'],
    shortcut: ['/apple-icon.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='fr'>
      <body>{children}</body>
    </html>
  );
}
