export interface VisorVideoProps {
  videoUrl?: string | null;
}

export default function VideoViewer({ videoUrl }: VisorVideoProps) {
  const getEmbedUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    let videoId = '';

    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="w-full flex justify-center items-start">
      <div className="w-full aspect-video h-auto bg-black border border-zinc-300 rounded-lg overflow-hidden shadow-lg relative">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="Reproductor de Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <p className="text-sm">Enlace de video no válido o vacío</p>
          </div>
        )}
      </div>
    </div>
  );
}
