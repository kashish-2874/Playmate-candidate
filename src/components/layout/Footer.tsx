import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function Footer() {
  const resetDemo = useAppStore((s) => s.resetDemo);
  const [confirming, setConfirming] = useState(false);

  const onReset = () => {
    resetDemo();
    setConfirming(false);
    toast.success('Demo data restored');
  };

  return (
    <footer className="container-page mt-16 border-t border-slate-200 py-8 dark:border-slate-800">
      <div className="muted flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
        <p>© {new Date().getFullYear()} PlayMate · Built as a frontend demo. All data is stored in your browser.</p>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium hover:text-slate-900 dark:hover:text-white"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Reset demo data
        </button>
      </div>
      <ConfirmDialog
        open={confirming}
        title="Reset demo data?"
        description="Your bookings, posted games, favourites and profile edits will be replaced with the original demo data."
        confirmLabel="Reset"
        tone="danger"
        onConfirm={onReset}
        onCancel={() => setConfirming(false)}
      />
    </footer>
  );
}
