
import Descargar from '../components/Descargar';
import Views from '../components/Views';
import ReactionsContainer from '../components/ReactionsContainer.jsx';

export  function DocumentInfo({document}) {
    return <section className="flex flex-col bg-transparent">
      <div className="flex justify-between">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">{document?.title}</h1>
      <date className="text-sm text-gray-500 mb-2">
        {document?.created_at && new Date(document.created_at).toLocaleDateString()}
      </date>
      </div>
      <p className="text-2xl font-semibold text-gray-800 leading-relaxed mb-4">
        {document?.description}
      </p>
      <div className="mb-10 w-full">
        <Descargar postId={document?.id}/>
      </div>
      <div className="flex items-center justify-between w-full pt-8 border-t border-gray-100">
        <Views views={document?.views} />
        <ReactionsContainer PostId={document?.id} />
      </div>
    </section>;
  }