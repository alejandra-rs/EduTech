export default function Descargar({ pdfUrl, fileName = "documento.pdf" }) {
  return (
    <div className="w-full">
      <a 
        href={pdfUrl} 
        download={fileName}
        className="block w-full">
        <button className="w-full bg-[#2d2d2d] hover:bg-black text-white text-xs py-3 rounded-md transition-colors duration-200 flex justify-center items-center font-medium uppercase tracking-wider">
          Descargar
        </button>
      </a>
    </div>
  );
}