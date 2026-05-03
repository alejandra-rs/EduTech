import { getLinkDescarga } from '@services/connections-documents';

export default function Descargar({ postId }) {
  const handleDownload = () => {
    window.open(getLinkDescarga(postId), '_blank');
  };

  return (
    <div className="w-full">
      <button
        onClick={handleDownload}
        className="w-full bg-[#2d2d2d] hover:bg-black text-white text-xs py-3 rounded-md transition-colors flex justify-center items-center font-medium uppercase"
      >
        Descargar
      </button>
    </div>
  );
}
