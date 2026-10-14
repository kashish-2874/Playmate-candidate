import { useEffect } from 'react';

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title ? `${title} · PlayMate` : 'PlayMate — Book venues, find players';
  }, [title]);
}
