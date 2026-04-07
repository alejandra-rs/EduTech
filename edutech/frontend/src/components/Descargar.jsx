import {getLinkDescarga}  from '@services/connections';

export default function Descargar({ postId, fileName = "documento.pdf" }) {
  console.log("descargando")
  return (
    <div className="w-full">
      <a 
        href={getLinkDescarga(postId)} 
        download={fileName}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full">
        <button className="w-full bg-[#2d2d2d] hover:bg-black text-white text-xs py-3 rounded-md transition-colors flex justify-center items-center font-medium uppercase">
          Descargar
        </button>
      </a>
    </div>
  );
}