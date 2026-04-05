import Like from './Like';
import Dislike from './Dislike';
import ReportComment from './ReportComment';

export default function Comentario() {
  return (
    <div className="bg-[#dfdfdf] rounded-lg p-5 sm:p-6 flex gap-4 w-full font-sans">
      <img 
        src="https://i.pravatar.cc/150?img=47" 
        alt="Avatar del usuario" 
        className="w-12 h-12 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Name Surname
        </h3>
        <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        <div className="flex justify-end items-center gap-5 mt-auto">
          <Like />
          <Dislike />
          <ReportComment />
        </div>
      </div>
    </div>
  );
}