export default function VisorVideo({ videoUrl }) {
  
  const getEmbedUrl = (url) => {
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
    <div className="w-full flex justify-center items-start p-2">
      <div className="w-full max-w-4xl aspect-video h-auto bg-black border border-zinc-300 rounded-lg overflow-hidden shadow-lg relative">
        
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
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
            <p className="text-sm">Enlace de video no válido o vacío</p>
          </div>
        )}
      </div>
    </div>
  );
}