import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useThemeEffect } from '../../hooks/useThemeEffect';
import { syncStoreAcrossTabs, useAppStore } from '../../store/useAppStore';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { PageLoader } from './PageLoader';
import { TopNav } from './TopNav';

export function AppLayout() {
  const { pathname } = useLocation();
  const theme = useAppStore((s) => s.theme);
  useThemeEffect();

  useEffect(() => syncStoreAcrossTabs(), []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <TopNav />
      <main id="main" className="flex-1 pt-6 md:pt-8">
        <Suspense fallback={<PageLoader />}>
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
      <Toaster
        theme={theme}
        position="top-center"
        richColors
        closeButton
        toastOptions={{ className: 'font-sans' }}
      />
    </div>
  );
}
