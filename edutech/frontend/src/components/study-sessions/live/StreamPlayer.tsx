interface Props {
  twitchLink: string;
}

function buildEmbedUrl(twitchLink: string): string | null {
  const login = twitchLink.replace(/\/$/, "").split("/").pop();
  if (!login) return null;
  const parent = window.location.hostname;
  return `https://player.twitch.tv/?channel=${login}&parent=${parent}&autoplay=true&muted=true`;
}

export default function StreamPlayer({ twitchLink }: Props) {
  const embedUrl = buildEmbedUrl(twitchLink);

  return (
    <div className="flex-1 min-h-0 rounded-[32px] overflow-hidden bg-black shadow-2xl border border-gray-800">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          height="100%"
          width="100%"
          frameBorder="0"
          allow="autoplay"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
          title="Streaming en directo"
          className="w-full h-full"
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500 italic">
          Conectando con la sesión…
        </div>
      )}
    </div>
  );
}
