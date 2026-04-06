import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'mtthemes',
  description: 'Show off your custom Monkeytype themes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
