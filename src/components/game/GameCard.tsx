import { CalendarDays, Check, Copy, MapPin, Sprout, UserPlus, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { SKILL_META, SPORT_META } from '../../data/sports';
import { useAppStore } from '../../store/useAppStore';
import type { Game, Venue } from '../../types';
import { cn } from '../../utils/cn';
import { formatLongDate, hourLabel } from '../../utils/date';
import { copyToClipboard } from '../../utils/ics';
import { formatINR } from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SportIcon } from '../ui/SportBadge';

interface GameCardProps {
  game: Game;
  venue: Venue;
  index?: number;
}

export function GameCard({ game, venue, index = 0 }: GameCardProps) {
  const requested = useAppStore((s) => s.joinRequests.includes(game.id));
  const requestToJoin = useAppStore((s) => s.requestToJoin);

  const spotsLeft = Math.max(game.totalPlayers - game.playersJoined, 0);
  const isFull = spotsLeft === 0;
  const filledPct = (game.playersJoined / game.totalPlayers) * 100;
  const costPerPlayer = game.totalCost ? game.totalCost / game.totalPlayers : undefined;
  const sportLabel = SPORT_META[game.sport].label;

  const onJoin = () => {
    requestToJoin(game.id);
    toast.success(`Request sent to ${game.host.name.split(' ')[0]}`, {
      description: `${sportLabel} · ${formatLongDate(game.date)}, ${hourLabel(game.hour)}`,
    });
  };

  const onCopyInvite = async () => {
    const text = `Join my ${sportLabel.toLowerCase()} game at ${venue.name} on ${formatLongDate(game.date)}, ${hourLabel(game.hour)}! ${spotsLeft} spots left${costPerPlayer ? `, ${formatINR(costPerPlayer)} each` : ''}. ${window.location.origin}/players`;
    const ok = await copyToClipboard(text);
    if (ok) toast.success('Invite copied — share it with your friends');
    else toast.error('Could not access the clipboard.');
  };

  return (
    <article className="card flex animate-slide-up flex-col p-5" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
      <div className="flex items-start gap-3">
        <div className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', SPORT_META[game.sport].badgeClass)}>
          <SportIcon sport={game.sport} className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-snug">{sportLabel} game</h3>
          <Link to={`/venue/${venue.id}`} className="muted flex items-center gap-1 text-sm hover:text-brand-700 hover:underline dark:hover:text-brand-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {venue.name}, {venue.area}
            </span>
          </Link>
        </div>
        {game.isMine && <Badge tone="info">Your game</Badge>}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', SKILL_META[game.skill].badgeClass)}>
          {SKILL_META[game.skill].label}
        </span>
        {game.beginnerFriendly && (
          <Badge tone="brand" icon={<Sprout className="h-3.5 w-3.5" aria-hidden />}>
            Beginner friendly
          </Badge>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm font-medium">
        <CalendarDays className="h-4 w-4 text-brand-600" aria-hidden />
        {formatLongDate(game.date)} · {hourLabel(game.hour)}
      </p>

      {game.notes && <p className="muted mt-2 line-clamp-2 text-sm">{game.notes}</p>}

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs font-medium">
          <span className={isFull ? 'text-rose-600 dark:text-rose-400' : 'text-brand-700 dark:text-brand-400'}>
            {isFull ? 'Game full' : `${spotsLeft} ${spotsLeft === 1 ? 'spot' : 'spots'} left`}
          </span>
          <span className="muted">
            {game.playersJoined}/{game.totalPlayers} players
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-label="Players joined"
          aria-valuemin={0}
          aria-valuemax={game.totalPlayers}
          aria-valuenow={game.playersJoined}
        >
          <div className={cn('h-full rounded-full transition-all', isFull ? 'bg-rose-500' : 'bg-brand-500')} style={{ width: `${filledPct}%` }} />
        </div>
      </div>

      {costPerPlayer !== undefined && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60">
          <Wallet className="h-4 w-4 text-brand-600" aria-hidden />
          <span>
            <strong>{formatINR(costPerPlayer)}</strong> per player
          </span>
          <span className="muted ml-auto text-xs">
            {formatINR(game.totalCost!)} ÷ {game.totalPlayers}
          </span>
        </p>
      )}

      <div className="mt-auto pt-4" />
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar name={game.host.name} colorClass={game.host.avatarColor} size="sm" />
          <div className="min-w-0 text-sm">
            <p className="muted text-xs">Hosted by</p>
            <p className="truncate font-semibold">{game.isMine ? 'You' : game.host.name}</p>
          </div>
        </div>
        {game.isMine ? (
          <Button variant="outline" size="sm" onClick={onCopyInvite} icon={<Copy className="h-4 w-4" aria-hidden />}>
            Copy invite
          </Button>
        ) : requested ? (
          <Button variant="outline" size="sm" disabled icon={<Check className="h-4 w-4" aria-hidden />}>
            Request sent
          </Button>
        ) : (
          <Button size="sm" onClick={onJoin} disabled={isFull} icon={<UserPlus className="h-4 w-4" aria-hidden />}>
            {isFull ? 'Full' : 'Join'}
          </Button>
        )}
      </div>
    </article>
  );
}
