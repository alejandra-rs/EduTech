import { Button } from "flowbite-react";

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
    if (!url) return '';
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

export function PostCard({ title, type, fileUrl, date, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer"
    >
      
      {type === "PDF" ? (
        <PdfPreview fileUrl={fileUrl} />
      ) : (
        <VideoPreview fileUrl={fileUrl} />
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        
        <div className="flex justify-between items-start gap-2">
          <h5 className="text-xl font-bold text-gray-900 leading-tight">
            {title}
          </h5>
          <span className="text-xs text-gray-500 whitespace-nowrap mt-1">
            {formatDate(date)}
          </span>
        </div>

        {type === "PDF" ?  <LabelPDF /> :<LabelVideo /> }


      </div>
    </div>
  );
}