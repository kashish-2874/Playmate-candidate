import { useEffect, useMemo, useState } from 'react';
import { Plus, UsersRound } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { DEFAULT_GAME_FILTERS, GameFilterBar, type GameFilters } from '../components/game/GameFilterBar';
import { GameCard } from '../components/game/GameCard';
import { PostGameModal } from '../components/game/PostGameModal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useNow } from '../hooks/useSlotStatuses';
import { useVenues } from '../hooks/useVenues';
import { useAppStore } from '../store/useAppStore';
import { isPastSlot } from '../utils/date';
import { pluralize } from '../utils/format';

export default function PlayersPage() {
  useDocumentTitle('Find players');
  const games = useAppStore((s) => s.games);
  const venues = useVenues();
  const now = useNow();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<GameFilters>(DEFAULT_GAME_FILTERS);
  const [postOpen, setPostOpen] = useState(false);
  const [prelinkedBookingId, setPrelinkedBookingId] = useState<string | undefined>();

  // Deep link from the booking success screen: /players?post=<bookingId>
  useEffect(() => {
    const bookingId = searchParams.get('post');
    if (bookingId === null) return;
    setPrelinkedBookingId(bookingId || undefined);
    setPostOpen(true);
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const visibleGames = useMemo(
    () =>
      games
        .filter((g) => !isPastSlot(g.date, g.hour, now))
        .filter((g) => filters.sport === 'all' || g.sport === filters.sport)
        .filter((g) => filters.skill === 'all' || g.skill === filters.skill)
        .filter((g) => !filters.beginnerOnly || g.beginnerFriendly)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [games, filters, now],
  );

  const isFiltered =
    filters.sport !== DEFAULT_GAME_FILTERS.sport ||
    filters.skill !== DEFAULT_GAME_FILTERS.skill ||
    filters.beginnerOnly !== DEFAULT_GAME_FILTERS.beginnerOnly;

  const openPost = () => {
    setPrelinkedBookingId(undefined);
    setPostOpen(true);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_GAME_FILTERS);
    toast('Filters cleared', { icon: '🧹' });
  };

  return (
    <div className="container-page">
      <PageHeader
        title="Find players"
        subtitle="Join an open game nearby, or post your own and fill the spots."
        actions={
          <Button onClick={openPost} icon={<Plus className="h-4 w-4" aria-hidden />}>
            Post a game
          </Button>
        }
      />

      <div className="card mb-6 p-4">
        <GameFilterBar filters={filters} onChange={setFilters} />
      </div>

      <p className="muted mb-4 text-sm" aria-live="polite">
        {pluralize(visibleGames.length, 'open game')}
      </p>

      {visibleGames.length === 0 ? (
        <EmptyState
          icon={<UsersRound className="h-7 w-7" aria-hidden />}
          title={isFiltered ? 'No games match these filters' : 'No open games right now'}
          description={
            isFiltered ? 'Try another sport or skill level — or start a game yourself.' : 'Be the first to post a game in your area.'
          }
          action={
            <>
              {isFiltered && (
                <Button variant="outline" onClick={resetFilters}>
                  Reset filters
                </Button>
              )}
              <Button onClick={openPost}>Post a game</Button>
            </>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGames.map((game, i) => {
            const venue = venues.find((v) => v.id === game.venueId);
            return venue ? <GameCard key={game.id} game={game} venue={venue} index={i} /> : null;
          })}
        </div>
      )}

      <PostGameModal open={postOpen} onClose={() => setPostOpen(false)} initialBookingId={prelinkedBookingId} />
    </div>
  );
}
