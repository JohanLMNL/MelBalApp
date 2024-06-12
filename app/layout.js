import './globals.css';

export const metadata = {
  title: 'MelBal Dashboard',
  icons: {
    icon: '/favicon/favicon-32x32.png',
    shortcut: '/favicon/favicon-32x32.png',
    apple: '/favicon/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/favicon/apple-icon.png',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='fr'>
      <body>{children}</body>
    </html>
  );
}
