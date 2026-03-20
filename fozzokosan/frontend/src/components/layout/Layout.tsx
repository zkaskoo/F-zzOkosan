import type { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-text-secondary">
        FozzOkosan &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
