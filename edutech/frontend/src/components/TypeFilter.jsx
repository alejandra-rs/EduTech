const LabelPDF = (selected) => {
    const color = selected ? "bg-red-700" : "bg-red-500";
    return (
      <div className={`w-16 h-12 ${color} rounded-md shadow-md flex items-center justify-center border-2 border-red-700 relative`}>
        <span className="text-3xl">📄</span>
        <span className="absolute bottom-1 right-1 bg-white text-red-700 text-[10px] font-bold px-1 rounded-sm">PDF</span>
      </div>
    );
};

const LabelVideo = (selected) => {
    const color = selected ? "bg-blue-700" : "bg-blue-500";
    return (
      <div className={`w-16 h-12 ${color} rounded-md shadow-md flex items-center justify-center border-2 border-blue-700 relative`}>
        <span className="text-xl text-white">▶</span>
        <span className="absolute bottom-1 right-1 bg-white text-blue-700 text-[10px] font-bold px-1 rounded-sm">VIDEO</span>
      </div>
    );
};