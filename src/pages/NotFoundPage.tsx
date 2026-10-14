import { Compass, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonLink } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  const navigate = useNavigate();

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="bg-gradient-to-br from-brand-500 to-teal-400 bg-clip-text text-8xl font-black text-transparent sm:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-extrabold">Out of bounds!</h1>
      <p className="muted mt-2 max-w-md">The page you're looking for has left the field. Let's get you back in the game.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'))}>
          Go back
        </Button>
        <ButtonLink to="/" icon={<Home className="h-4 w-4" aria-hidden />}>
          Home
        </ButtonLink>
        <ButtonLink to="/players" variant="ghost" icon={<Compass className="h-4 w-4" aria-hidden />}>
          Find players
        </ButtonLink>
      </div>
    </div>
  );
}
