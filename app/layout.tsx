import './globals.css';
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SessionProvider from '@/components/SessionProvider';

export const metadata = {
  title: 'Enrollment CMS'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
