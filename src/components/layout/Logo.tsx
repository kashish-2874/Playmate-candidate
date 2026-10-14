import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-lg" aria-label="PlayMate home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16M12 4c-3 3-3 13 0 16M12 4c3 3 3 13 0 16" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight">
        Play<span className="text-brand-600 dark:text-brand-400">Mate</span>
      </span>
    </Link>
  );
}
