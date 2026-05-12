interface SectionTitleProps {
  title: string;
  children?: React.ReactNode;
}

export function SectionTitle({ title, children }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  );
}
