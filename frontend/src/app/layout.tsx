import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'TaskMaster Pro | Enterprise Task & Workflow Management',
  description: 'Production-ready full-stack task management dashboard matching modern Figma specifications with JWT auth, themes, analytics, and instant productivity tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
