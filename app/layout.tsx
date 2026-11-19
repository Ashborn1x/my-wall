import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Jon Doe - My Wall',
  description:
    'A nostalgic 2008–2009 Facebook-inspired profile wall experience called My Wall.',
  openGraph: {
    title: 'Jon Doe - My Wall',
    description:
      'A nostalgic 2008–2009 Facebook-inspired profile wall experience called My Wall.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
