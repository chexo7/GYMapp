import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });

export const metadata = {
  title: 'Roxborough Training Log',
  description: 'Registro de entrenamiento inspirado en la versión HTML original, ahora en Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-[var(--app-bg)] text-white`}>{children}</body>
    </html>
  );
}
