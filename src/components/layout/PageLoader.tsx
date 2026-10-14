import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" aria-hidden />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
