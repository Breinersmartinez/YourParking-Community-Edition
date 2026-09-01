import Spinner from './Spinner';

export default function StatCard({ title, value, icon, tone = 'primary', loading }) {
  const tones = {
    primary: 'bg-primary-500/10 text-primary-500',
    yellow: 'bg-accent-400/10 text-accent-300',
    green: 'bg-success-500/10 text-success-500',
    red: 'bg-danger-500/10 text-danger-500',
    blue: 'bg-blue-500/10 text-blue-400',
    gray: 'bg-neutral-700/20 text-neutral-300',
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-neutral-400">{title}</p>
        {loading ? (
          <div className="mt-1">
            <Spinner size="sm" />
          </div>
        ) : (
          <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        )}
      </div>
    </div>
  );
}
