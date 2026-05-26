import type { PostType } from "../../models/documents/post.model";

interface LabelConfig {
  bg: string;
  border: string;
  textColor: string;
  emoji: string;
  text: string;
}

const LABEL_CONFIG: Record<string, LabelConfig> = {
  PDF: { bg: "bg-red-600",    border: "border-red-700",    textColor: "text-red-700",    emoji: "📄", text: "PDF"   },
  VID: { bg: "bg-blue-600",   border: "border-blue-700",   textColor: "text-blue-700",   emoji: "▶",  text: "VIDEO" },
  QUI: { bg: "bg-orange-500", border: "border-orange-600", textColor: "text-orange-600", emoji: "📝", text: "QUIZ"  },
  FLA: { bg: "bg-indigo-500", border: "border-indigo-600", textColor: "text-indigo-600", emoji: "🃏", text: "FLASH" },
};

export const PostLabel = ({ type }: { type: PostType | string }) => {
  const { bg, border, textColor, emoji, text } = LABEL_CONFIG[type] ?? LABEL_CONFIG.PDF;
  return (
    <div className={`w-16 h-12 ${bg} rounded-md shadow-md flex items-center justify-center border-2 ${border} relative`}>
      <span className={type === "VID" ? "text-xl text-white" : "text-xl"}>{emoji}</span>
      <span className={`absolute bottom-1 right-1 bg-white ${textColor} text-[10px] font-bold px-1 rounded-sm`}>{text}</span>
    </div>
  );
};
