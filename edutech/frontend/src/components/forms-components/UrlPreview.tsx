interface UrlPreviewProps {
  url: string;
}

export default function UrlPreview({ url }: UrlPreviewProps) {
  const getEmbedUrl = (rawUrl: string) => {
    if (rawUrl.includes("youtube.com/watch?v=")) return rawUrl.replace("watch?v=", "embed/");
    if (rawUrl.includes("youtu.be/")) return rawUrl.replace("youtu.be/", "youtube.com/embed/");
    return rawUrl;
  };

  return (
    <div className="w-full h-full border-2 border-solid border-gray-300 rounded-xl overflow-hidden bg-black flex items-center justify-center relative shadow-sm">
       <iframe
         src={getEmbedUrl(url)}
         className="absolute inset-0 w-full h-full"
         allowFullScreen
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
         title="URL Preview"
       />
    </div>
  );
}