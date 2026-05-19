import type { SessionStatus } from "../../models/studysessions/studysession.model";

const BADGE_CONFIG: Record<SessionStatus, { label: string; className: string; dot?: boolean }> = {
  proxima:    { label: "Próxima",    className: "bg-indigo-100 text-indigo-700" },
  en_directo: { label: "En directo", className: "bg-red-100 text-red-600", dot: true },
  finalizada: { label: "Finalizada", className: "bg-gray-100 text-gray-500" },
};

interface Props {
  status: SessionStatus;
}

export default function SessionStatusBadge({ status }: Props) {
  const { label, className, dot } = BADGE_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
      {label}
    </span>
  );
}
