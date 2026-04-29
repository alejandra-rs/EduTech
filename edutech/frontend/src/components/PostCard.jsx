import { HandThumbUpIcon, HandThumbDownIcon, EyeIcon } from '@heroicons/react/24/solid';
import { ReactionButton } from "./ReactionButton";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PdfPreview = ({ fileUrl }) => (
  <div className="w-full h-48 border-b border-gray-200 bg-gray-100 shrink-0">
    <iframe src={fileUrl} className="w-full h-full" title="PDF preview" />
  </div>
);

const VideoPreview = ({ fileUrl }) => {
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('embed/')) return url;
    const videoId = url.split('v=')[1]?.split('&')[0];
    const shortId = url.split('youtu.be/')[1]?.split('?')[0];
    const finalId = videoId || shortId;
    return finalId ? `https://www.youtube.com/embed/${finalId}` : url;
  };

  return (
    <div className="w-full h-48 border-b border-gray-200 bg-gray-100 shrink-0">
      <iframe
        src={getEmbedUrl(fileUrl)}
        className="w-full h-full"
        title="Video preview"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const QuizPreview = ({ questionCount }) => (
  <div className="w-full h-48 border-b border-gray-200 bg-blue-50 shrink-0 flex flex-col items-center justify-center gap-2">
    <span className="text-4xl">📝</span>
    <span className="text-sm font-semibold text-blue-700">{questionCount ?? "?"} preguntas</span>
  </div>
);

const FlashCardPreview = ({ cardCount }) => (
  <div className="w-full h-48 border-b border-gray-200 bg-indigo-50 shrink-0 flex flex-col items-center justify-center gap-2">
    <span className="text-4xl">🃏</span>
    <span className="text-sm font-semibold text-indigo-700">{cardCount ?? "?"} tarjetas</span>
  </div>
);

export const LabelPDF = () => (
  <div className="w-16 h-12 bg-red-600 rounded-md shadow-md flex items-center justify-center border-2 border-red-700 relative">
    <span className="text-3xl">📄</span>
    <span className="absolute bottom-1 right-1 bg-white text-red-700 text-[10px] font-bold px-1 rounded-sm">PDF</span>
  </div>
);

export const LabelVideo = () => (
  <div className="w-16 h-12 bg-blue-600 rounded-md shadow-md flex items-center justify-center border-2 border-blue-700 relative">
    <span className="text-xl text-white">▶</span>
    <span className="absolute bottom-1 right-1 bg-white text-blue-700 text-[10px] font-bold px-1 rounded-sm">VIDEO</span>
  </div>
);

export const LabelQuiz = () => (
  <div className="w-16 h-12 bg-blue-500 rounded-md shadow-md flex items-center justify-center border-2 border-blue-600 relative">
    <span className="text-xl">📝</span>
    <span className="absolute bottom-1 right-1 bg-white text-blue-600 text-[10px] font-bold px-1 rounded-sm">QUIZ</span>
  </div>
);

export const LabelFlashCard = () => (
  <div className="w-16 h-12 bg-indigo-500 rounded-md shadow-md flex items-center justify-center border-2 border-indigo-600 relative">
    <span className="text-xl">🃏</span>
    <span className="absolute bottom-1 right-1 bg-white text-indigo-600 text-[10px] font-bold px-1 rounded-sm">FLASH</span>
  </div>
);

const PREVIEWS = {
  PDF: ({ fileUrl }) => <PdfPreview fileUrl={fileUrl} />,
  VID: ({ fileUrl }) => <VideoPreview fileUrl={fileUrl} />,
  QUI: ({ meta }) => <QuizPreview questionCount={meta?.question_count} />,
  FLC: ({ meta }) => <FlashCardPreview cardCount={meta?.card_count} />,
};

export const LABELS = {
  PDF: LabelPDF,
  VID: LabelVideo,
  QUI: LabelQuiz,
  FLC: LabelFlashCard,
};

export function PostCard({ title, type, fileUrl, date, onClick, stats, meta }) {
  const Preview = PREVIEWS[type] ?? PREVIEWS.VID;
  const Label = LABELS[type] ?? LabelVideo;

  return (
    <div
      onClick={onClick}
      className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer"
    >
      <Preview fileUrl={fileUrl} meta={meta} />

      <div className="absolute top-2 right-2">
        <Label />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h5 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 mb-1">
          {title}
        </h5>
        <span className="text-xs text-gray-400 mb-4">
          {formatDate(date)}
        </span>

        <div className="flex items-center justify-between mt-auto">
          <ReactionButton type="like" count={stats?.views}>
            <EyeIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </ReactionButton>
          <ReactionButton type="like" count={stats?.likes}>
            <HandThumbUpIcon className="w-4 h-4 text-gray-400" />
          </ReactionButton>
          <ReactionButton type="dislike" count={stats?.dislikes}>
            <HandThumbDownIcon className="w-4 h-4 text-gray-400" />
          </ReactionButton>
        </div>
      </div>
    </div>
  );
}
