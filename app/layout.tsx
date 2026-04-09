import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Monkeytype Themes',
  description: 'Post and use other peoples themes for Monkeytype, for completely free.',
  icons: {
    icon: '/images/mtthemes.png',
  },
  themeColor: '#e2b714',
  openGraph: {
    title: 'Monkeytype Themes',
    description: 'Post and use other peoples themes for Monkeytype, for completely free.',
    images: ['/images/readme_picture.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
