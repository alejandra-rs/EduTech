import { PostPreview } from "../../models/documents/post.model";

const PdfPreview = ({ fileUrl }: { fileUrl?: string }) => (
  <div className="w-full h-48 border-b border-gray-200 bg-gray-100 shrink-0">
    {fileUrl && <iframe src={fileUrl} className="w-full h-full" title="PDF preview" />}
  </div>
);

const VideoPreview = ({ fileUrl }: { fileUrl?: string }) => {
  const getEmbedUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.includes('embed/')) return url;
    const videoId = url.split('v=')[1]?.split('&')[0];
    const shortId = url.split('youtu.be/')[1]?.split('?')[0];
    const finalId = videoId || shortId;
    return finalId ? `https://www.youtube.com/embed/${finalId}` : url;
  };

  return (
    <div className="w-full h-48 border-b border-gray-200 bg-gray-100 shrink-0">
      {fileUrl && (
        <iframe
          src={getEmbedUrl(fileUrl)}
          className="w-full h-full"
          title="Video preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

const QuizPreview = ({ questionCount }: { questionCount?: number }) => (
  <div className="w-full h-48 border-b border-gray-200 bg-gradient-to-br from-orange-50 to-red-50 shrink-0 flex flex-col items-center justify-center gap-4 overflow-hidden">
    <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
      {questionCount ?? "?"} preguntas
    </span>
  </div>
);

const FlashCardPreview = ({ cardCount }: { cardCount?: number }) => (
  <div className="w-full h-48 border-b border-gray-200 bg-gradient-to-br from-indigo-50 to-violet-50 shrink-0 flex flex-col items-center justify-center gap-4 overflow-hidden">
    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
      {cardCount ?? "?"} tarjetas
    </span>
  </div>
);

export const PostPreviewVisual = ({ post }: { post: PostPreview }) => {
  switch (post.post_type) {
    case 'PDF': return <PdfPreview fileUrl={post.pdf?.file} />;
    case 'VID': return <VideoPreview fileUrl={post.vid?.vid} />;
    case 'QUI': return <QuizPreview questionCount={post.qui?.question_count} />;
    case 'FLA': return <FlashCardPreview cardCount={post.fla?.card_count} />;
    default: return null;
  }
};