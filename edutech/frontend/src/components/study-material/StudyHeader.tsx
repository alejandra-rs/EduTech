import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export interface StudyHeaderProps {
  onBack: () => void;
  backLabel: string;
  typeIcon?: React.ComponentType<{ className?: string }>;
  typeLabel?: string;
  title?: string;
  description?: string;
  titleSize?: string;
  descriptionStyle?: string;
}

const StudyHeader = ({ onBack, backLabel, title, description, titleSize = "text-4xl", descriptionStyle = "text-lg text-gray-500 leading-relaxed" }: StudyHeaderProps) => (
  <div className="mb-10">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors"
    >
      <ArrowLeftIcon className="w-4 h-4" />
      {backLabel}
    </button>

    <h1 className={`${titleSize} font-black text-gray-900 mb-3`}>{title}</h1>
    <p className={descriptionStyle}>{description}</p>
  </div>
);

export default StudyHeader;
