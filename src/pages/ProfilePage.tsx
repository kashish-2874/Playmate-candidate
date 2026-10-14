import { useState } from 'react';
import { CalendarCheck, Clock, MapPin, Pencil, Trophy, Users, Wallet } from 'lucide-react';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { Avatar } from '../components/ui/Avatar';
import { ColumnChart, HorizontalBarChart } from '../components/ui/BarChart';
import { Button, ButtonLink } from '../components/ui/Button';
import { SportBadge, SportIcon } from '../components/ui/SportBadge';
import { StatCard } from '../components/ui/StatCard';
import { SPORT_META } from '../data/sports';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useAppStore } from '../store/useAppStore';
import { parseISODate } from '../utils/date';
import { formatINR } from '../utils/format';

export default function ProfilePage() {
  useDocumentTitle('Profile');
  const user = useAppStore((s) => s.user);
  const joinRequests = useAppStore((s) => s.joinRequests);
  const stats = usePlayerStats();
  const [editing, setEditing] = useState(false);

  const memberSince = parseISODate(user.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="container-page max-w-5xl">
      <section className="card relative mb-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-600 via-brand-500 to-teal-400 sm:h-28" aria-hidden />
        <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <Avatar name={user.name} colorClass={user.avatarColor} size="xl" className="ring-4 ring-white dark:ring-slate-900" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{user.name}</h1>
              <p className="muted flex flex-wrap items-center gap-x-3 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" aria-hidden /> {user.city}
                </span>
                <span>Member since {memberSince}</span>
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Sports played">
                {user.sports.map((sport) => (
                  <li key={sport}>
                    <SportBadge sport={sport} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Button variant="outline" onClick={() => setEditing(true)} icon={<Pencil className="h-4 w-4" aria-hidden />}>
            Edit profile
          </Button>
        </div>
      </section>

      <section aria-label="Stats overview" className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Games played" value={stats.gamesPlayed} icon={<Trophy className="h-5 w-5" aria-hidden />} />
        <StatCard label="Hours on court" value={stats.hoursPlayed} icon={<Clock className="h-5 w-5" aria-hidden />} />
        <StatCard label="Spent on PlayMate" value={formatINR(stats.totalSpent)} icon={<Wallet className="h-5 w-5" aria-hidden />} />
        <StatCard
          label="Games hosted"
          value={stats.gamesHosted}
          icon={<Users className="h-5 w-5" aria-hidden />}
          hint={`${joinRequests.length} join request${joinRequests.length === 1 ? '' : 's'} sent`}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5" aria-labelledby="per-sport-heading">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 id="per-sport-heading" className="font-bold">
              Games per sport
            </h2>
            {stats.favouriteSport && (
              <p className="muted text-xs">
                Favourite: <span className="font-semibold text-slate-900 dark:text-white">{SPORT_META[stats.favouriteSport].label}</span>
              </p>
            )}
          </div>
          <HorizontalBarChart
            title="Games played per sport"
            unit="Games"
            data={stats.perSport.map(({ sport, count }) => ({
              key: sport,
              label: SPORT_META[sport].label,
              value: count,
              icon: <SportIcon sport={sport} className="h-3.5 w-3.5 text-slate-500" />,
            }))}
          />
        </section>

        <section className="card p-5" aria-labelledby="per-month-heading">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 id="per-month-heading" className="font-bold">
              Games per month
            </h2>
            <p className="muted text-xs">Last 6 months</p>
          </div>
          <ColumnChart
            title="Games played per month, last 6 months"
            unit="Games"
            data={stats.perMonth.map((m) => ({ key: m.key, label: m.label, value: m.count }))}
          />
        </section>
      </div>

      <section className="card mt-6 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold">Keep the streak going</h2>
          <p className="muted text-sm">Book your next game or find a team that needs a player.</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink to="/players" variant="outline" icon={<Users className="h-4 w-4" aria-hidden />}>
            Find players
          </ButtonLink>
          <ButtonLink to="/" icon={<CalendarCheck className="h-4 w-4" aria-hidden />}>
            Book a venue
          </ButtonLink>
        </div>
      </section>

      <EditProfileModal open={editing} onClose={() => setEditing(false)} />
    </div>
  );
}
