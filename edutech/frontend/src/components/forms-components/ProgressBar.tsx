interface ProgressBarProps {
  currentIdx: number;
  total: number;
  isError?: boolean;
}

export default function ProgressBar({ currentIdx, total, isError = false }: ProgressBarProps) {
  if (isError) return null;

  return (
    <div className="h-1 bg-gray-100">
      <div
        className="h-full bg-indigo-500 transition-all duration-700"
        style={{ width: `${Math.max(((currentIdx + 1) / total) * 100, 4)}%` }}
      />
    </div>
  );
}
