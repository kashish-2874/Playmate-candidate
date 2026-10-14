import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

/** Mirrors the persisted theme onto <html class="dark">. */
export function useThemeEffect(): void {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0f172a' : '#059669');
  }, [theme]);
}
