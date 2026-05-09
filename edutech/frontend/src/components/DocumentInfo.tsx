import DownloadButton from './DownloadButton';
import { ViewsDisplay } from './interactions/Views';
import ReactionsContainer from './interactions/ReactionsContainer';
import type { PostPreview } from '../models/documents/post.model';

export interface DocumentInfoProps {
  document: PostPreview | null;
  showDownload?: boolean;
}

export function DocumentInfo({ document, showDownload = true }: DocumentInfoProps) {
  return (
    <section className="flex flex-col bg-transparent">
      <div className="flex justify-between">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">{document?.title}</h1>
        <time className="text-sm text-gray-500 mb-2" dateTime={document?.created_at}>
          {document?.created_at && new Date(document.created_at).toLocaleDateString()}
        </time>
      </div>
      <p className="text-2xl font-semibold text-gray-800 leading-relaxed mb-4">
        {(document as { description?: string } | null)?.description}
      </p>
      {showDownload && (
        <div className="mb-10 w-full">
          <DownloadButton postId={document?.id} />
        </div>
      )}
      <div className="flex items-center justify-between w-full pt-8 border-t border-gray-100">
        <ViewsDisplay views={document?.views} />
        <ReactionsContainer postId={document?.id ?? 0} />
      </div>
    </section>
  );
}
