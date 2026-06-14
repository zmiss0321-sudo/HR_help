import { PageKey, Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: Role | null;
  page: PageKey;
  onPageChange: (page: PageKey) => void;
  onHome: () => void;
  onResetDemo: () => void;
}

export function Layout({ children, page, onHome }: LayoutProps) {
  const isHome = page === 'home';

  return (
    <div className={isHome ? 'min-h-screen bg-[#FAFAF7]' : 'min-h-screen app-shell'}>
      {isHome ? null : (
        <button className="quiet-home-link" onClick={onHome}>
          ← 实习能量站
        </button>
      )}
      <main className={isHome ? 'min-h-screen' : 'mx-auto max-w-6xl px-4 pb-8 pt-14 lg:px-6 lg:pt-16'}>{children}</main>
    </div>
  );
}
