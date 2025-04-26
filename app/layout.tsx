import './globals.css';
import { Providers } from './providers'; // make sure the path is correct

export const metadata = {
  title: 'Scholarship Portal',
  description: 'Onchain scholarship platform powered by Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

