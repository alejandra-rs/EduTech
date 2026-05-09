import { PostType } from "../../models/documents/post.model";

const LabelPDF = () => (
  <div className="w-16 h-12 bg-red-600 rounded-md shadow-md flex items-center justify-center border-2 border-red-700 relative">
    <span className="text-3xl">📄</span>
    <span className="absolute bottom-1 right-1 bg-white text-red-700 text-[10px] font-bold px-1 rounded-sm">PDF</span>
  </div>
);

 const LabelVideo = () => (
  <div className="w-16 h-12 bg-blue-600 rounded-md shadow-md flex items-center justify-center border-2 border-blue-700 relative">
    <span className="text-xl text-white">▶</span>
    <span className="absolute bottom-1 right-1 bg-white text-blue-700 text-[10px] font-bold px-1 rounded-sm">VIDEO</span>
  </div>
);

const LabelQuiz = () => (
  <div className="w-16 h-12 bg-orange-500 rounded-md shadow-md flex items-center justify-center border-2 border-orange-600 relative">
    <span className="text-xl">📝</span>
    <span className="absolute bottom-1 right-1 bg-white text-orange-600 text-[10px] font-bold px-1 rounded-sm">QUIZ</span>
  </div>
);

const LabelFlashCard = () => (
  <div className="w-16 h-12 bg-indigo-500 rounded-md shadow-md flex items-center justify-center border-2 border-indigo-600 relative">
    <span className="text-xl">🃏</span>
    <span className="absolute bottom-1 right-1 bg-white text-indigo-600 text-[10px] font-bold px-1 rounded-sm">FLASH</span>
  </div>
);

export const LABELS = {
  PDF: LabelPDF,
  VID: LabelVideo,
  QUI: LabelQuiz,
  FLA: LabelFlashCard,
};

export const PostLabel = ({ type }: { type: PostType }) => {
  const LabelComponent = LABELS[type];
  return <LabelComponent />;
};